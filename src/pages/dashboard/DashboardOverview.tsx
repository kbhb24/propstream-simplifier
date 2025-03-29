import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Upload, Phone, Building2, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Tables } from '@/types/supabase';

interface DashboardStats {
  totalRecords: number;
  recordsWithPhone: number;
  monthlyUploads: number;
  monthlyLimit: number;
}

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    recordsWithPhone: 0,
    monthlyUploads: 0,
    monthlyLimit: 25000, // Default to Basic plan limit
  });
  const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Get user's monthly upload count
        const { data: monthlyUploads, error: monthlyError } = await supabase
          .rpc('get_monthly_upload_count', { user_id: user.id });
        
        if (monthlyError) throw monthlyError;

        // Get user's plan limit
        const { data: planLimit, error: planError } = await supabase
          .rpc('get_user_plan_limit', { user_id: user.id });
        
        if (planError) throw planError;

        // Get total records and records with phone numbers
        const { data: recordsData, error: recordsError } = await Promise.resolve(
          supabase
            .from('records')
            .select('*')
        );
        
        if (recordsError) throw recordsError;

        // Calculate stats
        const totalRecords = recordsData?.length || 0;
        const recordsWithPhone = recordsData?.filter(record => 
          record.phone_numbers && record.phone_numbers.length > 0
        ).length || 0;

        setStats({
          totalRecords,
          recordsWithPhone,
          monthlyUploads: monthlyUploads || 0,
          monthlyLimit: planLimit || 25000, // Fallback to Basic plan limit
        });

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await Promise.resolve(
          supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)
        );
        
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const handleUpgradePlan = () => {
    // TODO: Implement plan upgrade flow
    toast({
      title: 'Coming Soon',
      description: 'Plan upgrade functionality will be available soon.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate('/dashboard/records/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
          <Button onClick={() => navigate('/dashboard/upload')}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Records Uploaded</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyUploads}</div>
            <Progress value={(stats.monthlyUploads / stats.monthlyLimit) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.monthlyUploads} of {stats.monthlyLimit} records this month
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleUpgradePlan}>
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records with Phone Numbers</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recordsWithPhone}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.recordsWithPhone / stats.totalRecords) * 100).toFixed(1)}% of total records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Total records in the system
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent tasks</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview; 