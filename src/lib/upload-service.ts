import { supabase } from './supabase';
import type { Database } from '@/types/database';
import Papa from 'papaparse';
import { PropertyStatus, LeadTemperature } from '@/types/database';

export interface UploadProgress {
  total: number;
  processed: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export interface RecordUploadData {
  // Property Information
  property_street?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  property_county?: string;
  property_type?: string;
  current_status?: PropertyStatus;
  
  // Building Details
  year_built?: number;
  square_feet?: number;
  lot_size?: string;
  bedrooms?: number;
  bathrooms?: number;
  
  // Owner Information
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mailing_address?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_zip?: string;
  
  // Sale Details
  last_sale_price?: number;
  last_sale_date?: string;
  estimated_value?: number;
  
  // Marketing & Contact
  lead_temperature?: LeadTemperature;
  lead_source?: string;
  lead_status?: string;
  
  // Lists and Tags
  lists?: string[];
  tags?: string[];
  
  // Notes
  notes?: { text: string, created_at: string, updated_at: string }[];
  
  // These fields are for mapping compatibility with CSV imports
  // They'll be transformed during processing
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_mailing_address?: string;
  property_address?: string;
  property_sqft?: number;
  property_beds?: number;
  property_baths?: number;
  property_year_built?: number;
  status?: string;
  tax_assessed_value?: number;
  tax_assessed_year?: number;
  days_on_market?: number;
  note_text?: string;
}

// Mapping of common CSV column headers to our database fields
export const FIELD_MAPPINGS: Record<string, string> = {
  'address': 'property_street',
  'property_address': 'property_street',
  'street': 'property_street',
  'street_address': 'property_street',
  
  'city': 'property_city',
  'property_city': 'property_city',
  
  'state': 'property_state',
  'property_state': 'property_state',
  
  'zip': 'property_zip',
  'zipcode': 'property_zip',
  'zip_code': 'property_zip',
  'property_zip': 'property_zip',
  
  'county': 'property_county',
  'property_county': 'property_county',
  
  'status': 'current_status',
  'property_status': 'current_status',
  'current_status': 'current_status',
  
  'year_built': 'year_built',
  'property_year_built': 'year_built',
  
  'sqft': 'square_feet',
  'square_feet': 'square_feet',
  'property_sqft': 'square_feet',
  
  'beds': 'bedrooms',
  'bedrooms': 'bedrooms',
  'property_beds': 'bedrooms',
  
  'baths': 'bathrooms',
  'bathrooms': 'bathrooms',
  'property_baths': 'bathrooms',
  
  'company': 'company_name',
  'company_name': 'company_name',
  
  'first_name': 'first_name',
  'owner_first_name': 'first_name',
  
  'last_name': 'last_name',
  'owner_last_name': 'last_name',
  
  'email': 'email',
  'owner_email': 'email',
  
  'phone': 'owner_phone',
  'owner_phone': 'owner_phone',
  
  'mailing_address': 'mailing_address',
  'owner_mailing_address': 'mailing_address',
  
  'mailing_city': 'mailing_city',
  'owner_mailing_city': 'mailing_city',
  
  'mailing_state': 'mailing_state',
  'owner_mailing_state': 'mailing_state',
  
  'mailing_zip': 'mailing_zip',
  'owner_mailing_zip': 'mailing_zip',
  
  'estimated_value': 'estimated_value',
  'property_value': 'estimated_value',
  
  'last_sale_date': 'last_sale_date',
  'sale_date': 'last_sale_date',
  
  'last_sale_price': 'last_sale_price',
  'sale_price': 'last_sale_price',
  
  'lead_temperature': 'lead_temperature',
  'lead_status': 'lead_status',
  'lead_source': 'lead_source',
  
  'notes': 'note_text',
  'note': 'note_text'
};

export class UploadService {
  private static instance: UploadService;
  private organizationId: string | null = null;

  private constructor() {}

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  setContext(organizationId: string) {
    this.organizationId = organizationId;
  }

  async parseCSV(file: File): Promise<RecordUploadData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Transform CSV headers to match our field names
          const records = results.data.map(record => {
            const transformedRecord: Record<string, unknown> = {};
            
            // Process each field in the record
            for (const [key, value] of Object.entries(record)) {
              // Normalize the key (lowercase, replace spaces with underscores)
              const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
              
              // Map the field if a mapping exists, otherwise use the normalized key
              const mappedKey = FIELD_MAPPINGS[normalizedKey] || normalizedKey;
              
              // Handle empty values
              if (value === '') continue;
              
              // Set the value in the transformed record
              transformedRecord[mappedKey] = value;
            }
            
            return transformedRecord as RecordUploadData;
          });
          
