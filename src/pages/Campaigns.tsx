import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Mail, MessageSquare, Phone, Plus } from 'lucide-react';

const campaignsData = [
  {
    id: 1,
    name: 'Spring Property Alert',
    type: 'email',
    status: 'active',
    sent: 2450,
    opened: 1230,
    responded: 368,
    progress: 65,
  },
  {
    id: 2,
    name: 'Distressed Property Owners',
    type: 'directmail',
    status: 'scheduled',
    sent: 5000,
    opened: 0,
    responded: 0,
    progress: 0,
  },
  {
    id: 3,
    name: 'Re-engagement Campaign',
    type: 'sms',
    status: 'active',
    sent: 1870,
    opened: 1654,
    responded: 432,
    progress: 88,
  },
  {
    id: 4,
    name: 'New Listing Notification',
    type: 'email',
    status: 'completed',
    sent: 3200,
    opened: 2100,
    responded: 546,
    progress: 100,
  },
  {
    id: 5,
    name: 'Cold Call Sequence',
    type: 'phone',
    status: 'active',
    sent: 450,
    opened: 450,
    responded: 87,
    progress: 42,
  },
];

const getCampaignIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-5 w-5 text-blue-500" />;
    case 'sms':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'phone':
      return <Phone className="h-5 w-5 text-purple-500" />;
    default:
      return <Mail className="h-5 w-5 text-orange-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const Campaigns = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Campaigns</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="directmail">Direct Mail</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {campaignsData.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getCampaignIcon(campaign.type)}</div>
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{campaign.progress}% Complete</span>
                    <Progress value={campaign.progress} className="h-2 w-24 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-lg font-medium">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Opened</p>
                      <p className="text-lg font-medium">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responded</p>
                      <p className="text-lg font-medium">{campaign.responded.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="secondary" size="sm">Edit Campaign</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {campaignsData.filter(c => c.type === 'email').map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getCampaignIcon(campaign.type)}</div>
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{campaign.progress}% Complete</span>
                    <Progress value={campaign.progress} className="h-2 w-24 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-lg font-medium">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Opened</p>
                      <p className="text-lg font-medium">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responded</p>
                      <p className="text-lg font-medium">{campaign.responded.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="secondary" size="sm">Edit Campaign</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Other tabs would have similar content */}
        <TabsContent value="directmail" className="mt-6">
          <div className="text-center p-12">
            <h3 className="text-lg font-medium">No direct mail campaigns yet</h3>
            <p className="text-muted-foreground mt-2">Create your first direct mail campaign to reach property owners.</p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Direct Mail Campaign
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Campaigns;
