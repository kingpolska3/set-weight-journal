CREATE TABLE public.trainer_client_private (
  plan_id uuid PRIMARY KEY REFERENCES public.trainer_plans(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainer_client_private TO authenticated;
GRANT ALL ON public.trainer_client_private TO service_role;
ALTER TABLE public.trainer_client_private ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads client intake" ON public.trainer_client_private FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.trainer_plans p WHERE p.id = plan_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owner inserts client intake" ON public.trainer_client_private FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.trainer_plans p WHERE p.id = plan_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owner updates client intake" ON public.trainer_client_private FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.trainer_plans p WHERE p.id = plan_id AND p.owner_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.trainer_plans p WHERE p.id = plan_id AND p.owner_id = auth.uid()));
CREATE POLICY "Owner deletes client intake" ON public.trainer_client_private FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.trainer_plans p WHERE p.id = plan_id AND p.owner_id = auth.uid()));
INSERT INTO public.trainer_client_private(plan_id, data)
SELECT id, jsonb_build_object('goal', COALESCE(data->'goal', '""'::jsonb), 'trainingDays', COALESCE(data->'trainingDays', '[]'::jsonb), 'intake', COALESCE(data->'intake', '{}'::jsonb)) FROM public.trainer_plans;
UPDATE public.trainer_plans SET data = jsonb_build_object('id', data->'id', 'name', data->'name', 'days', COALESCE(data->'days', '[]'::jsonb));
CREATE FUNCTION public.separate_trainer_client_intake() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (NEW.data ? 'goal' OR NEW.data ? 'trainingDays' OR NEW.data ? 'intake') AND (auth.uid() = NEW.owner_id OR auth.role() = 'service_role') THEN
    INSERT INTO public.trainer_client_private(plan_id, data)
    VALUES (NEW.id, jsonb_build_object('goal', COALESCE(NEW.data->'goal','""'::jsonb), 'trainingDays', COALESCE(NEW.data->'trainingDays','[]'::jsonb), 'intake', COALESCE(NEW.data->'intake','{}'::jsonb)))
    ON CONFLICT (plan_id) DO UPDATE SET data = EXCLUDED.data;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.separate_trainer_client_intake() FROM PUBLIC, anon, authenticated;
CREATE FUNCTION public.clean_shared_trainer_plan() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.data := jsonb_build_object('id', NEW.data->'id', 'name', NEW.data->'name', 'days', COALESCE(NEW.data->'days','[]'::jsonb));
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.clean_shared_trainer_plan() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER trainer_plan_private_extract AFTER INSERT OR UPDATE OF data ON public.trainer_plans FOR EACH ROW EXECUTE FUNCTION public.separate_trainer_client_intake();
COMMENT ON TABLE public.trainer_client_private IS 'Owner-only trainee goals, availability, medical intake and coach notes; never shared with recipients.';