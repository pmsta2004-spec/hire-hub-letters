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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          ai_gaps: string[]
          ai_score: number | null
          ai_strengths: string[]
          ai_summary: string
          created_at: string
          email: string
          employment_type: string
          id: string
          interview_at: string | null
          interview_mode: string
          interview_notes: string
          interview_status: string
          invite_sent_at: string | null
          name: string
          notes: string
          phone: string
          position: string
          resume_file: string
          resume_text: string
          source: string
          stage: string
          updated_at: string
        }
        Insert: {
          ai_gaps?: string[]
          ai_score?: number | null
          ai_strengths?: string[]
          ai_summary?: string
          created_at?: string
          email?: string
          employment_type?: string
          id?: string
          interview_at?: string | null
          interview_mode?: string
          interview_notes?: string
          interview_status?: string
          invite_sent_at?: string | null
          name?: string
          notes?: string
          phone?: string
          position?: string
          resume_file?: string
          resume_text?: string
          source?: string
          stage?: string
          updated_at?: string
        }
        Update: {
          ai_gaps?: string[]
          ai_score?: number | null
          ai_strengths?: string[]
          ai_summary?: string
          created_at?: string
          email?: string
          employment_type?: string
          id?: string
          interview_at?: string | null
          interview_mode?: string
          interview_notes?: string
          interview_status?: string
          invite_sent_at?: string | null
          name?: string
          notes?: string
          phone?: string
          position?: string
          resume_file?: string
          resume_text?: string
          source?: string
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          body: string
          candidate_id: string | null
          created_at: string
          id: string
          purpose: string
          sent_at: string | null
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          body?: string
          candidate_id?: string | null
          created_at?: string
          id?: string
          purpose?: string
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Update: {
          body?: string
          candidate_id?: string | null
          created_at?: string
          id?: string
          purpose?: string
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          ai_reply: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          rating: number
        }
        Insert: {
          ai_reply?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          rating?: number
        }
        Update: {
          ai_reply?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          rating?: number
        }
        Relationships: []
      }
      id_cards: {
        Row: {
          blood_group: string
          created_at: string
          department: string
          email: string
          emergency_contact: string
          employee_id: string
          employment_type: string
          id: string
          issue_date: string | null
          letter_ref: string
          location: string
          name: string
          phone: string
          photo: string
          position: string
          valid_till: string | null
        }
        Insert: {
          blood_group?: string
          created_at?: string
          department?: string
          email?: string
          emergency_contact?: string
          employee_id?: string
          employment_type?: string
          id?: string
          issue_date?: string | null
          letter_ref?: string
          location?: string
          name?: string
          phone?: string
          photo?: string
          position?: string
          valid_till?: string | null
        }
        Update: {
          blood_group?: string
          created_at?: string
          department?: string
          email?: string
          emergency_contact?: string
          employee_id?: string
          employment_type?: string
          id?: string
          issue_date?: string | null
          letter_ref?: string
          location?: string
          name?: string
          phone?: string
          photo?: string
          position?: string
          valid_till?: string | null
        }
        Relationships: []
      }
      letters: {
        Row: {
          address: string
          candidate_id: string | null
          created_at: string
          ctc: string
          department: string
          duration: string
          email: string
          employment_type: string
          id: string
          letter_date: string | null
          letter_id: string
          location: string
          name: string
          notes: string
          pay_cycle: string
          phone: string
          position: string
          probation: string
          reporting_to: string
          signatory_name: string
          signatory_title: string
          start_date: string | null
          stipend: string
          type: string
          updated_at: string
          work_hours: string
        }
        Insert: {
          address?: string
          candidate_id?: string | null
          created_at?: string
          ctc?: string
          department?: string
          duration?: string
          email?: string
          employment_type?: string
          id?: string
          letter_date?: string | null
          letter_id: string
          location?: string
          name?: string
          notes?: string
          pay_cycle?: string
          phone?: string
          position?: string
          probation?: string
          reporting_to?: string
          signatory_name?: string
          signatory_title?: string
          start_date?: string | null
          stipend?: string
          type?: string
          updated_at?: string
          work_hours?: string
        }
        Update: {
          address?: string
          candidate_id?: string | null
          created_at?: string
          ctc?: string
          department?: string
          duration?: string
          email?: string
          employment_type?: string
          id?: string
          letter_date?: string | null
          letter_id?: string
          location?: string
          name?: string
          notes?: string
          pay_cycle?: string
          phone?: string
          position?: string
          probation?: string
          reporting_to?: string
          signatory_name?: string
          signatory_title?: string
          start_date?: string | null
          stipend?: string
          type?: string
          updated_at?: string
          work_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "letters_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      org_settings: {
        Row: {
          address1: string
          address2: string
          cin: string
          email: string
          gst: string
          hr_email: string
          id: number
          name: string
          phone: string
          signatory_name: string
          signatory_title: string
          tagline: string
          updated_at: string
          website: string
        }
        Insert: {
          address1?: string
          address2?: string
          cin?: string
          email?: string
          gst?: string
          hr_email?: string
          id?: number
          name?: string
          phone?: string
          signatory_name?: string
          signatory_title?: string
          tagline?: string
          updated_at?: string
          website?: string
        }
        Update: {
          address1?: string
          address2?: string
          cin?: string
          email?: string
          gst?: string
          hr_email?: string
          id?: number
          name?: string
          phone?: string
          signatory_name?: string
          signatory_title?: string
          tagline?: string
          updated_at?: string
          website?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
