REVOKE ALL ON FUNCTION public.search_profiles(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.public_stats(uuid, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_profiles(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.public_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;