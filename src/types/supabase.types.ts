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
  client_stackd: {
    Tables: {
      certification: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          ranking_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url: string
          ranking_index: number
          title: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          ranking_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      file_record: {
        Row: {
          created_at: string
          deleted_at: string | null
          file_description: string
          file_name: string
          file_path: string
          id: string
          preview_url: string
          preview_url_256: string | null
          preview_url_512: string | null
          preview_url_64: string | null
          storage_ref: string
          storage_ref_256: string | null
          storage_ref_512: string | null
          storage_ref_64: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          file_description: string
          file_name: string
          file_path: string
          id?: string
          preview_url: string
          preview_url_256?: string | null
          preview_url_512?: string | null
          preview_url_64?: string | null
          storage_ref: string
          storage_ref_256?: string | null
          storage_ref_512?: string | null
          storage_ref_64?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          file_description?: string
          file_name?: string
          file_path?: string
          id?: string
          preview_url?: string
          preview_url_256?: string | null
          preview_url_512?: string | null
          preview_url_64?: string | null
          storage_ref?: string
          storage_ref_256?: string | null
          storage_ref_512?: string | null
          storage_ref_64?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_member: {
        Row: {
          achievements: Json | null
          bio: string
          created_at: string
          first_name: string
          id: string
          image_url: string
          image_url_256: string | null
          image_url_512: string | null
          image_url_64: string | null
          last_name: string
          linkedinUrl: string | null
          middle_name: string | null
          ranking_index: number
          role: string
          updated_at: string
        }
        Insert: {
          achievements?: Json | null
          bio: string
          created_at?: string
          first_name: string
          id?: string
          image_url: string
          image_url_256?: string | null
          image_url_512?: string | null
          image_url_64?: string | null
          last_name: string
          linkedinUrl?: string | null
          middle_name?: string | null
          ranking_index: number
          role: string
          updated_at: string
        }
        Update: {
          achievements?: Json | null
          bio?: string
          created_at?: string
          first_name?: string
          id?: string
          image_url?: string
          image_url_256?: string | null
          image_url_512?: string | null
          image_url_64?: string | null
          last_name?: string
          linkedinUrl?: string | null
          middle_name?: string | null
          ranking_index?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_resource: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      testimonial: {
        Row: {
          body: string
          company: string | null
          company_logo_url: string | null
          company_logo_url_256: string | null
          company_logo_url_512: string | null
          company_logo_url_64: string | null
          created_at: string
          id: string
          image_url: string
          image_url_256: string | null
          image_url_512: string | null
          image_url_64: string | null
          name: string
          ranking_index: number
          role: string | null
          updated_at: string
        }
        Insert: {
          body: string
          company?: string | null
          company_logo_url?: string | null
          company_logo_url_256?: string | null
          company_logo_url_512?: string | null
          company_logo_url_64?: string | null
          created_at?: string
          id?: string
          image_url: string
          image_url_256?: string | null
          image_url_512?: string | null
          image_url_64?: string | null
          name: string
          ranking_index: number
          role?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          company?: string | null
          company_logo_url?: string | null
          company_logo_url_256?: string | null
          company_logo_url_512?: string | null
          company_logo_url_64?: string | null
          created_at?: string
          id?: string
          image_url?: string
          image_url_256?: string | null
          image_url_512?: string | null
          image_url_64?: string | null
          name?: string
          ranking_index?: number
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_credentials: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
  client_stackd: {
    Enums: {},
  },
} as const
