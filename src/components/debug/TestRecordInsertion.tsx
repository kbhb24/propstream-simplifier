import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function TestRecordInsertion() {
  const { user } = useAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const handleTestInsert = async () => {
    if (!user) {
      setResult('Error: Not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      // Simple record with minimal fields
      const recordData = {
        user_id: user.id,
        
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
        setResult(`Error: ${error.message}`);
      } else {
        console.log('Record inserted successfully:', data);
        setResult(`Success! Record ID: ${data[0].id}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setResult(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Record Insertion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleTestInsert} 
          disabled={loading || !user}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Insert Test Record'}
        </Button>
        
        {result && (
          <div className={`p-3 rounded-md ${result.startsWith('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {result}
          </div>
        )}
        
        {!user && (
          <div className="text-amber-600 text-sm">
            Please log in to test record insertion
          </div>
        )}
      </CardContent>
    </Card>
  );
} 