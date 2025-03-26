import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MessageSquare, 
  FileText,
  User
} from 'lucide-react';

// Sample data
const leadsData = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 90210',
    status: 'hot',
    source: 'Direct Mail',
    lastActivity: '2 hours ago',
    score: 85,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Othertown, NY 10001',
    status: 'warm',
    source: 'Email Campaign',
    lastActivity: '1 day ago',
    score: 62,
  },
  {
    id: 3,
    name: 'Robert Williams',
    email: 'rwilliams@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Sometown, TX 75023',
    status: 'cold',
    source: 'Website Form',
    lastActivity: '5 days ago',
    score: 35,
  },
  {
    id: 4,
    name: 'Jennifer Lee',
    email: 'jlee@example.com',
    phone: '(555) 321-6547',
    address: '321 Elm St, Newtown, FL 33401',
    status: 'hot',
    source: 'Referral',
    lastActivity: '3 hours ago',
    score: 78,
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 789-0123',
    address: '654 Maple Dr, Oldtown, IL 60007',
    status: 'warm',
    source: 'SMS Campaign',
    lastActivity: '2 days ago',
    score: 59,
  },
  {
    id: 6,
    name: 'Lisa Garcia',
    email: 'lgarcia@example.com',
    phone: '(555) 234-5678',
    address: '987 Cedar Ln, Cooltown, WA 98001',
    status: 'cold',
    source: 'Cold Call',
    lastActivity: '1 week ago',
    score: 28,
  },
  {
    id: 7,
    name: 'David Martinez',
    email: 'dmartinez@example.com',
    phone: '(555) 876-5432',
    address: '246 Birch Ct, Warmtown, AZ 85001',
    status: 'new',
    source: 'Property Search',
    lastActivity: 'Just now',
    score: 42,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'hot':
      return <Badge className="bg-red-500">Hot</Badge>;
    case 'warm':
      return <Badge className="bg-orange-500">Warm</Badge>;
    case 'cold':
      return <Badge className="bg-blue-500">Cold</Badge>;
    case 'new':
      return <Badge className="bg-green-500">New</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Lead Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Lead Filter</CardTitle>
          <CardDescription>Search and filter your leads by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or address..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              defaultValue="all" 
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Leads ({leadsData.length})</TabsTrigger>
          <TabsTrigger value="hot">Hot ({leadsData.filter(l => l.status === 'hot').length})</TabsTrigger>
          <TabsTrigger value="warm">Warm ({leadsData.filter(l => l.status === 'warm').length})</TabsTrigger>
          <TabsTrigger value="cold">Cold ({leadsData.filter(l => l.status === 'cold').length})</TabsTrigger>
          <TabsTrigger value="new">New ({leadsData.filter(l => l.status === 'new').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{lead.email}</span>
                          <span className="text-xs text-muted-foreground">{lead.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-1.5 rounded-full ${
                            lead.score >= 70 ? 'bg-green-500' : 
                            lead.score >= 40 ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-xs">{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Send Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Call">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Send SMS">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLeads.length} of {leadsData.length} leads
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Other tabs would have similar content filtered by status */}
        <TabsContent value="hot" className="mt-6">
          <Card>
          <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.filter(l => l.status === 'hot').map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{lead.email}</span>
                          <span className="text-xs text-muted-foreground">{lead.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-1.5 rounded-full ${
                            lead.score >= 70 ? 'bg-green-500' : 
                            lead.score >= 40 ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-xs">{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Send Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Call">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Send SMS">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLeads.filter(l => l.status === 'hot').length} of {leadsData.length} leads
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default LeadManagement;
