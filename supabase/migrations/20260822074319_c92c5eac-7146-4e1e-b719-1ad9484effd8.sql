CREATE OR REPLACE FUNCTION public.search_profiles(q text)
RETURNS TABLE(id uuid, display_name text, username text, avatar_url text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  RETURN QUERY
    SELECT p.id, p.display_name, p.username, p.avatar_url
    FROM public.profiles p
    WHERE q <> ''
      AND (p.display_name ILIKE '%' || q || '%' OR p.username ILIKE '%' || q || '%')
    ORDER BY p.display_name
    LIMIT 20;
END;
$function$;

CREATE OR REPLACE FUNCTION public.public_stats(target uuid, days integer DEFAULT 30)
RETURNS TABLE(user_id uuid, display_name text, sessions integer, total_volume numeric, total_sets integer, last_date date)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  RETURN QUERY
    SELECT
      p.id,
      p.display_name,
      COALESCE(agg.sessions, 0)::int,
      COALESCE(agg.total_volume, 0)::numeric,
      COALESCE(agg.total_sets, 0)::int,
      agg.last_date
    FROM public.profiles p
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int AS sessions,
        SUM(COALESCE((w.data ->> 'volume')::numeric, 0)) AS total_volume,
        SUM(COALESCE((w.data ->> 'sets')::int, 0)) AS total_sets,
        MAX(w.date) AS last_date
      FROM public.workout_days w
      WHERE w.user_id = p.id
        AND w.date >= (CURRENT_DATE - days)
        AND COALESCE((w.data ->> 'volume')::numeric, 0) > 0
    ) agg ON true
    WHERE p.id = target;
END;
$function$;

REVOKE ALL ON FUNCTION public.search_profiles(text) FROM anon, public;
REVOKE ALL ON FUNCTION public.public_stats(uuid, integer) FROM anon, public;
REVOKE ALL ON FUNCTION public.delete_my_account() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.search_profiles(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.public_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;