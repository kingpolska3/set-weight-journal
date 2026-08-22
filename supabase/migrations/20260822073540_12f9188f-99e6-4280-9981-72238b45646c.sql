ALTER TABLE public.profiles ADD COLUMN share_full boolean NOT NULL DEFAULT false;

CREATE POLICY "workout_days_shared_read" ON public.workout_days
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = workout_days.user_id AND p.share_full = true
  )
);