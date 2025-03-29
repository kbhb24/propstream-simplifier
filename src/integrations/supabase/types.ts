export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_attempts: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          record_id: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_attempts_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_address: Json | null
          billing_email: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_users: number | null
          name: string
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          plan_expires_at: string | null
          plan_started_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          billing_email?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_users?: number | null
          name: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          billing_email?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_users?: number | null
          name?: string
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          monthly_upload_limit: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          monthly_upload_limit?: number
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          monthly_upload_limit?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      record_attempts: {
        Row: {
          created_at: string
          duration: unknown | null
          id: string
          notes: string | null
          record_id: string | null
          result: string | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: unknown | null
          id?: string
          notes?: string | null
          record_id?: string | null
          result?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: unknown | null
          id?: string
          notes?: string | null
          record_id?: string | null
          result?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_attempts_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_boards: {
        Row: {
          board_name: string
          created_at: string
          id: string
          notes: string | null
          position: number | null
          record_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          board_name: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: number | null
          record_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          board_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: number | null
          record_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_boards_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_direct_mail: {
        Row: {
          campaign_name: string | null
          cost: number | null
          created_at: string
          delivered_date: string | null
          id: string
          notes: string | null
          record_id: string | null
          sent_date: string | null
          status: string | null
          template_name: string | null
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          campaign_name?: string | null
          cost?: number | null
          created_at?: string
          delivered_date?: string | null
          id?: string
          notes?: string | null
          record_id?: string | null
          sent_date?: string | null
          status?: string | null
          template_name?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          campaign_name?: string | null
          cost?: number | null
          created_at?: string
          delivered_date?: string | null
          id?: string
          notes?: string | null
          record_id?: string | null
          sent_date?: string | null
          status?: string | null
          template_name?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_direct_mail_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_emails: {
        Row: {
          created_at: string
          email_address: string
          id: string
          is_valid: boolean | null
          notes: string | null
          record_id: string | null
          updated_at: string
          user_id: string | null
          verification_date: string | null
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: string
          is_valid?: boolean | null
          notes?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_date?: string | null
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: string
          is_valid?: boolean | null
          notes?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_emails_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          record_id: string | null
          storage_key: string | null
          storage_provider: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          record_id?: string | null
          storage_key?: string | null
          storage_provider?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          record_id?: string | null
          storage_key?: string | null
          storage_provider?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_files_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          parent_id: string | null
          record_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          parent_id?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          parent_id?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "record_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "record_messages_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_offers: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          offer_date: string | null
          record_id: string
          status: Database["public"]["Enums"]["offer_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          offer_date?: string | null
          record_id: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          offer_date?: string | null
          record_id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_record_offers_record_id"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_phone_numbers: {
        Row: {
          carrier: string | null
          created_at: string
          dnc_status: boolean | null
          id: string
          is_mobile: boolean | null
          is_valid: boolean | null
          notes: string | null
          phone_number: string
          phone_type: string | null
          record_id: string | null
          updated_at: string
          user_id: string | null
          verification_date: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          dnc_status?: boolean | null
          id?: string
          is_mobile?: boolean | null
          is_valid?: boolean | null
          notes?: string | null
          phone_number: string
          phone_type?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_date?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string
          dnc_status?: boolean | null
          id?: string
          is_mobile?: boolean | null
          is_valid?: boolean | null
          notes?: string | null
          phone_number?: string
          phone_type?: string | null
          record_id?: string | null
          updated_at?: string
          user_id?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_phone_numbers_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string | null
          record_id: string | null
          reminder_date: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          record_id?: string | null
          reminder_date?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          record_id?: string | null
          reminder_date?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_tasks_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
        ]
      }
      records: {
        Row: {
          air_conditioner: string | null
          archived: boolean | null
          archived_at: string | null
          archived_by: string | null
          assigned_to: string | null
          bankruptcy: boolean | null
          bathrooms: number | null
          bedrooms: number | null
          code_violations: string[] | null
          company_name: string | null
          contact_attempts: number | null
          created_at: string
          current_status: Database["public"]["Enums"]["property_status"] | null
          divorce: boolean | null
          do_not_call: boolean | null
          do_not_contact: boolean | null
          do_not_mail: boolean | null
          estimated_value: number | null
          first_name: string | null
          foreclosure: boolean | null
          garage_spaces: number | null
          garage_type: string | null
          heating_type: string | null
          hoa_fee: number | null
          hoa_name: string | null
          id: string
          info: Json | null
          last_contact_attempt: string | null
          last_name: string | null
          last_sale_amount: number | null
          last_sale_date: string | null
          lead_source: string | null
          lead_stage: string | null
          lead_temperature:
            | Database["public"]["Enums"]["lead_temperature"]
            | null
          lists: string[] | null
          lot_size: number | null
          mailing_address: string | null
          mailing_city: string | null
          mailing_state: string | null
          mailing_zip: string | null
          mortgage_amount: number | null
          mortgage_balance: number | null
          mortgage_date: string | null
          mortgage_lender: string | null
          notes: string | null
          organization_id: string | null
          owner_occupied: boolean | null
          ownership_type: string | null
          parcel_number: string | null
          pool: boolean | null
          primary_email: string | null
          primary_phone: string | null
          property_city: string | null
          property_class: string | null
          property_state: string | null
          property_street: string | null
          property_type: string | null
          property_use: string | null
          property_zip: string | null
          skip_trace_status: string | null
          square_feet: number | null
          status: string | null
          tags: string[] | null
          tax_assessment: number | null
          tax_delinquent: boolean | null
          tax_delinquent_amount: number | null
          tax_delinquent_years: number | null
          updated_at: string
          user_id: string | null
          vacant: boolean | null
          year_built: number | null
          years_owned: number | null
        }
        Insert: {
          air_conditioner?: string | null
          archived?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
          assigned_to?: string | null
          bankruptcy?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          code_violations?: string[] | null
          company_name?: string | null
          contact_attempts?: number | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["property_status"] | null
          divorce?: boolean | null
          do_not_call?: boolean | null
          do_not_contact?: boolean | null
          do_not_mail?: boolean | null
          estimated_value?: number | null
          first_name?: string | null
          foreclosure?: boolean | null
          garage_spaces?: number | null
          garage_type?: string | null
          heating_type?: string | null
          hoa_fee?: number | null
          hoa_name?: string | null
          id?: string
          info?: Json | null
          last_contact_attempt?: string | null
          last_name?: string | null
          last_sale_amount?: number | null
          last_sale_date?: string | null
          lead_source?: string | null
          lead_stage?: string | null
          lead_temperature?:
            | Database["public"]["Enums"]["lead_temperature"]
            | null
          lists?: string[] | null
          lot_size?: number | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          mortgage_amount?: number | null
          mortgage_balance?: number | null
          mortgage_date?: string | null
          mortgage_lender?: string | null
          notes?: string | null
          organization_id?: string | null
          owner_occupied?: boolean | null
          ownership_type?: string | null
          parcel_number?: string | null
          pool?: boolean | null
          primary_email?: string | null
          primary_phone?: string | null
          property_city?: string | null
          property_class?: string | null
          property_state?: string | null
          property_street?: string | null
          property_type?: string | null
          property_use?: string | null
          property_zip?: string | null
          skip_trace_status?: string | null
          square_feet?: number | null
          status?: string | null
          tags?: string[] | null
          tax_assessment?: number | null
          tax_delinquent?: boolean | null
          tax_delinquent_amount?: number | null
          tax_delinquent_years?: number | null
          updated_at?: string
          user_id?: string | null
          vacant?: boolean | null
          year_built?: number | null
          years_owned?: number | null
        }
        Update: {
          air_conditioner?: string | null
          archived?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
          assigned_to?: string | null
          bankruptcy?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          code_violations?: string[] | null
          company_name?: string | null
          contact_attempts?: number | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["property_status"] | null
          divorce?: boolean | null
          do_not_call?: boolean | null
          do_not_contact?: boolean | null
          do_not_mail?: boolean | null
          estimated_value?: number | null
          first_name?: string | null
          foreclosure?: boolean | null
          garage_spaces?: number | null
          garage_type?: string | null
          heating_type?: string | null
          hoa_fee?: number | null
          hoa_name?: string | null
          id?: string
          info?: Json | null
          last_contact_attempt?: string | null
          last_name?: string | null
          last_sale_amount?: number | null
          last_sale_date?: string | null
          lead_source?: string | null
          lead_stage?: string | null
          lead_temperature?:
            | Database["public"]["Enums"]["lead_temperature"]
            | null
          lists?: string[] | null
          lot_size?: number | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          mortgage_amount?: number | null
          mortgage_balance?: number | null
          mortgage_date?: string | null
          mortgage_lender?: string | null
          notes?: string | null
          organization_id?: string | null
          owner_occupied?: boolean | null
          ownership_type?: string | null
          parcel_number?: string | null
          pool?: boolean | null
          primary_email?: string | null
          primary_phone?: string | null
          property_city?: string | null
          property_class?: string | null
          property_state?: string | null
          property_street?: string | null
          property_type?: string | null
          property_use?: string | null
          property_zip?: string | null
          skip_trace_status?: string | null
          square_feet?: number | null
          status?: string | null
          tags?: string[] | null
          tax_assessment?: number | null
          tax_delinquent?: boolean | null
          tax_delinquent_amount?: number | null
          tax_delinquent_years?: number | null
          updated_at?: string
          user_id?: string | null
          vacant?: boolean | null
          year_built?: number | null
          years_owned?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_organizations: {
        Row: {
          created_at: string | null
          id: string
          invitation_accepted_at: string | null
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_offer: {
        Args: {
          p_record_id: string
          p_user_id: string
          p_amount: number
          p_notes?: string
        }
        Returns: Json
      }
      get_complete_record_details: {
        Args: {
          p_record_id: string
        }
        Returns: Json
      }
      get_monthly_upload_count: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      get_record_statistics: {
        Args: {
          record_id: string
        }
        Returns: {
          calls_count: number
          direct_mail_count: number
          sms_count: number
          rvm_count: number
          offers_count: number
          tasks_count: number
          completed_tasks_count: number
        }[]
      }
      get_record_with_relations: {
        Args: {
          record_id: string
        }
        Returns: Json
      }
      get_user_plan_limit: {
        Args: {
          user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      attempt_type: "calls" | "directMail" | "sms" | "rvm"
      lead_temperature: "Cold" | "Warm" | "Hot" | "Dead"
      offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "expired"
        | "withdrawn"
      property_status:
        | "Unknown"
        | "Owner Occupied"
        | "Tenant Occupied"
        | "Vacant"
        | "Under Construction"
        | "For Sale"
        | "For Rent"
      subscription_plan: "free_trial" | "basic" | "premium" | "enterprise"
      user_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
