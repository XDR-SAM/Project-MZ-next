import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getDashboardStats } from '@/lib/supabase-data';
import Link from 'next/link';
import { FileText, FolderOpen, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your content.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.publishedPosts} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCaseStudies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Projects showcased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/posts/new">
                  New Post
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/case-studies/new">
                  New Case Study
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Posts</CardTitle>
            <CardDescription>
              Create, edit, and manage blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="font-medium">Blog Posts</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.totalPosts} total • {stats.publishedPosts} published
                  </p>
                </div>
                <Button asChild variant="ghost">
                  <Link href="/admin/posts">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href="/admin/posts/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/blog" target="_blank">
                    View Site
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Case Studies</CardTitle>
            <CardDescription>
              Showcase your best work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="font-medium">Projects</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.totalCaseStudies} case studies
                  </p>
                </div>
                <Button asChild variant="ghost">
                  <Link href="/admin/case-studies">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href="/admin/case-studies/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/" target="_blank">
                    View Site
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to set up your Supabase backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <h3 className="font-semibold mb-2">1. Set up Supabase Database</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Run the SQL migration in your Supabase SQL Editor to create the necessary tables:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>posts - for blog posts</li>
                <li>case_studies - for project showcases</li>
                <li>authors - for post authors</li>
                <li>tags - for categorization</li>
                <li>post_tags - many-to-many relationship</li>
              </ul>
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <h3 className="font-semibold mb-2">2. Configure Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Update <code className="bg-accent px-2 py-0.5 rounded">.env.local</code> with your Supabase credentials:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>• SUPABASE_SERVICE_ROLE_KEY</li>
              </ul>
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <h3 className="font-semibold mb-2">3. Create Admin User</h3>
              <p className="text-sm text-muted-foreground">
                Go to your Supabase Dashboard → Authentication → Users → Add User
              </p>
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <h3 className="font-semibold mb-2">4. Set Up Storage Buckets</h3>
              <p className="text-sm text-muted-foreground">
                Create storage buckets in Supabase:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• blog-images</li>
                <li>• case-study-images</li>
                <li>• author-avatars</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
