DROP POLICY IF EXISTS "read own or shared" ON public.trainer_plans;
CREATE POLICY "read own or shared" ON public.trainer_plans FOR SELECT TO authenticated USING (owner_id = auth.uid() OR public.plan_access(id, auth.uid()) IS NOT NULL);
DROP POLICY IF EXISTS "update own or editable" ON public.trainer_plans;
CREATE POLICY "update own or editable" ON public.trainer_plans FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.plan_access(id, auth.uid()) = 'edit') WITH CHECK (owner_id = auth.uid() OR public.plan_access(id, auth.uid()) = 'edit');