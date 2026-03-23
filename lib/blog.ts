import { getAllPosts, getPostBySlug } from "./supabase-data";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tag?: string[];
};

export async function markdownToHTML(markdown: string) {
  // For now, return markdown as-is since we're storing HTML in the database
  // If you want to process markdown on the fly, add your unified pipeline here
  return markdown;
}

export async function getPost(slug: string) {
  const post = await getPostBySlug(slug);
  
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }
  
  return {
    source: post.content, // This is already HTML from Supabase
    metadata: {
      title: post.title,
      summary: post.excerpt,
      publishedAt: post.published_at,
      image: post.featured_image_url,
      tag: post.tags?.map((t: { name: string }) => t.name),
    },
    slug: post.slug,
  };
}

export async function getBlogPosts() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    metadata: {
      title: post.title,
      summary: post.excerpt,
      publishedAt: post.published_at,
      image: post.featured_image_url,
      tag: post.tags?.map((t: { name: string }) => t.name),
    },
    slug: post.slug,
    source: post.content,
  }));
}