          resolve(records);
        },
        error: (error) => {
          reject(error);
        },
        skipEmptyLines: true,
      });
    });
  }

  async validateRecords(records: RecordUploadData[]): Promise<UploadProgress> {
    const progress: UploadProgress = {
      total: records.length,
      processed: 0,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const errors: string[] = [];

      // Check for required property street/address
      if (!record.property_street && !record.property_address) {
        errors.push('Property address/street is required');
      } else if (record.property_address && !record.property_street) {
        // Map property_address to property_street if needed
        record.property_street = record.property_address;
      }

      // Phone number validation
      if (record.owner_phone && !/^\+?[\d\s-()]+$/.test(record.owner_phone.toString())) {
        errors.push('Invalid phone number format');
      }

      // Email validation
      if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.toString())) {
        errors.push('Invalid email format');
      } else if (record.owner_email && !record.email) {
        // Map owner_email to email if needed
        record.email = record.owner_email;
      }

      // Handle owner name splitting into first/last name
      if (record.owner_name && (!record.first_name || !record.last_name)) {
        const parts = record.owner_name.split(' ');
        if (parts.length >= 2) {
          record.first_name = parts[0];
          record.last_name = parts.slice(1).join(' ');
        } else {
          record.last_name = record.owner_name;
        }
      }

      // Numeric fields validation and conversion
      const numericFields: [keyof RecordUploadData, string][] = [
        ['square_feet', 'Square feet'],
        ['property_sqft', 'Property square footage'],
        ['bedrooms', 'Bedrooms'],
        ['property_beds', 'Property beds'],
        ['bathrooms', 'Bathrooms'],
        ['property_baths', 'Property baths'],
        ['year_built', 'Year built'],
        ['property_year_built', 'Property year built'],
        ['estimated_value', 'Estimated value'],
        ['last_sale_price', 'Last sale price'],
      ];

      for (const [field, label] of numericFields) {
        if (record[field] !== undefined && record[field] !== null) {
          const value = Number(record[field]);
          if (isNaN(value)) {
            errors.push(`${label} must be a number`);
          } else {
            // Convert to number
            (record[field] as unknown) = value;
            
            // Map aliases to main fields
            if (field === 'property_sqft' && !record.square_feet) record.square_feet = value;
            if (field === 'property_beds' && !record.bedrooms) record.bedrooms = value;
            if (field === 'property_baths' && !record.bathrooms) record.bathrooms = value;
            if (field === 'property_year_built' && !record.year_built) record.year_built = value;
          }
        }
      }

      // Handle property status mapping
      if (record.status && !record.current_status) {
        // Attempt to map status string to a valid PropertyStatus enum value
        const statusValue = this.mapStatusToEnum(record.status);
        if (statusValue) {
          record.current_status = statusValue;
        }
      }

      // Handle lead temperature mapping
      if (record.lead_temperature) {
        const temperatureValue = this.mapTemperatureToEnum(record.lead_temperature.toString());
        if (!temperatureValue) {
          errors.push('Invalid lead temperature value');
        } else {
          record.lead_temperature = temperatureValue;
        }
      }

      // Handle note text
      if (record.note_text && !record.notes) {
        const now = new Date().toISOString();
        record.notes = [{
          text: record.note_text.toString(),
          created_at: now,
          updated_at: now
        }];
      }

      if (errors.length > 0) {
        progress.failed++;
        progress.errors.push({
          row: i + 1,
          error: errors.join(', '),
        });
      } else {
        progress.success++;
      }

      progress.processed++;
    }

    return progress;
  }

  private mapStatusToEnum(status: string): PropertyStatus | null {
    const statusMap: Record<string, PropertyStatus> = {
      'unknown': 'Unknown',
      'owner occupied': 'Owner Occupied',
      'owner-occupied': 'Owner Occupied',
      'tenant occupied': 'Tenant Occupied',
      'tenant-occupied': 'Tenant Occupied',
      'vacant': 'Vacant',
      'under construction': 'Under Construction',
      'construction': 'Under Construction',
      'for sale': 'For Sale',
      'for rent': 'For Rent'
    };
    
    return statusMap[status.toLowerCase()] || null;
  }

  private mapTemperatureToEnum(temp: string): LeadTemperature | null {
    const tempMap: Record<string, LeadTemperature> = {
      'cold': 'Cold',
      'warm': 'Warm',
      'hot': 'Hot',
      'dead': 'Dead'
    };
    
    return tempMap[temp.toLowerCase()] || null;
  }

  async uploadRecords(records: RecordUploadData[]): Promise<UploadProgress> {
    if (!this.organizationId) {
      throw new Error('Organization ID not set');
    }

    const progress: UploadProgress = {
      total: records.length,
      processed: 0,
      success: 0,
      failed: 0,
      errors: [],
    };

    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('records')
          .insert(
            batch.map((record) => {
              // Clean up the record for insertion
              const {
                property_address, property_sqft, property_beds, property_baths, 
                property_year_built, owner_name, owner_email, owner_phone,
                status, tax_assessed_value, tax_assessed_year, days_on_market,
                note_text, ...cleanRecord
              } = record;
              
              return {
                ...cleanRecord,
                user_id: supabase.auth.getUser().then(res => res.data.user?.id) || null,
                organization_id: this.organizationId,
                current_status: record.current_status || 'Unknown',
                lead_temperature: record.lead_temperature || 'Cold'
              };
            })
          )
          .select();

        if (error) {
          progress.failed += batch.length;
          progress.errors.push({
            row: i + 1,
            error: error.message,
          });
          console.error('Error uploading batch:', error);
        } else {
          progress.success += data?.length || 0;
        }
      } catch (err) {
        progress.failed += batch.length;
        progress.errors.push({
          row: i + 1,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        console.error('Error uploading batch:', err);
      }

      progress.processed += batch.length;
    }

    return progress;
  }
} 