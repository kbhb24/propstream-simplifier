
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string
          user_id: string
          organization_id?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          phone_numbers?: Json | null
          property_street?: string | null
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          current_status?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: string | null
          year_built?: number | null
          air_conditioner?: string | null
          contact_attempts?: number | null
          last_contact_attempt?: string | null
          lead_temperature?: string | null
          created_at: string
          updated_at: string
          tags?: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          phone_numbers?: Json | null
          property_street?: string | null
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          current_status?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: string | null
          year_built?: number | null
          air_conditioner?: string | null
          contact_attempts?: number | null
          last_contact_attempt?: string | null
          lead_temperature?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_state?: string | null
          mailing_zip?: string | null
          phone_numbers?: Json | null
          property_street?: string | null
          property_city?: string | null
          property_state?: string | null
          property_zip?: string | null
          current_status?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: string | null
          year_built?: number | null
          air_conditioner?: string | null
          contact_attempts?: number | null
          last_contact_attempt?: string | null
          lead_temperature?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
      }
    }
  }
}
