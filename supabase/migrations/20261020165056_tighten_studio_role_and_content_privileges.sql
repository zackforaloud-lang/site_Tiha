/*
# Tighten studio privileges and first-admin promotion

1. Security hardening
- Remove anonymous INSERT, UPDATE, and DELETE privileges from managed tables.
- Remove direct RPC access to the profile trigger helper.
- Explicitly remove anonymous execution from role helpers.
- Keep authenticated execution only where the RLS policies need the helper or the signed-in bootstrap flow calls it.

2. First-admin safety
- Serialize `bootstrap_first_admin()` with a transaction advisory lock.
- Check for an existing administrator after acquiring the lock.
- This prevents two simultaneous first-login requests from promoting two accounts.

3. Data safety
- No rows or columns are deleted.
- Public SELECT access for published content, media metadata, and SEO remains unchanged.
*/

REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.content_items FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.media_assets FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.site_seo FROM anon;

REVOKE ALL ON FUNCTION public.handle_new_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_profile() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  promoted boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  PERFORM pg_advisory_xact_lock(81420931);

  IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = auth.uid() AND role = 'user';

  GET DIAGNOSTICS promoted = ROW_COUNT;
  RETURN promoted;
END;
$$;
