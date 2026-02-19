export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          site_name_en: string | null;
          site_name_ar: string | null;
          logo_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          whatsapp: string | null;
          address_en: string | null;
          address_ar: string | null;
          map_url: string | null;
          hero_video_url: string | null;
          hero_image_url: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          twitter_url: string | null;
          youtube_url: string | null;
          seo_title_en: string | null;
          seo_title_ar: string | null;
          seo_description_en: string | null;
          seo_description_ar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['site_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>;
      };
      academic_systems: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          hero_image_url: string | null;
          curriculum_en: string | null;
          curriculum_ar: string | null;
          features_en: Json;
          features_ar: Json;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['academic_systems']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['academic_systems']['Row']>;
      };
      tuition_fees: {
        Row: {
          id: string;
          system_id: string;
          grade_level_en: string;
          grade_level_ar: string;
          fee_amount: number;
          currency: string;
          notes_en: string | null;
          notes_ar: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tuition_fees']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['tuition_fees']['Row']>;
      };
      posts: {
        Row: {
          id: string;
          type: 'news' | 'event';
          title_en: string;
          title_ar: string;
          slug: string;
          content_en: string | null;
          content_ar: string | null;
          excerpt_en: string | null;
          excerpt_ar: string | null;
          thumbnail_url: string | null;
          event_date: string | null;
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['posts']['Row']>;
      };
      gallery: {
        Row: {
          id: string;
          category: 'labs' | 'sports' | 'campus' | 'events' | 'classroom';
          media_url: string;
          media_type: 'image' | 'video';
          caption_en: string | null;
          caption_ar: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['gallery']['Row']>;
      };
      admissions: {
        Row: {
          id: string;
          student_name: string;
          parent_name: string;
          email: string;
          phone: string;
          grade_level: string | null;
          selected_system: 'American' | 'British' | null;
          date_of_birth: string | null;
          previous_school: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admissions']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['admissions']['Row']>;
      };
      page_content: {
        Row: {
          id: string;
          section_key: string;
          title_en: string | null;
          title_ar: string | null;
          subtitle_en: string | null;
          subtitle_ar: string | null;
          content_en: string | null;
          content_ar: string | null;
          image_url: string | null;
          extra_data: Json;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_content']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['page_content']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
