"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Post, Author, Tag } from '@/types/supabase';

interface PostFormProps {
  post?: Post & { tag_ids?: string[] };
  authors: Author[];
  tags: Tag[];
  mode: 'create' | 'edit';
}

export default function PostForm({ post, authors, tags, mode }: PostFormProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [published, setPublished] = useState(post?.published || false);
  const [authorId, setAuthorId] = useState(post?.author_id || '');
  const [readTime, setReadTime] = useState(post?.read_time || '5 min read');
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(post?.tag_ids || []);

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug, mode]);

  // Calculate read time
  useEffect(() => {
    if (content) {
      const wordsPerMinute = 200;
      const words = content.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      setReadTime(`${minutes} min read`);
    }
  }, [content]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData: any = {
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage || null,
        published,
        author_id: authorId || null,
        read_time: readTime,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
      };

      if (mode === 'create') {
        // Create new post
        const { data: newPost, error: createError } = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();

        if (createError) throw createError;

        // Add tags
        if (selectedTagIds.length > 0 && newPost) {
          const postTags = selectedTagIds.map(tagId => ({
            post_id: newPost.id,
            tag_id: tagId,
          }));

          const { error: tagsError } = await supabase
            .from('post_tags')
            .insert(postTags);

          if (tagsError) throw tagsError;
        }

        router.push('/admin/posts');
      } else if (post) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);

        if (updateError) throw updateError;

        // Update tags
        if (post.id) {
          // Delete existing tags
          await supabase
            .from('post_tags')
            .delete()
            .eq('post_id', post.id);

          // Add new tags
          if (selectedTagIds.length > 0) {
            const postTags = selectedTagIds.map(tagId => ({
              post_id: post.id,
              tag_id: tagId,
            }));

            const { error: tagsError } = await supabase
              .from('post_tags')
              .insert(postTags);

            if (tagsError) throw tagsError;
          }
        }

        router.push('/admin/posts');
      }
    } catch (err: any) {
      console.error('Post save error:', err);
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFeaturedImage(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Post' : 'Edit Post'}
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly name (lowercase, hyphens only)
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of the post"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here (Markdown supported)"
              rows={15}
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can use Markdown syntax for formatting
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            {featuredImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-2">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
            {featuredImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFeaturedImage('')}
              >
                Remove Image
              </Button>
            )}
          </div>

          {/* Author & Tags */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="author">Author</Label>
              <Select value={authorId} onValueChange={setAuthorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Read Time</Label>
              <Input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`px-3 py-1.5 rounded-md border cursor-pointer transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent'
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title (defaults to post title)"
              />
            </div>

            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description (defaults to excerpt)"
                rows={2}
              />
            </div>
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
              {loading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Save Changes'}
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
