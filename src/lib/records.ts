import { supabase } from './supabase';
import type { Database } from '@/types/supabase';
import type { Tables } from '@/types/supabase';

type Record = Tables<'records'>;

interface ImportResult {
  status: 'new' | 'updated';
  record: Record;
}

/**
 * Normalizes an address for consistent matching
 */
function normalizeAddress(
  street: string,
  city?: string | null,
  state?: string | null,
  zip?: string | null
): string {
  return [
    street.toLowerCase().trim().replace(/\s+/g, ' '),
    city?.toLowerCase().trim(),
    state?.toUpperCase().trim(),
    zip?.trim()
  ].filter(Boolean).join('|');
}

/**
 * Checks if a record already exists and returns it if found
 */
async function findExistingRecord(
  organizationId: string,
  propertyStreet: string,
  propertyCity?: string | null,
  propertyState?: string | null,
  propertyZip?: string | null
): Promise<Record | null> {
  const normalizedAddress = normalizeAddress(
    propertyStreet,
    propertyCity,
    propertyState,
    propertyZip
  );

  const { data: records } = await supabase
    .from('records')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('property_street', propertyStreet)
    .eq('property_city', propertyCity || '')
    .eq('property_state', propertyState || '')
    .eq('property_zip', propertyZip || '')
    .maybeSingle();

  return records;
}

/**
 * Updates the monthly upload count for new records
 */
async function incrementMonthlyUploadCount(userId: string, organizationId: string): Promise<void> {
  const currentDate = new Date();
  const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  // First try to update existing record
  const { data: existingLimit } = await supabase
    .from('upload_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('month', month)
    .single();

  if (existingLimit) {
    await supabase
      .from('upload_limits')
      .update({ uploads_used: existingLimit.uploads_used + 1 })
      .eq('id', existingLimit.id);
  } else {
    // Create new record if doesn't exist
    await supabase
      .from('upload_limits')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        month,
        uploads_used: 1,
        uploads_limit: 1000 // This should come from the user's subscription plan
      });
  }
}

/**
 * Imports or updates a record, handling duplicate detection and upload limits
 */
export async function importRecord(
  userId: string,
  organizationId: string,
  recordData: Partial<Record>
): Promise<ImportResult> {
  // Check for existing record
  const existingRecord = await findExistingRecord(
    organizationId,
    recordData.property_street!,
    recordData.property_city,
    recordData.property_state,
    recordData.property_zip
  );

  if (existingRecord) {
    // Update existing record
    const { data: updatedRecord, error: updateError } = await supabase
      .from('records')
      .update({
        ...recordData,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (updateError) throw updateError;
    
    return {
      status: 'updated',
      record: updatedRecord
    };
  } else {
    // Create new record
    const { data: newRecord, error: insertError } = await supabase
      .from('records')
      .insert({
        ...recordData,
        user_id: userId,
        organization_id: organizationId,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Increment monthly upload count for new records only
    await incrementMonthlyUploadCount(userId, organizationId);

    return {
      status: 'new',
      record: newRecord
    };
  }
}

/**
 * Batch imports multiple records, handling duplicates and upload limits
 */
export async function batchImportRecords(
  userId: string,
  organizationId: string,
  records: Partial<Record>[]
): Promise<{ new: number; updated: number; failed: number }> {
  const results = {
    new: 0,
    updated: 0,
    failed: 0
  };

  for (const record of records) {
    try {
      const result = await importRecord(userId, organizationId, record);
      if (result.status === 'new') {
        results.new++;
      } else {
        results.updated++;
      }
    } catch (error) {
      console.error('Failed to import record:', error);
      results.failed++;
    }
  }

  return results;
} 