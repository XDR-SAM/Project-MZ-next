"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { CaseStudy } from '@/types/supabase';

interface CaseStudyFormProps {
  caseStudy?: CaseStudy;
  mode: 'create' | 'edit';
}

export default function CaseStudyForm({ caseStudy, mode }: CaseStudyFormProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [projectTitle, setProjectTitle] = useState(caseStudy?.project_title || '');
  const [clientName, setClientName] = useState(caseStudy?.client_name || '');
  const [logoUrl, setLogoUrl] = useState(caseStudy?.logo_url || '');
  const [description, setDescription] = useState(caseStudy?.description || '');
  const [mainImageUrl, setMainImageUrl] = useState(caseStudy?.main_image_url || '');
  const [features, setFeatures] = useState<string[]>(caseStudy?.features as string[] || []);
  const [testimonial, setTestimonial] = useState(caseStudy?.testimonial || '');
  const [testimonialAuthor, setTestimonialAuthor] = useState(caseStudy?.testimonial_author || '');
  const [testimonialPosition, setTestimonialPosition] = useState(caseStudy?.testimonial_position || '');
  const [testimonialImage, setTestimonialImage] = useState(caseStudy?.testimonial_image || '');
  const [projectLink, setProjectLink] = useState(caseStudy?.project_link || '');
  const [published, setPublished] = useState(caseStudy?.published || false);
  const [newFeature, setNewFeature] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const caseStudyData = {
        project_title: projectTitle,
        client_name: clientName,
        logo_url: logoUrl || null,
        description,
        main_image_url: mainImageUrl,
        features: features as any,
        testimonial: testimonial || null,
        testimonial_author: testimonialAuthor || null,
        testimonial_position: testimonialPosition || null,
        testimonial_image: testimonialImage || null,
        project_link: projectLink || null,
        published,
      };

      if (mode === 'create') {
        const { data: newCaseStudy, error: createError } = await supabase
          .from('case_studies')
          .insert([caseStudyData])
          .select()
          .single();

        if (createError) throw createError;

        router.push('/admin/case-studies');
      } else if (caseStudy) {
        const { error: updateError } = await supabase
          .from('case_studies')
          .update(caseStudyData)
          .eq('id', caseStudy.id);

        if (updateError) throw updateError;

        router.push('/admin/case-studies');
      }
    } catch (err: any) {
      console.error('Case study save error:', err);
      setError(err.message || 'Failed to save case study');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void,
    bucket: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Case Study' : 'Edit Case Study'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project name"
                required
              />
            </div>

            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client or company name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div>
              <Label>Main Project Image *</Label>
              {mainImageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-2">
                  <img
                    src={mainImageUrl}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setMainImageUrl, 'case-study-images')}
                disabled={loading}
              />
            </div>

            <div>
              <Label>Company Logo</Label>
              {logoUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted mb-2">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setLogoUrl, 'case-study-images')}
                disabled={loading}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Key Features & Achievements</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature or achievement"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <ul className="space-y-2 mt-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start justify-between bg-accent/50 p-2 rounded-md">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Testimonial */}
          <div className="space-y-4">
            <div>
              <Label>Testimonial</Label>
              <Textarea
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Client testimonial quote"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Author Name</Label>
                <Input
                  value={testimonialAuthor}
                  onChange={(e) => setTestimonialAuthor(e.target.value)}
                  placeholder="Person's name"
                />
              </div>

              <div>
                <Label>Position</Label>
                <Input
                  value={testimonialPosition}
                  onChange={(e) => setTestimonialPosition(e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div>
              <Label>Author Photo</Label>
              {testimonialImage && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted mb-2">
                  <img
                    src={testimonialImage}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setTestimonialImage, 'author-avatars')}
                disabled={loading}
              />
            </div>
          </div>

          {/* Project Link */}
          <div>
            <Label>Project Link</Label>
            <Input
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          {/* Publish Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked as boolean)}
            />
            <Label htmlFor="published">
              Published {published ? '(visible on website)' : '(draft)'}
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Case Study' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
