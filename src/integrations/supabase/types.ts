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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      automation_logs: {
        Row: {
          error_message: string | null
          execution_result: Json | null
          execution_status: string
          execution_time: number | null
          id: string
          rule_id: string
          triggered_at: string
        }
        Insert: {
          error_message?: string | null
          execution_result?: Json | null
          execution_status?: string
          execution_time?: number | null
          id?: string
          rule_id: string
          triggered_at?: string
        }
        Update: {
          error_message?: string | null
          execution_result?: Json | null
          execution_status?: string
          execution_time?: number | null
          id?: string
          rule_id?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_config: Json
          category: string
          created_at: string
          created_by: string
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_execution: string | null
          name: string
          organization_id: string
          trigger_config: Json
          updated_at: string
        }
        Insert: {
          action_config?: Json
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_execution?: string | null
          name: string
          organization_id: string
          trigger_config?: Json
          updated_at?: string
        }
        Update: {
          action_config?: Json
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_execution?: string | null
          name?: string
          organization_id?: string
          trigger_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          instructor_name: string | null
          is_featured: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_name?: string | null
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_name?: string | null
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          ai_extraction_prompt: string | null
          category: string
          created_at: string
          created_by: string
          id: string
          name: string
          organization_id: string
          template_fields: Json
          updated_at: string
        }
        Insert: {
          ai_extraction_prompt?: string | null
          category: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          organization_id: string
          template_fields?: Json
          updated_at?: string
        }
        Update: {
          ai_extraction_prompt?: string | null
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          organization_id?: string
          template_fields?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      dynamic_forms: {
        Row: {
          ai_generated: boolean | null
          category: string
          created_at: string
          created_by: string
          form_schema: Json
          generated_from_document: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean | null
          category: string
          created_at?: string
          created_by: string
          form_schema: Json
          generated_from_document?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean | null
          category?: string
          created_at?: string
          created_by?: string
          form_schema?: Json
          generated_from_document?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_forms_generated_from_document_fkey"
            columns: ["generated_from_document"]
            isOneToOne: false
            referencedRelation: "parsed_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dynamic_forms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          form_id: string
          id: string
          submitted_by: string
          submitted_data: Json
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          submitted_by: string
          submitted_data: Json
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          submitted_by?: string
          submitted_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "dynamic_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_training_materials: {
        Row: {
          content: Json
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          generated_by_ai: boolean | null
          id: string
          is_active: boolean | null
          material_type: string
          organization_id: string
          pos_system: string
          source_content_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          generated_by_ai?: boolean | null
          id?: string
          is_active?: boolean | null
          material_type: string
          organization_id: string
          pos_system?: string
          source_content_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          generated_by_ai?: boolean | null
          id?: string
          is_active?: boolean | null
          material_type?: string
          organization_id?: string
          pos_system?: string
          source_content_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_training_materials_source_content_id_fkey"
            columns: ["source_content_id"]
            isOneToOne: false
            referencedRelation: "scraped_content"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          score: number | null
          time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          score?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          score?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery: string | null
          created_at: string
          created_by: string
          expected_delivery: string | null
          id: string
          items: Json
          notes: string | null
          order_date: string
          order_number: string
          order_type: string
          organization_id: string
          status: string
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          created_by: string
          expected_delivery?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_date?: string
          order_number: string
          order_type?: string
          organization_id: string
          status?: string
          total_amount?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          created_by?: string
          expected_delivery?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_date?: string
          order_number?: string
          order_type?: string
          organization_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      parsed_documents: {
        Row: {
          confidence_score: number | null
          created_at: string
          created_by: string
          id: string
          organization_id: string
          original_document_id: string | null
          parsed_data: Json
          status: string
          target_category: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          created_by: string
          id?: string
          organization_id: string
          original_document_id?: string | null
          parsed_data?: Json
          status?: string
          target_category: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          created_by?: string
          id?: string
          organization_id?: string
          original_document_id?: string | null
          parsed_data?: Json
          status?: string
          target_category?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parsed_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parsed_documents_original_document_id_fkey"
            columns: ["original_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parsed_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          notification_settings: Json | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          notification_settings?: Json | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          notification_settings?: Json | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          created_by: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          organization_id: string
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string
          table_number: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          party_size?: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string
          table_number?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string
          table_number?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      scraped_content: {
        Row: {
          content_html: string | null
          content_text: string | null
          created_at: string
          created_by: string
          id: string
          metadata: Json | null
          organization_id: string
          processed: boolean | null
          scraped_at: string
          source_type: string
          source_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json | null
          organization_id: string
          processed?: boolean | null
          scraped_at?: string
          source_type?: string
          source_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          processed?: boolean | null
          scraped_at?: string
          source_type?: string
          source_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scraping_tasks: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          items_found: number | null
          items_processed: number | null
          organization_id: string
          pos_system: string
          progress_percent: number | null
          search_queries: string[]
          started_at: string | null
          status: string
          target_domains: string[]
          task_name: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by: string
          error_message?: string | null
          id?: string
          items_found?: number | null
          items_processed?: number | null
          organization_id: string
          pos_system?: string
          progress_percent?: number | null
          search_queries: string[]
          started_at?: string | null
          status?: string
          target_domains: string[]
          task_name: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          items_found?: number | null
          items_processed?: number | null
          organization_id?: string
          pos_system?: string
          progress_percent?: number | null
          search_queries?: string[]
          started_at?: string | null
          status?: string
          target_domains?: string[]
          task_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      training_content: {
        Row: {
          content_type: string
          course_id: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_required: boolean | null
          lesson_id: string | null
          metadata: Json | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          content_type: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          metadata?: Json | null
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          metadata?: Json | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_content_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string
          id: string
          progress_percent: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          progress_percent?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string
          id?: string
          progress_percent?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          ai_requests: number | null
          calendar_events: number | null
          created_at: string
          document_uploads: number | null
          forms_created: number | null
          id: string
          reset_date: string | null
          team_members: number | null
          updated_at: string
          user_id: string | null
          video_call_minutes: number | null
        }
        Insert: {
          ai_requests?: number | null
          calendar_events?: number | null
          created_at?: string
          document_uploads?: number | null
          forms_created?: number | null
          id?: string
          reset_date?: string | null
          team_members?: number | null
          updated_at?: string
          user_id?: string | null
          video_call_minutes?: number | null
        }
        Update: {
          ai_requests?: number | null
          calendar_events?: number | null
          created_at?: string
          document_uploads?: number | null
          forms_created?: number | null
          id?: string
          reset_date?: string | null
          team_members?: number | null
          updated_at?: string
          user_id?: string | null
          video_call_minutes?: number | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          category: string
          created_at: string
          delivery_schedule: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          organization_id: string
          payment_terms: string | null
          phone: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          delivery_schedule?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          organization_id: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          delivery_schedule?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          organization_id?: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      staff_reservations: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string | null
          notes: string | null
          organization_id: string | null
          party_size: number | null
          reservation_date: string | null
          reservation_time: string | null
          special_requests: string | null
          status: string | null
          table_number: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: never
          customer_name?: string | null
          customer_phone?: never
          id?: string | null
          notes?: string | null
          organization_id?: string | null
          party_size?: number | null
          reservation_date?: string | null
          reservation_time?: string | null
          special_requests?: string | null
          status?: string | null
          table_number?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: never
          customer_name?: string | null
          customer_phone?: never
          id?: string | null
          notes?: string | null
          organization_id?: string | null
          party_size?: number | null
          reservation_date?: string | null
          reservation_time?: string | null
          special_requests?: string | null
          status?: string | null
          table_number?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_usage_limit: {
        Args: { p_feature_type: string; p_limit?: number; p_user_id: string }
        Returns: boolean
      }
      increment_usage: {
        Args: { p_amount?: number; p_feature_type: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      subscription_tier: "free" | "premium" | "basic"
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
      subscription_tier: ["free", "premium", "basic"],
    },
  },
} as const
