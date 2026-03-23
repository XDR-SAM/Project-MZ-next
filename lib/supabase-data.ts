import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from './supabase'
import type { Post, CaseStudy, Tag, Author } from '@/types/supabase'

/**
 * Create a public Supabase client for unauthenticated requests
 * This is used for public pages (blogs, case studies) and build-time generation
 */
function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Public data fetching functions (for client-facing pages)
 * These use the public client and work at build time and runtime
 */

// Get all published posts
export async function getAllPosts() {
  const supabase = createPublicClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors (
        name,
        avatar_url,
        role
      ),
      post_tags (
        tags (
          name,
          slug
        )
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts
}

// Get a single post by slug
export async function getPostBySlug(slug: string) {
  const supabase = createPublicClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors (
        name,
        avatar_url,
        role,
        bio
      ),
      post_tags (
        tags (
          name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return post
}

// Get all published case studies
export async function getAllCaseStudies() {
  const supabase = createPublicClient()
  
  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching case studies:', error)
    return []
  }

  return caseStudies
}

// Get all tags
export async function getAllTags() {
  const supabase = createPublicClient()
  
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  return tags
}

// Get posts by tag
export async function getPostsByTag(tagSlug: string) {
  const supabase = createPublicClient()
  
  // First get the tag
  const { data: tag } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single()

  if (!tag) {
    return []
  }

  // Then get posts with this tag
  const { data: postTags } = await supabase
    .from('post_tags')
    .select('post_id')
    .eq('tag_id', tag.id)

  if (!postTags || postTags.length === 0) {
    return []
  }

  const postIds = postTags.map(pt => pt.post_id)

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      authors (
        name,
        avatar_url,
        role
      )
    `)
    .in('id', postIds)
    .eq('published', true)
    .order('published_at', { ascending: false })

  return posts || []
}

/**
 * Admin data fetching functions (for dashboard)
 * These require authentication
 */

// Get all posts (including unpublished)
export async function adminGetAllPosts() {
  const supabase = await createServerSupabaseClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      authors (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin posts:', error)
    return []
  }

  return posts
}

// Get a single post for editing
export async function adminGetPostById(id: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post for edit:', error)
    return null
  }

  // Get tags for this post
  const { data: postTags } = await supabase
    .from('post_tags')
    .select('tag_id')
    .eq('post_id', id)

  const tagIds = postTags?.map((pt: { tag_id: string }) => pt.tag_id) || []

  return {
    ...post,
    tag_ids: tagIds
  }
}

// Get all case studies (including unpublished)
export async function adminGetAllCaseStudies() {
  const supabase = await createServerSupabaseClient()
  
  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin case studies:', error)
    return []
  }

  return caseStudies
}

// Get a single case study for editing
export async function adminGetCaseStudyById(id: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data: caseStudy, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching case study for edit:', error)
    return null
  }

  return caseStudy
}

// Get all authors
export async function getAllAuthors() {
  const supabase = await createServerSupabaseClient()
  
  const { data: authors, error } = await supabase
    .from('authors')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }

  return authors
}

/**
 * Stats for dashboard
 */
export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()
  
  const [postsResult, caseStudiesResult, publishedPostsResult] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('case_studies').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('published', true)
  ])

  return {
    totalPosts: postsResult.count || 0,
    totalCaseStudies: caseStudiesResult.count || 0,
    publishedPosts: publishedPostsResult.count || 0
  }
}
