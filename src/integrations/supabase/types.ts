export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string | null
          date: string
          id: string
          invitation_id: string | null
          name: string
          time: string
          venue_address: string
          venue_map_link: string | null
          venue_name: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          invitation_id?: string | null
          name: string
          time: string
          venue_address: string
          venue_map_link?: string | null
          venue_name: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          invitation_id?: string | null
          name?: string
          time?: string
          venue_address?: string
          venue_map_link?: string | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string | null
          description: string | null
          family_type: string
          id: string
          image_url: string | null
          invitation_id: string | null
          is_parent: boolean | null
          name: string
          relation: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          family_type: string
          id?: string
          image_url?: string | null
          invitation_id?: string | null
          is_parent?: boolean | null
          name: string
          relation: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          family_type?: string
          id?: string
          image_url?: string | null
          invitation_id?: string | null
          is_parent?: boolean | null
          name?: string
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          created_at: string | null
          id: string
          invitation_id: string | null
          photo_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          photo_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_event_access: {
        Row: {
          created_at: string
          event_id: string
          guest_id: string
          id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_id: string
          id?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_event_access_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "wedding_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_event_access_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string | null
          id: string
          invitation_id: string | null
          mobile: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          invitation_id?: string | null
          mobile: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          mobile?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_templates: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          preview_image_url: string | null
          required_fields: Json
          styling_config: Json | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          preview_image_url?: string | null
          required_fields?: Json
          styling_config?: Json | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preview_image_url?: string | null
          required_fields?: Json
          styling_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          bride_first_name: string
          bride_last_name: string
          couple_photo_url: string | null
          created_at: string | null
          email: string
          groom_first_name: string
          groom_last_name: string
          id: string
          phone_number: string
          updated_at: string | null
          venue_address: string
          venue_map_link: string | null
          venue_name: string
          wedding_date: string
          wedding_time: string
        }
        Insert: {
          bride_first_name: string
          bride_last_name: string
          couple_photo_url?: string | null
          created_at?: string | null
          email: string
          groom_first_name: string
          groom_last_name: string
          id?: string
          phone_number: string
          updated_at?: string | null
          venue_address: string
          venue_map_link?: string | null
          venue_name: string
          wedding_date: string
          wedding_time: string
        }
        Update: {
          bride_first_name?: string
          bride_last_name?: string
          couple_photo_url?: string | null
          created_at?: string | null
          email?: string
          groom_first_name?: string
          groom_last_name?: string
          id?: string
          phone_number?: string
          updated_at?: string | null
          venue_address?: string
          venue_map_link?: string | null
          venue_name?: string
          wedding_date?: string
          wedding_time?: string
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_guest_invitations: {
        Row: {
          created_at: string
          guest_id: string
          guest_name: string
          hosts_names: string
          id: string
          invitation_date: string | null
          invitation_id: string
          invitation_title: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          guest_name: string
          hosts_names: string
          id?: string
          invitation_date?: string | null
          invitation_id: string
          invitation_title: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          guest_name?: string
          hosts_names?: string
          id?: string
          invitation_date?: string | null
          invitation_id?: string
          invitation_title?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_guest_invitations_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "wedding_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_guest_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wedding_events: {
        Row: {
          created_at: string | null
          event_address: string | null
          event_date: string | null
          event_name: string
          event_time: string | null
          event_venue: string | null
          id: string
          invitation_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_address?: string | null
          event_date?: string | null
          event_name: string
          event_time?: string | null
          event_venue?: string | null
          id?: string
          invitation_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_address?: string | null
          event_date?: string | null
          event_name?: string
          event_time?: string | null
          event_venue?: string | null
          id?: string
          invitation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "wedding_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_invitations: {
        Row: {
          bride_about: string | null
          bride_family: string | null
          bride_name: string
          bride_parents: string | null
          contact_email: string | null
          contact_phone: string | null
          couple_image_url: string | null
          couple_story: string | null
          created_at: string | null
          custom_message: string | null
          custom_url_slug: string | null
          gallery_images: Json | null
          groom_about: string | null
          groom_family: string | null
          groom_name: string
          groom_parents: string | null
          id: string
          invitation_data: Json | null
          is_published: boolean | null
          map_url: string | null
          rsvp_email: string | null
          rsvp_phone: string | null
          template_id: string | null
          title: string | null
          user_id: string | null
          wedding_address: string | null
          wedding_date: string
          wedding_time: string | null
          wedding_venue: string | null
        }
        Insert: {
          bride_about?: string | null
          bride_family?: string | null
          bride_name: string
          bride_parents?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_image_url?: string | null
          couple_story?: string | null
          created_at?: string | null
          custom_message?: string | null
          custom_url_slug?: string | null
          gallery_images?: Json | null
          groom_about?: string | null
          groom_family?: string | null
          groom_name: string
          groom_parents?: string | null
          id?: string
          invitation_data?: Json | null
          is_published?: boolean | null
          map_url?: string | null
          rsvp_email?: string | null
          rsvp_phone?: string | null
          template_id?: string | null
          title?: string | null
          user_id?: string | null
          wedding_address?: string | null
          wedding_date: string
          wedding_time?: string | null
          wedding_venue?: string | null
        }
        Update: {
          bride_about?: string | null
          bride_family?: string | null
          bride_name?: string
          bride_parents?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_image_url?: string | null
          couple_story?: string | null
          created_at?: string | null
          custom_message?: string | null
          custom_url_slug?: string | null
          gallery_images?: Json | null
          groom_about?: string | null
          groom_family?: string | null
          groom_name?: string
          groom_parents?: string | null
          id?: string
          invitation_data?: Json | null
          is_published?: boolean | null
          map_url?: string | null
          rsvp_email?: string | null
          rsvp_phone?: string | null
          template_id?: string | null
          title?: string | null
          user_id?: string | null
          wedding_address?: string | null
          wedding_date?: string
          wedding_time?: string | null
          wedding_venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_invitations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invitation_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wedding_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wish_likes: {
        Row: {
          created_at: string
          guest_id: string
          guest_name: string
          id: string
          wish_id: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          guest_name: string
          id?: string
          wish_id: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          guest_name?: string
          id?: string
          wish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wish_likes_wish_id_fkey"
            columns: ["wish_id"]
            isOneToOne: false
            referencedRelation: "wishes"
            referencedColumns: ["id"]
          },
        ]
      }
      wish_replies: {
        Row: {
          content: string
          created_at: string
          guest_id: string
          guest_name: string
          id: string
          is_approved: boolean
          wish_id: string
        }
        Insert: {
          content: string
          created_at?: string
          guest_id: string
          guest_name: string
          id?: string
          is_approved?: boolean
          wish_id: string
        }
        Update: {
          content?: string
          created_at?: string
          guest_id?: string
          guest_name?: string
          id?: string
          is_approved?: boolean
          wish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wish_replies_wish_id_fkey"
            columns: ["wish_id"]
            isOneToOne: false
            referencedRelation: "wishes"
            referencedColumns: ["id"]
          },
        ]
      }
      wishes: {
        Row: {
          content: string
          created_at: string
          guest_id: string
          guest_name: string
          id: string
          image_url: string | null
          is_approved: boolean
          likes_count: number
          replies_count: number
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          guest_id: string
          guest_name: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          likes_count?: number
          replies_count?: number
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          guest_id?: string
          guest_name?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          likes_count?: number
          replies_count?: number
          updated_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
