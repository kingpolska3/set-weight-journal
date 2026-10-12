CREATE OR REPLACE FUNCTION public.separate_trainer_client_intake() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE safe_data jsonb;
BEGIN
  IF (NEW.data ? 'goal' OR NEW.data ? 'trainingDays' OR NEW.data ? 'intake') AND (auth.uid() = NEW.owner_id OR auth.role() = 'service_role') THEN
    INSERT INTO public.trainer_client_private(plan_id, data)
    VALUES (NEW.id, jsonb_build_object('goal', COALESCE(NEW.data->'goal','""'::jsonb), 'trainingDays', COALESCE(NEW.data->'trainingDays','[]'::jsonb), 'intake', COALESCE(NEW.data->'intake','{}'::jsonb)))
    ON CONFLICT (plan_id) DO UPDATE SET data = EXCLUDED.data;
  END IF;
  safe_data := jsonb_build_object('id', NEW.data->'id', 'name', NEW.data->'name', 'days', COALESCE(NEW.data->'days','[]'::jsonb));
  IF NEW.data IS DISTINCT FROM safe_data THEN
    UPDATE public.trainer_plans SET data = safe_data WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.separate_trainer_client_intake() FROM PUBLIC, anon, authenticated;