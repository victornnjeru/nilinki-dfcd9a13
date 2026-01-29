export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      band_events: {
        Row: {
          band_id: string
          created_at: string
          event_date: string
          event_time: string
          id: string
          image_url: string | null
          is_visible: boolean | null
          name: string
          ticket_url: string | null
          venue: string
        }
        Insert: {
          band_id: string
          created_at?: string
          event_date: string
          event_time: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name: string
          ticket_url?: string | null
          venue: string
        }
        Update: {
          band_id?: string
          created_at?: string
          event_date?: string
          event_time?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          name?: string
          ticket_url?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "band_events_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      band_rate_cards: {
        Row: {
          band_id: string
          created_at: string
          description: string | null
          duration: string | null
          event_type: string
          id: string
          price: number
        }
        Insert: {
          band_id: string
          created_at?: string
          description?: string | null
          duration?: string | null
          event_type: string
          id?: string
          price: number
        }
        Update: {
          band_id?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          event_type?: string
          id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "band_rate_cards_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      band_videos: {
        Row: {
          band_id: string
          created_at: string
          id: string
          platform: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          band_id: string
          created_at?: string
          id?: string
          platform?: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          band_id?: string
          created_at?: string
          id?: string
          platform?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "band_videos_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      bands: {
        Row: {
          bio: string | null
          cover_url: string | null
          created_at: string
          facebook: string | null
          featured: boolean | null
          genre: string
          id: string
          image_url: string | null
          instagram: string | null
          location: string
          long_bio: string | null
          members: number | null
          name: string
          spotify: string | null
          updated_at: string
          user_id: string
          years_active: number | null
          youtube: string | null
        }
        Insert: {
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          facebook?: string | null
          featured?: boolean | null
          genre: string
          id?: string
          image_url?: string | null
          instagram?: string | null
          location: string
          long_bio?: string | null
          members?: number | null
          name: string
          spotify?: string | null
          updated_at?: string
          user_id: string
          years_active?: number | null
          youtube?: string | null
        }
        Update: {
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          facebook?: string | null
          featured?: boolean | null
          genre?: string
          id?: string
          image_url?: string | null
          instagram?: string | null
          location?: string
          long_bio?: string | null
          members?: number | null
          name?: string
          spotify?: string | null
          updated_at?: string
          user_id?: string
          years_active?: number | null
          youtube?: string | null
        }
        Relationships: []
      }
      booking_inquiries: {
        Row: {
          band_id: string
          client_id: string
          created_at: string
          event_date: string
          event_location: string | null
          event_type: string
          guest_count: number | null
          id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          band_id: string
          client_id: string
          created_at?: string
          event_date: string
          event_location?: string | null
          event_type: string
          guest_count?: number | null
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          band_id?: string
          client_id?: string
          created_at?: string
          event_date?: string
          event_location?: string | null
          event_type?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_inquiries_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          band_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          band_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          band_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          band_id: string
          content: string | null
          created_at: string
          event_type: string | null
          id: string
          rating: number
        }
        Insert: {
          author_id: string
          band_id: string
          content?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          rating: number
        }
        Update: {
          author_id?: string
          band_id?: string
          content?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_band_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "band" | "client"
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
    Enums: {
      app_role: ["band", "client"],
    },
  },
} as const
