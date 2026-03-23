export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database types for Supabase tables
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          featured_image: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          author_id: string | null
          read_time: string | null
          meta_description: string | null
          meta_title: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string | null
          read_time?: string | null
          meta_description?: string | null
          meta_title?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string | null
          read_time?: string | null
          meta_description?: string | null
          meta_title?: string | null
        }
      }
      case_studies: {
        Row: {
          id: string
          project_title: string
          client_name: string
          logo_url: string | null
          description: string
          main_image_url: string
          demo_images: Json | null
          features: Json | null
          testimonial: string | null
          testimonial_author: string | null
          testimonial_position: string | null
          testimonial_image: string | null
          project_link: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_title: string
          client_name: string
          logo_url?: string | null
          description: string
          main_image_url: string
          demo_images?: Json | null
          features?: Json | null
          testimonial?: string | null
          testimonial_author?: string | null
          testimonial_position?: string | null
          testimonial_image?: string | null
          project_link?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_title?: string
          client_name?: string
          logo_url?: string | null
          description?: string
          main_image_url?: string
          demo_images?: Json | null
          features?: Json | null
          testimonial?: string | null
          testimonial_author?: string | null
          testimonial_position?: string | null
          testimonial_image?: string | null
          project_link?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          bio: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type CaseStudy = Database['public']['Tables']['case_studies']['Row']
export type CaseStudyInsert = Database['public']['Tables']['case_studies']['Insert']
export type CaseStudyUpdate = Database['public']['Tables']['case_studies']['Update']

export type Author = Database['public']['Tables']['authors']['Row']
export type AuthorInsert = Database['public']['Tables']['authors']['Insert']
export type AuthorUpdate = Database['public']['Tables']['authors']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type PostTag = Database['public']['Tables']['post_tags']['Row']
export type PostTagInsert = Database['public']['Tables']['post_tags']['Insert']
export type PostTagUpdate = Database['public']['Tables']['post_tags']['Update']
