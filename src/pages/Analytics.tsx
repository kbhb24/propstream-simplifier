
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  ArrowDown, 
  ArrowUp, 
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data
const monthlyLeadData = [
  { name: 'Jan', leads: 120, conversions: 24 },
  { name: 'Feb', leads: 150, conversions: 28 },
  { name: 'Mar', leads: 180, conversions: 39 },
  { name: 'Apr', leads: 210, conversions: 48 },
  { name: 'May', leads: 250, conversions: 56 },
  { name: 'Jun', leads: 280, conversions: 62 },
  { name: 'Jul', leads: 310, conversions: 68 },
  { name: 'Aug', leads: 290, conversions: 65 },
  { name: 'Sep', leads: 320, conversions: 72 },
  { name: 'Oct', leads: 350, conversions: 80 },
  { name: 'Nov', leads: 370, conversions: 85 },
  { name: 'Dec', leads: 390, conversions: 92 },
];

const channelData = [
  { name: 'Direct Mail', value: 35 },
  { name: 'Email', value: 25 },
  { name: 'SMS', value: 15 },
  { name: 'Cold Call', value: 10 },
  { name: 'Referral', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const conversionByStageData = [
  { name: 'Awareness', value: 100 },
  { name: 'Interest', value: 75 },
  { name: 'Consideration', value: 50 },
  { name: 'Intent', value: 30 },
  { name: 'Evaluation', value: 20 },
  { name: 'Purchase', value: 10 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('year');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Analytics</h2>
        <div className="flex items-center gap-3">
          <Select defaultValue="year" onValueChange={(value) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Leads</CardDescription>
            <div className="flex items-end justify-between">
              <CardTitle className="text-2xl">3,240</CardTitle>
              <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>12.5%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">vs. previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <div className="flex items-end justify-between">
              <CardTitle className="text-2xl">23.8%</CardTitle>
              <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>3.2%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">vs. previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Response Time</CardDescription>
            <div className="flex items-end justify-between">
              <CardTitle className="text-2xl">4.3 hrs</CardTitle>
              <div className="flex items-center text-sm text-red-600 dark:text-red-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>0.5 hrs</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">vs. previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cost Per Lead</CardDescription>
            <div className="flex items-end justify-between">
              <CardTitle className="text-2xl">$12.40</CardTitle>
              <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>$1.50</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">vs. previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="leads" className="mb-8">
        <TabsList>
          <TabsTrigger value="leads">Lead Generation</TabsTrigger>
          <TabsTrigger value="conversions">Conversion Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lead Generation Over Time</CardTitle>
                <CardDescription>Number of leads generated by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyLeadData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="leads" stroke="#8884d8" fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Distribution by acquisition channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="conversions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversions Over Time</CardTitle>
                <CardDescription>Lead to customer conversion rate by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyLeadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversions" stroke="#00C49F" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion by Stage</CardTitle>
                <CardDescription>Conversion funnel analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={conversionByStageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-6">
          {/* Campaign performance content */}
          <div className="text-center p-12">
            <h3 className="text-lg font-medium">Campaign Analytics</h3>
            <p className="text-muted-foreground mt-2">More detailed campaign analytics will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
