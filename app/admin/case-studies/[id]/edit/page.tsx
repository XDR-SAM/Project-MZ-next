import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { adminGetCaseStudyById } from '@/lib/supabase-data';
import CaseStudyForm from '@/components/admin/CaseStudyForm';

export default async function EditCaseStudyPage({
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

  const caseStudy = await adminGetCaseStudyById(params.id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Case Study</h1>
        <p className="text-muted-foreground mt-1">
          Update your project showcase
        </p>
      </div>

      <CaseStudyForm mode="edit" caseStudy={caseStudy} />
    </div>
  );
}
