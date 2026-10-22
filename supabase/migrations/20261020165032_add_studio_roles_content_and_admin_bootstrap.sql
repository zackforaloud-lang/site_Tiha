/*
# Add studio roles, managed content, media, SEO, and first-admin bootstrap

1. New Tables
- `profiles`: one row per authenticated account, with a server-controlled `role` of `user` or `admin`.
- `content_items`: blog posts and showcase projects managed by admins.
- `media_assets`: photo metadata and storage paths managed by admins.
- `site_seo`: public page metadata managed by admins.

2. Content Columns
- `content_items.content_type`: `blog` or `project`.
- `content_items.title`, `slug`, `excerpt`, `body`: editorial content.
- `content_items.image_url`, `image_alt`: the lead image and accessible description.
- `content_items.category`, `published`, `sort_date`: catalog and publication controls.
- `content_items.seo_title`, `seo_description`: per-item search metadata.
- `content_items.created_by`: server-filled author account.
- `media_assets.file_path`, `public_url`, `alt_text`, `caption`: managed photo data.
- `site_seo.page_key`, `title`, `description`, `og_image_url`: page-level SEO data.

3. Security
- RLS is enabled on every new table.
- Anonymous and authenticated visitors can read only published content and public SEO/media data.
- Only authenticated admins can create, edit, or delete managed content, media, and SEO records.
- Account roles are not client-writable.
- `bootstrap_first_admin()` allows the first authenticated account to become admin only when no admin exists.
- Storage writes are admin-only; public reads are limited to the studio media bucket.

4. Important Notes
- No password or administrator email is stored in this migration.
- Supabase Auth owns passwords and sessions.
- The bootstrap function becomes unavailable for promotion once any admin exists.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('blog', 'project')),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  image_alt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Запись',
  published boolean NOT NULL DEFAULT false,
  sort_date date NOT NULL DEFAULT CURRENT_DATE,
  seo_title text,
  seo_description text,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_seo (
  page_key text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  og_image_url text,
  updated_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_items_published_date_idx
  ON public.content_items (published, sort_date DESC);
CREATE INDEX IF NOT EXISTS content_items_type_date_idx
  ON public.content_items (content_type, sort_date DESC);

CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_seo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (id = auth.uid());
DROP POLICY IF EXISTS "profiles_update_own_public" ON public.profiles;
CREATE POLICY "profiles_update_own_public" ON public.profiles FOR UPDATE
  TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "content_select_published_or_admin" ON public.content_items;
CREATE POLICY "content_select_published_or_admin" ON public.content_items FOR SELECT
  TO anon, authenticated USING (published = true OR (auth.uid() IS NOT NULL AND public.is_admin()));
DROP POLICY IF EXISTS "content_insert_admin" ON public.content_items;
CREATE POLICY "content_insert_admin" ON public.content_items FOR INSERT
  TO authenticated WITH CHECK (public.is_admin() AND created_by = auth.uid());
DROP POLICY IF EXISTS "content_update_admin" ON public.content_items;
CREATE POLICY "content_update_admin" ON public.content_items FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "content_delete_admin" ON public.content_items;
CREATE POLICY "content_delete_admin" ON public.content_items FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "media_select_public_or_admin" ON public.media_assets;
CREATE POLICY "media_select_public_or_admin" ON public.media_assets FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "media_insert_admin" ON public.media_assets;
CREATE POLICY "media_insert_admin" ON public.media_assets FOR INSERT
  TO authenticated WITH CHECK (public.is_admin() AND created_by = auth.uid());
DROP POLICY IF EXISTS "media_update_admin" ON public.media_assets;
CREATE POLICY "media_update_admin" ON public.media_assets FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "media_delete_admin" ON public.media_assets;
CREATE POLICY "media_delete_admin" ON public.media_assets FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "seo_select_public" ON public.site_seo;
CREATE POLICY "seo_select_public" ON public.site_seo FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "seo_insert_admin" ON public.site_seo;
CREATE POLICY "seo_insert_admin" ON public.site_seo FOR INSERT
  TO authenticated WITH CHECK (public.is_admin() AND updated_by = auth.uid());
DROP POLICY IF EXISTS "seo_update_admin" ON public.site_seo;
CREATE POLICY "seo_update_admin" ON public.site_seo FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "seo_delete_admin" ON public.site_seo;
CREATE POLICY "seo_delete_admin" ON public.site_seo FOR DELETE
  TO authenticated USING (public.is_admin());

REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name, avatar_url) ON public.profiles TO authenticated;
REVOKE INSERT, UPDATE ON public.content_items FROM authenticated;
GRANT INSERT (content_type, title, slug, excerpt, body, image_url, image_alt, category, published, sort_date, seo_title, seo_description) ON public.content_items TO authenticated;
GRANT UPDATE (content_type, title, slug, excerpt, body, image_url, image_alt, category, published, sort_date, seo_title, seo_description) ON public.content_items TO authenticated;
REVOKE INSERT, UPDATE ON public.media_assets FROM authenticated;
GRANT INSERT (file_path, public_url, alt_text, caption) ON public.media_assets TO authenticated;
GRANT UPDATE (file_path, public_url, alt_text, caption) ON public.media_assets TO authenticated;
REVOKE INSERT, UPDATE ON public.site_seo FROM authenticated;
GRANT INSERT (page_key, title, description, og_image_url) ON public.site_seo TO authenticated;
GRANT UPDATE (page_key, title, description, og_image_url) ON public.site_seo TO authenticated;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('studio-media', 'studio-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "studio_media_public_read" ON storage.objects;
CREATE POLICY "studio_media_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'studio-media');
DROP POLICY IF EXISTS "studio_media_admin_insert" ON storage.objects;
CREATE POLICY "studio_media_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'studio-media' AND public.is_admin());
DROP POLICY IF EXISTS "studio_media_admin_update" ON storage.objects;
CREATE POLICY "studio_media_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'studio-media' AND public.is_admin()) WITH CHECK (bucket_id = 'studio-media' AND public.is_admin());
DROP POLICY IF EXISTS "studio_media_admin_delete" ON storage.objects;
CREATE POLICY "studio_media_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'studio-media' AND public.is_admin());
