
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import RecordDetails from '@/components/records/RecordDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types/supabase';

type Record = Database['public']['Tables']['records']['Row'];

export default function RecordDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    async function fetchRecord() {
      try {
        // Use a simpler query structure that's more reliable
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: 'Record not found',
            description: 'The requested record could not be found.',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        console.log('Fetched record:', data);

        // Transform the data to match the RecordDetails component props
        const transformedRecord = {
          id: data.id,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          company_name: data.company_name,
          mailing_address: data.mailing_address,
          properties_count: 1, // We'll update this with actual count
          sold_properties: 0,
          leads_count: 0,
          offers_count: 0,
          calls_made: data.contact_attempts || 0,
          verified_numbers_percentage: 0,
          total_investment: 0,
          phone_numbers: Array.isArray(data.phone_numbers) ? data.phone_numbers.map((phone: any) => ({
            number: phone.number || phone,
            type: phone.type || 'Unknown',
            verified: phone.verified || false,
          })) : [],
          emails: [], // We'll need to add this to the schema
          properties: [{
            id: data.id,
            address: data.property_street,
            city: data.property_city,
            state: data.property_state,
            zip: data.property_zip
          }]
        };

        setRecord(transformedRecord);
      } catch (error) {
        console.error('Error fetching record:', error);
        toast({
          title: 'Error',
          description: 'Failed to load record details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRecord();
    }
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="flex gap-6">
          <Skeleton className="flex-1 h-96" />
          <Skeleton className="w-[300px] h-96" />
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return <RecordDetails record={record} />;
}
