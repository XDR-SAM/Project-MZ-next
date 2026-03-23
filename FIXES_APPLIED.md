# Fixes Applied ✅

## Issue 1: Session Lost on Page Refresh - FIXED

**Problem:** When refreshing the browser, authentication was lost and you had to login again.

**Root Cause:** The auth state wasn't being properly tracked across page refreshes.

**Solution Applied:**
- Updated `app/admin/layout.tsx` to use Supabase's `onAuthStateChange` listener
- Now properly listens for token refresh events (`TOKEN_REFRESHED`)
- Session persists across page refreshes using Supabase's built-in session management

**What Changed:**
```typescript
// Before: Only checked once in useEffect
useEffect(() => {
  checkAuth();
}, []);

// After: Listens to all auth state changes
useEffect(() => {
  checkAuth();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && session) {
      // Session refreshed - user stays logged in!
      setIsAuthenticated(true);
      setLoading(false);
    }
    // Handle other events...
  });
  
  return () => subscription.unsubscribe();
}, []);
```

---

## Issue 2: Image Upload RLS Policy Error - FIX REQUIRED

**Problem:** Getting error "new row violates row-level security policy" when uploading images.

**Root Cause:** Supabase storage bucket policies are too restrictive.

**Solution:** Run the SQL migration to update storage policies.

### 🔧 Steps to Fix:

1. **Go to your Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the SQL from:**
   - File location: `fix-storage-policies.sql` in your project root
   - Or copy from the code block below

4. **Click "Run"** to execute the SQL

5. **Verify it worked:**
   - Go to Storage → `blog-images` bucket
   - Try uploading an image from the admin panel

### 📝 SQL Migration Code:

```sql
-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own images" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');
```

---

## ✅ What These Policies Do:

1. **Public Read Access** - Anyone can view images (needed for your blog pages)
2. **Authenticated Upload** - Logged-in admins can upload images
3. **Authenticated Delete** - Logged-in admins can delete images
4. **Authenticated Update** - Logged-in admins can update images

---

## Testing Checklist:

After applying both fixes:

- [ ] Login to admin panel (`/admin/login`)
- [ ] Refresh the page - should stay logged in ✅
- [ ] Go to create post (`/admin/posts/new`)
- [ ] Upload an image - should work without RLS error ✅
- [ ] Save the post - should save successfully ✅
- [ ] View the post on blog page - image should load ✅

---

## Why This Happened:

### Session Issue:
Supabase uses JWT tokens that expire and need refreshing. Without listening to the `TOKEN_REFRESHED` event, the app didn't know the session was still valid after refresh.

### RLS Issue:
Supabase's default storage policies are very restrictive for security. They don't automatically allow authenticated users to upload files - you need explicit policies.

---

## Files Modified:

1. ✅ `app/admin/layout.tsx` - Fixed session persistence
2. ✅ Created `fix-storage-policies.sql` - SQL migration for storage bucket

---

## Next Steps:

1. **IMMEDIATE:** Run the SQL migration in Supabase dashboard
2. **TEST:** Try uploading an image after running the SQL
3. **VERIFY:** Both issues should be completely resolved

Let me know once you've run the SQL migration and we can test everything! 🚀
