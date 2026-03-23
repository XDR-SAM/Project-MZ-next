import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getAllAuthors, getAllTags } from '@/lib/supabase-data';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const authors = await getAllAuthors();
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-1">
          Add a new blog post to your website
        </p>
      </div>

      <PostForm
        mode="create"
        authors={authors}
        tags={tags}
      />
    </div>
  );
}
