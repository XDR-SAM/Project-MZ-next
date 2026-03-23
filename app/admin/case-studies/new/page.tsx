import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import CaseStudyForm from '@/components/admin/CaseStudyForm';

export default async function NewCaseStudyPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Case Study</h1>
        <p className="text-muted-foreground mt-1">
          Add a new project showcase to your website
        </p>
      </div>

      <CaseStudyForm mode="create" />
    </div>
  );
}
