/*
# Fix first-admin promotion result handling

1. Correctness
- Return PostgreSQL's `FOUND` result directly after the role update.
- Avoid assigning the numeric row count diagnostic to a boolean value.

2. Security
- Keep the transaction advisory lock and the existing authenticated-only execution grant.
- Preserve the rule that promotion succeeds only when no administrator exists.
*/

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
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

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
