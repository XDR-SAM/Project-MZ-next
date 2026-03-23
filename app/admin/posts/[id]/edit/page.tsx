import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { adminGetPostById, getAllAuthors, getAllTags } from '@/lib/supabase-data';
import PostForm from '@/components/admin/PostForm';

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const post = await adminGetPostById(params.id);

  if (!post) {
    notFound();
  }

  const authors = await getAllAuthors();
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-1">
          Update your blog post
        </p>
      </div>

      <PostForm
        mode="edit"
        post={post}
        authors={authors}
        tags={tags}
      />
    </div>
  );
}
