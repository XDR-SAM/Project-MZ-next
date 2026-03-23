import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { adminGetAllCaseStudies } from '@/lib/supabase-data';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function AdminCaseStudiesPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const caseStudies = await adminGetAllCaseStudies();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-muted-foreground mt-1">
            Showcase your best work and projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="mr-2 h-4 w-4" />
            New Case Study
          </Link>
        </Button>
      </div>

      {/* Case Studies List */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({caseStudies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {caseStudies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No case studies yet. Add your first project to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {caseStudies.map((cs) => (
                <div
                  key={cs.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{cs.project_title}</h3>
                      {cs.published ? (
                        <Badge variant="default" className="text-xs">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Client: {cs.client_name}</span>
                      <span>•</span>
                      <time dateTime={cs.created_at}>
                        {new Date(cs.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {cs.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={cs.project_link || '#'} target="_blank">
                        {cs.published ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/case-studies/${cs.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <DeleteCaseStudyButton caseStudyId={cs.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Client component for delete functionality
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteCaseStudyButton({ caseStudyId }: { caseStudyId: string }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', caseStudyId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this case study? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
