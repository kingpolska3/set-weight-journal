DROP POLICY IF EXISTS workout_days_shared_read ON public.workout_days;

CREATE POLICY workout_days_shared_read
ON public.workout_days
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND auth.uid() <> workout_days.user_id
  AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = workout_days.user_id
      AND p.share_full = true
  )
);