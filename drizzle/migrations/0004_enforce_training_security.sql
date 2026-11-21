CREATE TYPE public.app_role AS ENUM ('trainer');
CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 role public.app_role NOT NULL,
 UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_read_own ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
INSERT INTO public.user_roles (user_id, role) SELECT DISTINCT owner_id, 'trainer'::public.app_role FROM public.trainer_plans ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT auth.uid() = _user_id AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
ALTER POLICY "own plans insert" ON public.trainer_plans WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer'));
ALTER FUNCTION public.public_stats(uuid, integer) SECURITY INVOKER;

ALTER TABLE public.plan_shares ADD COLUMN grant_source text NOT NULL DEFAULT 'legacy';
ALTER TABLE public.plan_shares ADD COLUMN claimed_token uuid;
ALTER TABLE public.plan_shares ADD CONSTRAINT plan_shares_source_valid CHECK (grant_source IN ('legacy','direct','link'));
UPDATE public.plan_shares s SET claimed_token = p.link_token FROM public.trainer_plans p WHERE p.id = s.plan_id AND s.grant_source = 'legacy';
CREATE OR REPLACE FUNCTION public.plan_access(_plan uuid, _user uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT CASE WHEN auth.uid() IS NULL OR auth.uid() <> _user THEN NULL
 WHEN EXISTS (SELECT 1 FROM public.trainer_plans WHERE id = _plan AND owner_id = _user) THEN 'owner'
 ELSE (SELECT CASE WHEN s.grant_source = 'direct' THEN CASE WHEN s.can_edit THEN 'edit' ELSE 'view' END
                  WHEN p.link_access = 'edit' THEN 'edit' ELSE 'view' END
       FROM public.plan_shares s JOIN public.trainer_plans p ON p.id = s.plan_id
       WHERE s.plan_id = _plan AND s.user_id = _user
       AND (s.grant_source = 'direct' OR (p.link_access <> 'none' AND s.claimed_token = p.link_token))) END;
$$;
REVOKE ALL ON FUNCTION public.plan_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.plan_access(uuid, uuid) TO authenticated;
ALTER POLICY "see own shares or owner" ON public.plan_shares USING ((user_id = auth.uid() AND public.plan_access(plan_id, auth.uid()) IS NOT NULL) OR public.plan_access(plan_id, auth.uid()) = 'owner');
CREATE OR REPLACE FUNCTION public.claim_plan_link(_token uuid) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE p public.trainer_plans;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not allowed'; END IF;
 SELECT * INTO p FROM public.trainer_plans WHERE link_token = _token AND link_access <> 'none' FOR SHARE;
 IF p.id IS NULL THEN RETURN NULL; END IF;
 IF p.owner_id <> auth.uid() THEN
  INSERT INTO public.plan_shares(plan_id,user_id,can_edit,grant_source,claimed_token) VALUES (p.id,auth.uid(),p.link_access='edit','link',_token)
  ON CONFLICT (plan_id,user_id) DO UPDATE SET can_edit = EXCLUDED.can_edit, grant_source = 'link', claimed_token = EXCLUDED.claimed_token
  WHERE plan_shares.grant_source <> 'direct';
 END IF;
 RETURN p.id;
END;
$$;
CREATE OR REPLACE FUNCTION public.share_plan(_plan uuid, _ident text, _can_edit boolean) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target uuid; ident text := lower(trim(both '@ ' from _ident));
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS (SELECT 1 FROM public.trainer_plans WHERE id = _plan AND owner_id = auth.uid()) THEN RAISE EXCEPTION 'not allowed'; END IF;
 SELECT id INTO target FROM public.profiles WHERE lower(username) = ident LIMIT 1;
 IF target IS NULL THEN SELECT id INTO target FROM auth.users WHERE lower(email) = ident LIMIT 1; END IF;
 IF target IS NULL THEN RETURN 'not_found'; END IF;
 IF target = auth.uid() THEN RETURN 'self'; END IF;
 INSERT INTO public.plan_shares(plan_id,user_id,can_edit,grant_source,claimed_token) VALUES (_plan,target,_can_edit,'direct',NULL)
 ON CONFLICT (plan_id,user_id) DO UPDATE SET can_edit = EXCLUDED.can_edit, grant_source = 'direct', claimed_token = NULL;
 RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.claim_plan_link(uuid), public.share_plan(uuid,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_plan_link(uuid), public.share_plan(uuid,text,boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_booking_authority() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE caller text := auth.uid()::text; trainer boolean;
BEGIN
 IF auth.role() = 'service_role' THEN RETURN NEW; END IF;
 IF caller IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
 IF jsonb_typeof(NEW.data) <> 'object' OR NEW.data->>'id' IS DISTINCT FROM NEW.id
 OR COALESCE(NEW.data->>'trainerId','') = '' OR COALESCE(NEW.data->>'clientId','') = ''
 OR COALESCE(NEW.data->>'status','') NOT IN ('pending','confirmed','declined','cancelled','completed') THEN RAISE EXCEPTION 'invalid booking'; END IF;
 trainer := NEW.data->>'trainerId' = caller AND public.has_role(auth.uid(), 'trainer');
 IF TG_OP = 'INSERT' THEN
  IF NEW.owner_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'invalid owner'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (NEW.data->>'trainerId')::uuid AND role = 'trainer') AND trainer THEN RAISE EXCEPTION 'trainer required'; END IF;
  IF NOT trainer AND (NEW.data->>'clientId' <> caller OR NEW.data->>'status' <> 'pending') THEN RAISE EXCEPTION 'trainer approval required'; END IF;
 ELSE
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.owner_id IS DISTINCT FROM OLD.owner_id
   OR NEW.data->>'trainerId' IS DISTINCT FROM OLD.data->>'trainerId'
   OR NEW.data->>'clientId' IS DISTINCT FROM OLD.data->>'clientId' THEN RAISE EXCEPTION 'booking participants are immutable'; END IF;
  IF NOT trainer THEN
   IF OLD.data->>'clientId' <> caller THEN RAISE EXCEPTION 'not allowed'; END IF;
   IF NEW.data->>'status' IS DISTINCT FROM OLD.data->>'status' AND NOT (OLD.data->>'status' IN ('pending','confirmed') AND NEW.data->>'status' = 'cancelled') THEN RAISE EXCEPTION 'trainer approval required'; END IF;
   IF (NEW.data - ARRAY['status','note','updatedAt','reminderSent','googleEventId']) IS DISTINCT FROM (OLD.data - ARRAY['status','note','updatedAt','reminderSent','googleEventId']) THEN RAISE EXCEPTION 'only trainer can change appointment'; END IF;
  END IF;
 END IF;
 NEW.updated_at := now();
 NEW.data := jsonb_set(NEW.data, '{updatedAt}', to_jsonb(NEW.updated_at));
 RETURN NEW;
END;
$$;
CREATE TRIGGER bookings_authority BEFORE INSERT OR UPDATE ON public.trainer_bookings FOR EACH ROW EXECUTE FUNCTION public.guard_booking_authority();
DROP POLICY bookings_select_own ON public.trainer_bookings;
DROP POLICY bookings_insert_own ON public.trainer_bookings;
DROP POLICY bookings_update_related ON public.trainer_bookings;
DROP POLICY bookings_delete_own ON public.trainer_bookings;
CREATE POLICY bookings_read_participants ON public.trainer_bookings FOR SELECT TO authenticated USING (data->>'clientId' = auth.uid()::text OR data->>'trainerId' = auth.uid()::text);
CREATE POLICY bookings_create_participant ON public.trainer_bookings FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND (data->>'clientId' = auth.uid()::text OR (data->>'trainerId' = auth.uid()::text AND public.has_role(auth.uid(),'trainer'))));
CREATE POLICY bookings_update_participant ON public.trainer_bookings FOR UPDATE TO authenticated USING (data->>'clientId' = auth.uid()::text OR (data->>'trainerId' = auth.uid()::text AND public.has_role(auth.uid(),'trainer'))) WITH CHECK (data->>'clientId' = auth.uid()::text OR (data->>'trainerId' = auth.uid()::text AND public.has_role(auth.uid(),'trainer')));
CREATE POLICY bookings_delete_trainer ON public.trainer_bookings FOR DELETE TO authenticated USING (data->>'trainerId' = auth.uid()::text AND public.has_role(auth.uid(),'trainer'));
REVOKE ALL ON public.trainer_bookings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainer_bookings TO authenticated;
GRANT ALL ON public.trainer_bookings TO service_role;
COMMENT ON COLUMN public.user_settings.trainer_bookings IS 'DEPRECATED: booking authority is enforced in public.trainer_bookings; settings copies are not authoritative';