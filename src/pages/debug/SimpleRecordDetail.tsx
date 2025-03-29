import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import PropertyDetails from '@/components/PropertyDetails'

export default function SimpleRecordDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [record, setRecord] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching record with ID:', id);
        
        // Simple query for just the main record
        const { data, error } = await supabase
          .from('records')
          .select()
          .eq('id', id)
          .maybeSingle();

        console.log('Fetch response:', { data, error });

        if (error) {
          setError(`Database error: ${error.message}`);
          return;
        }

        if (!data) {
          setError('Record not found');
          return;
        }

        // Verify user owns the record
        if (data.user_id !== user.id) {
          setError('You do not have permission to view this record');
          return;
        }

        // Set the record data
        setRecord(data);
      } catch (err: any) {
        console.error('Error fetching record:', err);
        setError(`Unexpected error: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, user, toast, navigate]);

  const handleGoBack = () => {
    navigate('/dashboard/records');
  };

  const handleRecordUpdate = async () => {
    // Re-fetch the record
    if (!id || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('records')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        setError(`Database error: ${error.message}`);
        return;
      }

      if (!data) {
        setError('Record not found');
        return;
      }

      setRecord(data);
    } catch (err: any) {
      console.error('Error updating record:', err);
      setError(`Unexpected error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button onClick={handleGoBack} variant="outline" className="mb-4">
        Back to Records
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Record Detail (Debug)</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : record ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <PropertyDetails 
                  record={record} 
                  onUpdate={handleRecordUpdate}
                />
              </Card>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Raw Record Data</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <p>No record found.</p>
        )}
      </div>
    </div>
  )
} 