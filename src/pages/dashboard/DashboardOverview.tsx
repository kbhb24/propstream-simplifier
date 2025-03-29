import { useState, useEffect } from 'react';
import { SecureDashboardLayout } from '@/components/layout/SecureDashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, File, Users, CheckCircle } from 'lucide-react';

// Detect if we're in mock mode
const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function DashboardOverview() {
  const { user, organization } = useAuth();
  const { toast } = useToast();
  const [totalRecords, setTotalRecords] = useState(0);
  const [monthlyUploads, setMonthlyUploads] = useState(0);
  const [vacantProperties, setVacantProperties] = useState(0);
  const [newVacantProperties, setNewVacantProperties] = useState(0);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchRecentTasks();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Make sure we're using the right approach for the mock client
      let result;
      if (isMockMode) {
        result = await supabase
          .from('records')
          .select();
      } else {
        result = await supabase.rpc('get_record_stats', { user_id: user.id });
      }
      
      if (!result) {
        console.warn('No result from get_record_stats');
        return;
      }
      
      const { data, error } = result;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTotalRecords(data[0].total_records || 0);
        setMonthlyUploads(data[0].monthly_uploads || 0);
        setVacantProperties(data[0].vacant_properties || 0);
        setNewVacantProperties(data[0].new_vacant_properties || 0);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard stats.',
        variant: 'destructive',
      });
    }
  };

  // Fix the issue with tasks query
  const fetchRecentTasks = async () => {
    try {
      // Make sure we're using the right approach for the mock client
      let result;
      if (isMockMode) {
        result = await supabase
          .from('tasks')
          .select();
    } else {
      result = await supabase
        .from('tasks')
        .select()
        .order('created_at', { ascending: false })
        .limit(5);
    }
    
    const { data, error } = result;
    
    if (error) throw error;
    setRecentTasks(data || []);
  } catch (error) {
    console.error('Error fetching recent tasks:', error);
    toast({
      title: 'Error',
      description: 'Failed to load recent tasks.',
      variant: 'destructive',
    });
  }
};

  return (
    <SecureDashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalRecords}</div>
              <p className="text-sm text-muted-foreground">
                Total number of records in your database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Monthly Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{monthlyUploads}</div>
              <p className="text-sm text-muted-foreground">
                Number of records uploaded this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Vacant Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{vacantProperties}</div>
              <p className="text-sm text-muted-foreground">
                Number of vacant properties in your database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                New Vacant Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{newVacantProperties}</div>
              <p className="text-sm text-muted-foreground">
                Number of new vacant properties added this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task: any) => (
                  <div key={task?.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{task?.title}</h3>
                      <Badge>{task?.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{task?.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent tasks
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SecureDashboardLayout>
  );
}
