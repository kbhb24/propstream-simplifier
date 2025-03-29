// Types for Supabase database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define explicit types for enums to ensure they're properly recognized
export type PropertyStatusEnum = 'Unknown' | 'Owner Occupied' | 'Tenant Occupied' | 'Vacant' | 'Under Construction' | 'For Sale' | 'For Rent'
export type LeadTemperatureEnum = 'Cold' | 'Warm' | 'Hot' | 'Dead'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          created_by: string | null
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          settings?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string
          last_name?: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          
          // Owner Information
          company_name: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          mailing_address: string | null
          mailing_city: string | null
          mailing_state: string | null
          mailing_zip: string | null
          phone_numbers: {
            number: string
            type: 'Unknown' | 'Landline' | 'Mobile' | 'VoIP'
            tags: string[]
          }[]
          
          // Additional info
          info: {
            hasEmail: boolean
            hasPhone: boolean
            [key: string]: any
          } | null
          
          // Property Information
          property_street: string
          property_city: string | null
          property_state: string | null
          property_zip: string | null
          property_county: string | null
          current_status: Database['public']['Enums']['property_status']
          
          // Property Details
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          lot_size: string | null
          year_built: number | null
          property_type: string | null
          zoning: string | null
          estimated_value: number | null
          last_sale_date: string | null
          last_sale_price: number | null
          
          // Lists and Tags
          lists: string[]
          tags: string[]
          
          // Tasks
          tasks: {
            id: string
            title: string
            status: string
            assigned_to: string | null
            created_at: string
          }[]
          
          // Marketing
          marketing_status: string | null
          last_contact_date: string | null
          contact_attempts: number
          do_not_contact: boolean
          
          // Lead Information
          lead_temperature: Database['public']['Enums']['lead_temperature']
          lead_source: string | null
          lead_status: string | null
          assignee_id: string | null
          
          // Notes
          notes: {
            text: string
            created_at: string
            updated_at: string
          }[]
          
          // Metadata
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          
          // Owner Information
          company_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          phone_numbers?: {
            number: string
            type: 'Unknown' | 'Landline' | 'Mobile' | 'VoIP'
            tags: string[]
          }[]
          
          // Additional info
          info?: {
            hasEmail: boolean
            hasPhone: boolean
            [key: string]: any
          } | null
          
          // Property Information
          property_street: string
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          property_county?: string | null
          current_status?: Database['public']['Enums']['property_status']
          
          // Property Details
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: string | null
          year_built?: number | null
          property_type?: string | null
          zoning?: string | null
          estimated_value?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          
          // Lists and Tags
          lists?: string[]
          tags?: string[]
          
          // Tasks
          tasks?: {
            id: string
            title: string
            status: string
            assigned_to: string | null
            created_at: string
          }[]
          
          // Marketing
          marketing_status?: string | null
          last_contact_date?: string | null
          contact_attempts?: number
          do_not_contact?: boolean
          
          // Lead Information
          lead_temperature?: Database['public']['Enums']['lead_temperature']
          lead_source?: string | null
          lead_status?: string | null
          assignee_id?: string | null
          
          // Notes
          notes?: {
            text: string
            created_at: string
            updated_at: string
          }[]
          
          // Metadata
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          
          // Owner Information
          company_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          phone_numbers?: {
            number: string
            type: 'Unknown' | 'Landline' | 'Mobile' | 'VoIP'
            tags: string[]
          }[]
          
          // Additional info
          info?: {
            hasEmail: boolean
            hasPhone: boolean
            [key: string]: any
          } | null
          
          // Property Information
          property_street?: string
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          property_county?: string | null
          current_status?: Database['public']['Enums']['property_status']
          
          // Property Details
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: string | null
          year_built?: number | null
          property_type?: string | null
          zoning?: string | null
          estimated_value?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          
          // Lists and Tags
          lists?: string[]
          tags?: string[]
          
          // Tasks
          tasks?: {
            id: string
            title: string
            status: string
            assigned_to: string | null
            created_at: string
          }[]
          
          // Marketing
          marketing_status?: string | null
          last_contact_date?: string | null
          contact_attempts?: number
          do_not_contact?: boolean
          
          // Lead Information
          lead_temperature?: Database['public']['Enums']['lead_temperature']
          lead_source?: string | null
          lead_status?: string | null
          assignee_id?: string | null
          
          // Notes
          notes?: {
            text: string
            created_at: string
            updated_at: string
          }[]
          
          // Metadata
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          activity_type: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          activity_type: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          activity_type?: string
          description?: string
          created_at?: string
        }
      }
      activity_log_entries: {
        Row: {
          id: string
          activity_log_id: string
          field_name: string
          old_value: Json
          new_value: Json
          created_at: string
        }
        Insert: {
          id?: string
          activity_log_id: string
          field_name: string
          old_value: Json
          new_value: Json
          created_at?: string
        }
        Update: {
          id?: string
          activity_log_id?: string
          field_name?: string
          old_value?: Json
          new_value?: Json
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          monthly_upload_limit: number
          price: number
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          monthly_upload_limit?: number
          price?: number
          features?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          monthly_upload_limit?: number
          price?: number
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          payment_method_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          plan_id: string
          status?: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          plan_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      upload_limits: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          month: string
          uploads_used: number
          uploads_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          month: string
          uploads_used?: number
          uploads_limit: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          month?: string
          uploads_used?: number
          uploads_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      owners: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      phone_numbers: {
        Row: {
          id: string
          number: string
          type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: string
          type: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: string
          type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      owner_phone_numbers: {
        Row: {
          owner_id: string
          phone_number_id: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          owner_id: string
          phone_number_id: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          owner_id?: string
          phone_number_id?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      record_phone_numbers: {
        Row: {
          record_id: string
          phone_number_id: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          record_id: string
          phone_number_id: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          record_id?: string
          phone_number_id?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          owner_id: string | null
          property_street: string
          property_city: string
          property_state: string
          property_zip: string
          current_status: string
          lead_temperature: string
          contact_attempts: number
          do_not_contact: boolean
          created_at: string
          updated_at: string
          last_contact_attempt: string | null
        }
        Insert: {
          id?: string
          user_id: string
          owner_id?: string | null
          property_street: string
          property_city: string
          property_state: string
          property_zip: string
          current_status?: string
          lead_temperature?: string
          contact_attempts?: number
          do_not_contact?: boolean
          created_at?: string
          updated_at?: string
          last_contact_attempt?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          owner_id?: string | null
          property_street?: string
          property_city?: string
          property_state?: string
          property_zip?: string
          current_status?: string
          lead_temperature?: string
          contact_attempts?: number
          do_not_contact?: boolean
          created_at?: string
          updated_at?: string
          last_contact_attempt?: string | null
        }
      }
      record_attempts: {
        Row: {
          id: string
          record_id: string
          user_id: string
          type: string
          status: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          record_id: string
          user_id: string
          type: string
          status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          user_id?: string
          type?: string
          status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      record_offers: {
        Row: {
          id: string
          record_id: string
          user_id: string
          amount: number
          agreed_amount: number | null
          status: string
          notes: string | null
          offer_date: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          record_id: string
          user_id: string
          amount: number
          agreed_amount?: number | null
          status?: string
          notes?: string | null
          offer_date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          record_id?: string
          user_id?: string
          amount?: number
          agreed_amount?: number | null
          status?: string
          notes?: string | null
          offer_date?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_record_stats: {
        Args: { user_id: string }
        Returns: {
          total_records: number
          monthly_uploads: number
          vacant_properties: number
          new_vacant_properties: number
        }[]
      }
      increment: {
        Args: { row_id: string }
        Returns: number
      }
      increment_field: {
        Args: { table_name: string; record_id: string; field_name: string }
        Returns: number
      }
    }
    Enums: {
      property_status: PropertyStatusEnum
      lead_temperature: LeadTemperatureEnum
      attempt_type: 'calls' | 'directMail' | 'sms' | 'rvm'
      offer_status: 'seller_considering' | 'accepted' | 'rejected' | 'under_contract' | 'canceled'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      task_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
      message_type: 'note' | 'sms' | 'email' | 'call' | 'system'
      direct_mail_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'returned'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Helper types for common tables
export type Organization = Tables<'organizations'>
export type Plan = Tables<'plans'>
export type Subscription = Tables<'subscriptions'>
export type UploadLimit = Tables<'upload_limits'>

// Helper types for enums
export type PropertyStatus = Database['public']['Enums']['property_status']
export type LeadTemperature = Database['public']['Enums']['lead_temperature']
export type AttemptType = Database['public']['Enums']['attempt_type']
export type OfferStatus = Database['public']['Enums']['offer_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskStatus = Database['public']['Enums']['task_status']
export type MessageType = Database['public']['Enums']['message_type']
export type DirectMailStatus = Database['public']['Enums']['direct_mail_status'] 