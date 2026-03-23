# Admin Dashboard Setup Guide

This guide will help you set up the Supabase backend and admin dashboard for your Next.js website.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- Your Next.js project running

## Step 1: Set Up Supabase Project

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

Wait a few minutes for your project to be set up.

### 1.2 Run Database Migration

1. In your Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-migration.sql` from your project
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

This will create all necessary tables, indexes, and security policies.

### 1.3 Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create these three buckets:
   - `blog-images` (Public bucket)
   - `case-study-images` (Public bucket)
   - `author-avatars` (Public bucket)

For each bucket:
- Toggle **"Public bucket"** to ON
- Click **"Create bucket"**

### 1.4 Create Admin User

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"**
3. Select **"Email and password"**
4. Enter:
   - **Email**: Your admin email
   - **Password**: Secure password (save it!)
5. Click **"Add user"**

### 1.5 Get API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public** key (under "Project API keys")
3. Go to **Settings** → **API keys**
4. Copy the **service_role** key (⚠️ Keep this secret!)

## Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Important**: 
- Never commit `.env.local` to git
- The `.env.local.example` file is safe to commit
- Keep your service role key secret!

## Step 3: Install Dependencies

The required packages are already installed:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Step 4: Add Initial Data (Optional)

You can add some initial data through the Supabase Dashboard:

### Add Authors

1. Go to **Table Editor** → **authors** table
2. Click **"Insert"** → **"New row"**
3. Add authors like:
   ```
   Name: Sarah Chen
   Email: sarah@example.com
   Role: AI Strategy Lead
   Bio: Expert in AI implementation...
   ```

### Add Tags

1. Go to **Table Editor** → **tags** table
2. Click **"Insert"** → **"New row"**
3. Add tags like:
   ```
   Name: AI Strategy
   Slug: ai-strategy
   
   Name: ML Engineering
   Slug: ml-engineering
   
   Name: LLM Development
   Slug: llm-development
   ```

## Step 5: Access the Admin Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/admin/login`

3. Log in with the credentials you created in Step 1.4

4. You'll be redirected to the dashboard at `/admin/dashboard`

## Step 6: Create Your First Blog Post

1. From the dashboard, click **"New Post"**
2. Fill in the form:
   - **Title**: Your blog post title
   - **Slug**: Auto-generated (e.g., `my-first-post`)
   - **Excerpt**: Brief description
   - **Content**: Full content (Markdown supported)
   - **Featured Image**: Upload an image
   - **Author**: Select from dropdown
   - **Tags**: Click to select
   - **Published**: Check when ready
3. Click **"Create Post"**

## Step 7: Create Your First Case Study

1. From the dashboard, click **"New Case Study"**
2. Fill in the form:
   - **Project Title**: Name of the project
   - **Client Name**: Company/client name
   - **Description**: Brief overview
   - **Main Image**: Upload project screenshot
   - **Logo**: Upload company logo (optional)
   - **Features**: Add key achievements (one per line)
   - **Testimonial**: Client quote (optional)
   - **Published**: Check when ready
3. Click **"Create Case Study"**

## File Structure Overview

```
app/
├── admin/                    # Admin dashboard routes
│   ├── layout.tsx           # Admin layout with sidebar
│   ├── login/page.tsx       # Login page
│   ├── dashboard/page.tsx   # Dashboard home
│   ├── posts/               # Blog post management
│   │   ├── page.tsx         # List all posts
│   │   ├── new/page.tsx     # Create new post
│   │   └── [id]/edit/page.tsx  # Edit post
│   └── case-studies/        # Case study management
│       ├── page.tsx         # List all case studies
│       ├── new/page.tsx     # Create new case study
│       └── [id]/edit/page.tsx  # Edit case study

components/admin/
├── PostForm.tsx             # Reusable post form
└── CaseStudyForm.tsx        # Reusable case study form

lib/
├── supabase.ts              # Supabase client setup
└── supabase-data.ts         # Data fetching utilities

types/
└── supabase.ts              # TypeScript type definitions

.env.local                   # Environment variables
supabase-migration.sql       # Database schema
```

## Features Implemented

✅ **Authentication**
- Secure login with Supabase Auth
- Protected admin routes
- Session management

✅ **Blog Posts Management**
- Create, edit, delete posts
- Rich text editor support (Markdown)
- Image upload to Supabase Storage
- Tag management
- Draft/Published status
- SEO metadata fields

✅ **Case Studies Management**
- Create, edit, delete case studies
- Multiple image uploads
- Feature/achievement list
- Testimonial section
- Project links

✅ **Dashboard**
- Overview statistics
- Quick actions
- Content management overview

## Next Steps: Update Frontend Pages

To make your public pages use the dynamic data from Supabase, you need to update:

1. **Blog Listing Page** (`app/blog/page.tsx`)
2. **Blog Post Page** (`app/blog/[slug]/page.tsx`)
3. **Case Studies Section** (`components/landing/CaseStudiesSection.tsx`)

These files currently use static data and need to be updated to fetch from Supabase.

## Troubleshooting

### Can't access admin dashboard?
- Make sure you're logged in at `/admin/login`
- Check browser console for errors
- Verify your Supabase URL and keys in `.env.local`

### Images not uploading?
- Ensure storage buckets are created and public
- Check that bucket names match exactly: `blog-images`, `case-study-images`, `author-avatars`

### Database errors?
- Verify the migration ran successfully
- Check Table Editor to see if tables exist
- Ensure RLS policies are created

### Need to reset everything?
- Delete your Supabase project and start over, OR
- Drop all tables in SQL Editor and re-run migration

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Public can only view published content
- Only authenticated admins can create/edit/delete
- Service role key has full access - keep it secret!
- Never expose service role key in client-side code

## Support

If you run into issues:
1. Check the Supabase Dashboard logs
2. Review browser console for errors
3. Verify all environment variables are correct
4. Ensure database migration completed successfully

---

**Ready to customize?** All the code is in place - just configure your Supabase project and start creating content! 🚀
