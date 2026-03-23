-- ============================================
-- FIX STORAGE BUCKET RLS POLICIES
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. First, make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own images" ON storage.objects;

-- 3. Create new policies for authenticated users

-- Policy: Allow anyone to read/view images (since bucket is public)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- 4. Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;
