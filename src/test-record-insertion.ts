import { supabase } from './lib/supabase';

/**
 * This is a simple test function to verify record insertion works
 * with the current database schema
 */
export async function testInsertRecord() {
  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No authentication session found');
      return { success: false, error: 'Not authenticated' };
    }

    // Simple record with minimal fields
    const recordData = {
      user_id: session.user.id,
      
      // Property information (only street is required)
      property_street: '123 Test Street',
      property_city: 'Test City',
      property_state: 'CA',
      property_zip: '90210',
      
      // Use string values for enums without type casting
      current_status: 'Unknown',
      lead_temperature: 'Cold',
      
      // Required fields
      contact_attempts: 0,
      do_not_contact: false
    };
    
    console.log('Attempting to insert record:', recordData);
    
    const { data, error } = await supabase
      .from('records')
      .insert(recordData)
      .select();
    
    if (error) {
      console.error('Error inserting record:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Record inserted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// This function helps to check the schema
export async function checkSchemaAndTables() {
  try {
    // Get list of tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return { success: false, error: tablesError.message };
    }
    
    // Get columns for the records table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', 'records');
    
    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return { success: false, error: columnsError.message };
    }
    
    return {
      success: true,
      tables,
      columns
    };
  } catch (error) {
    console.error('Error checking schema:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 