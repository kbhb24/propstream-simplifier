
import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  PlusCircle, 
  User, 
  Phone, 
  Home, 
  BarChart as BarChartIcon
} from 'lucide-react';

// Sample data
const campaignData = [
  { name: 'Jan', directMail: 65, email: 40, sms: 24 },
  { name: 'Feb', directMail: 59, email: 38, sms: 28 },
  { name: 'Mar', directMail: 80, email: 52, sms: 35 },
  { name: 'Apr', directMail: 81, email: 56, sms: 30 },
  { name: 'May', directMail: 56, email: 38, sms: 25 },
  { name: 'Jun', directMail: 55, email: 45, sms: 32 },
  { name: 'Jul', directMail: 72, email: 53, sms: 38 },
];

const leadSourceData = [
  { name: 'Direct Mail', value: 400 },
  { name: 'Email', value: 300 },
  { name: 'SMS', value: 200 },
  { name: 'Cold Call', value: 150 },
  { name: 'Website', value: 250 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const flowData = [
  { name: 'New Lead Welcome', leads: 245, conversion: 35 },
  { name: 'Follow-up Sequence', leads: 188, conversion: 42 },
  { name: 'Property Alert', leads: 167, conversion: 28 },
  { name: 'Re-engagement', leads: 124, conversion: 18 },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button asChild>
          <Link to="/flow-designer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Flow
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Monthly performance across different campaign types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="directMail" name="Direct Mail" fill="#0088FE" />
                  <Bar dataKey="email" name="Email" fill="#00C49F" />
                  <Bar dataKey="sms" name="SMS" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>
              Distribution of leads by acquisition channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Flow Performance</CardTitle>
          <CardDescription>
            Performance metrics for your top flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Flow Name</th>
                  <th className="p-3 text-center font-medium">Leads Processed</th>
                  <th className="p-3 text-center font-medium">Conversion Rate</th>
                  <th className="p-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flowData.map((flow, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-3">{flow.name}</td>
                    <td className="p-3 text-center">{flow.leads}</td>
                    <td className="p-3 text-center">{flow.conversion}%</td>
                    <td className="p-3 text-center">
                      <Button variant="outline" size="sm">
                        <Link to="/flow-designer">Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
