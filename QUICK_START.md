# 🚀 Quick Start Guide - Admin Dashboard

## 5-Minute Setup

### 1. Create Supabase Project (3 min)
```
1. Go to supabase.com → Sign in
2. New Project → Fill details → Create
3. Wait 2 minutes for setup
``` 
 
### 2. Run Database Migration (1 min) 
```
1. SQL Editor → New query 
2. Copy supabase-migration.sql contents 
3. Paste → Run 
```

### 3. Create Storage Buckets (1 min)
```
Storage → New bucket (repeat 3x):
- blog-images (public ✓)
- case-study-images (public ✓)
- author-avatars (public ✓)
```

### 4. Get API Keys (30 sec)
```
Settings → API
Copy:
- Project URL
- anon/public key
- service_role key (⚠️ keep secret!)
```

### 5. Update .env.local (30 sec)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 6. Create Admin User (1 min)
```
Authentication → Users → Add user
Email: admin@yourcompany.com
Password: ********
```

### 7. Launch! (10 sec)
```bash
npm run dev
http://localhost:3000/admin/login
```

---

## First Content (2 minutes)

### Add Tags
```
Table Editor → tags → Insert
Name: AI Strategy, Slug: ai-strategy
Name: ML Engineering, Slug: ml-engineering
Name: LLM Development, Slug: llm-development
```

### Add Author
```
Table Editor → authors → Insert
Name: Your Name
Email: your@email.com
Role: Your Role
Bio: Short bio
```

### Create First Post
```
Dashboard → New Post
Title: Hello World
Content: Write something
Featured Image: Upload
Tags: Click to select
Published: ✓
Create Post
```

**Done!** 🎉

---

## Common Tasks

### 🔑 Reset Admin Password
```
Supabase Dashboard → Authentication → Users
Find your user → ••• → Reset password
```

### 📸 Change Image Upload Size Limit
```
Storage → Settings → Select bucket
Update "File size limit" (default: 50MB)
```

### 🏷️ Add New Tag
```
Dashboard → Posts → Any post
Scroll to Tags → Click empty tag box
Type new tag name → Press Enter
```

### ✏️ Edit Published Post
```
Dashboard → Posts → Click post title
Make changes → Update → Save Changes
Changes go live immediately!
```

### 🗑️ Delete Content
```
Click trash icon → Confirm deletion
⚠️ Cannot be undone!
```

---

## URLs Cheat Sheet

| What | Where |
|------|-------|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Posts | `/admin/posts` |
| Case Studies | `/admin/case-studies` |
| Public Blog | `/blog` |
| Homepage | `/` |

---

## Troubleshooting (30 sec fixes)

**Can't login?**
→ Check credentials in Supabase Auth → Users

**Images not uploading?**
→ Verify storage buckets exist and are public

**No posts showing?**
→ Check Table Editor → posts table has data

**Database errors?**
→ Re-run supabase-migration.sql in SQL Editor

**Wrong API keys?**
→ Double-check .env.local vs Supabase Settings → API

---

## Pro Tips 💡

1. **Draft Mode**: Uncheck "Published" to save as draft
2. **Markdown**: Use `# Heading`, `**bold**`, `- lists` in content
3. **Auto-slug**: Title auto-generates slug (editable)
4. **Read Time**: Auto-calculated from word count
5. **Multiple Tags**: Click multiple tags to assign
6. **Quick Preview**: Click eye icon to view published post
7. **Keyboard Shortcuts**: 
   - `Ctrl+S` - Save (in some browsers)
   - `Enter` - Add feature/tag

---

## Next Steps

Once admin dashboard is working:

1. ✅ Create test post
2. ✅ Create test case study  
3. ✅ Upload images
4. ✅ Test on mobile
5. ⏭️ Update public pages to use dynamic data

See `ADMIN_SETUP.md` for full documentation.

---

**Need Help?** 
- Full guide: `ADMIN_SETUP.md`
- Implementation details: `IMPLEMENTATION_COMPLETE.md`
- Supabase docs: [docs.supabase.com](https://supabase.com/docs)

🚀 You got this!