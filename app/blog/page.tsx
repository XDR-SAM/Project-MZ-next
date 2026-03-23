import { getBlogPosts } from "@/lib/blog";
import BlogListing from "@/components/custom/BlogListing";

async function BlogPage() {
  const posts = await getBlogPosts();
  
  // Transform Supabase data for UI
  const blogPosts = posts.map((post, index) => ({
    id: index + 1,
    title: post.metadata.title || "Untitled",
    excerpt: post.metadata.summary || "",
    image: post.metadata.image || "https://res.cloudinary.com/dieth2xb3/image/upload/v1755804235/aaaimage_zbypst.png",
    date: new Date(post.metadata.publishedAt).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    }),
    tag: post.metadata.tag?.[0] || "AI Strategy",
    slug: post.slug,
    isTopPick: index < 3, // First 3 posts are top picks
  }));
  
  return <BlogListing initialPosts={blogPosts} />;
}

export default BlogPage;
