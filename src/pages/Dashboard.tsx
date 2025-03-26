
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  User, 
  Phone, 
  Home, 
  BarChart as BarChartIcon,
  FileText,
  CheckSquare,
  Calendar
} from 'lucide-react';
import SecureDashboardLayout from '@/components/layout/SecureDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample data components kept from the original Dashboard

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .limit(5);
        
        if (error) throw error;
        
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <SecureDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button asChild>
          <Link to="/dashboard/records/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Record
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              3 added this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Phone Numbers</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">587</div>
            <p className="text-xs text-muted-foreground">
              43% of limit used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,842</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            Your latest assigned tasks and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Task</th>
                    <th className="p-3 text-center font-medium">Due Date</th>
                    <th className="p-3 text-center font-medium">Status</th>
                    <th className="p-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task: any) => (
                    <tr key={task.id} className="border-t border-border">
                      <td className="p-3">{task.title}</td>
                      <td className="p-3 text-center">{new Date(task.due_date).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in_progress' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/tasks/${task.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-4">No tasks found</p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/tasks/new">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Create a Task
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Activities</CardTitle>
          <CardDescription>Your scheduled activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-4 rounded-md border p-3">
              <Calendar className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Team Meeting</h4>
                <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-3">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Property Inspection</h4>
                <p className="text-xs text-muted-foreground">Thursday at 2:00 PM</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-3">
              <Phone className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Client Call</h4>
                <p className="text-xs text-muted-foreground">Friday at 11:30 AM</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SecureDashboardLayout>
  );
};

export default Dashboard;
