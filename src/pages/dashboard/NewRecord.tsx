import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SecureDashboardLayout } from '@/components/layout/SecureDashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Detect if we're in mock mode
const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function NewRecord() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    property_street: '',
    property_city: '',
    property_state: '',
    property_zip: '',
    first_name: '',
    last_name: '',
    mailing_address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.property_street) {
    toast({
      title: 'Error',
      description: 'Property street is required.',
      variant: 'destructive',
    });
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Handle both mock mode and real mode
    let response;
    if (isMockMode) {
      // In mock mode, simulate a successful response
      response = { data: { id: 'mock-id' }, error: null };
    } else {
      // In real mode, perform the actual insert
      response = await supabase
        .from('records')
        .insert({
          user_id: user?.id || '',
          property_street: formData.property_street,
          property_city: formData.property_city,
          property_state: formData.property_state,
          property_zip: formData.property_zip,
          first_name: formData.first_name,
          last_name: formData.last_name,
          mailing_address: formData.mailing_address,
        })
        .select()
        .single();
    }
    
    const { data, error } = response;
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Record created successfully.',
    });
    
    navigate(`/dashboard/record/${data.id}`);
  } catch (error: any) {
    console.error('Error creating record:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to create record.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <SecureDashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="property_street">Property Street</Label>
                <Input
                  type="text"
                  id="property_street"
                  name="property_street"
                  value={formData.property_street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="property_city">Property City</Label>
                <Input
                  type="text"
                  id="property_city"
                  name="property_city"
                  value={formData.property_city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="property_state">Property State</Label>
                <Input
                  type="text"
                  id="property_state"
                  name="property_state"
                  value={formData.property_state}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="property_zip">Property Zip</Label>
                <Input
                  type="text"
                  id="property_zip"
                  name="property_zip"
                  value={formData.property_zip}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="mailing_address">Mailing Address</Label>
                <Input
                  type="text"
                  id="mailing_address"
                  name="mailing_address"
                  value={formData.mailing_address}
                  onChange={handleChange}
                />
              </div>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Record'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </SecureDashboardLayout>
  );
}
