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
      records: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          company_name: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          mailing_address: string | null
          mailing_city: string | null
          mailing_state: string | null
          mailing_zip: string | null
          property_street: string
          property_city: string | null
          property_state: string | null
          property_zip: string | null
          property_county: string | null
          current_status: string
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
          lists: string[]
          tags: string[]
          contact_attempts: number
          last_contact_attempt: string | null
          lead_temperature: string
          created_at: string
          updated_at: string
          air_conditioner: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          company_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          property_street: string
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          property_county?: string | null
          current_status?: string
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
          lists?: string[]
          tags?: string[]
          contact_attempts?: number
          last_contact_attempt?: string | null
          lead_temperature?: string
          created_at?: string
          updated_at?: string
          air_conditioner?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          company_name?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          property_street?: string
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          property_county?: string | null
          current_status?: string
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
          lists?: string[]
          tags?: string[]
          contact_attempts?: number
          last_contact_attempt?: string | null
          lead_temperature?: string
          created_at?: string
          updated_at?: string
          air_conditioner?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      property_status: 'Unknown' | 'Owner Occupied' | 'Tenant Occupied' | 'Vacant' | 'Under Construction' | 'For Sale' | 'For Rent'
      offer_status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn' | 'under_contract' | 'canceled'
      attempt_type: 'calls' | 'directMail' | 'sms' | 'rvm'
      lead_temperature: 'cold' | 'warm' | 'hot'
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Record types
export type Record = Tables<'records'>;
export type RecordOffer = Tables<'record_offers'>;
export type RecordAttempt = Tables<'record_attempts'>;
export type PhoneNumber = Tables<'phone_numbers'>;
export type OwnerPhoneNumber = Tables<'owner_phone_numbers'>;
export type RecordPhoneNumber = Tables<'record_phone_numbers'>;

// Enum types
export type PropertyStatus = Enums<'property_status'>;
export type OfferStatus = Enums<'offer_status'>;
export type AttemptType = Enums<'attempt_type'>;
export type LeadTemperature = Enums<'lead_temperature'> 