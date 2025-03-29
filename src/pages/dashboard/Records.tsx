import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlusCircle, Search, FilterX, Download, ChevronLeft, ChevronRight, MessageSquare, ShoppingCart, Plus, ArrowRight, Bug } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import AddPropertyDialog from '@/components/records/AddPropertyDialog';
import { Tables } from '@/types/supabase';
import { BulkUpload } from '@/components/upload/BulkUpload';
import type { Database } from '@/types/database';

type Record = Database['public']['Tables']['records']['Row'];

interface RecordWithInfo extends Record {
  info: {
    hasEmail: boolean;
    hasPhone: boolean;
  };
}

const BUSINESS_KEYWORDS = ['llc', 'trust', 'inc', 'corporation', 'corp', 'company', 'co', 'ltd'];

const isBusinessName = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return BUSINESS_KEYWORDS.some(keyword => lowerName.includes(keyword));
};

const isPOBox = (address: string): boolean => {
  const lowerAddress = address.toLowerCase();
  return lowerAddress.includes('po box') || lowerAddress.includes('p.o. box');
};

const isIncompleteRecord = (record: RecordWithInfo): boolean => {
  return (
    !record.first_name ||
    !record.last_name ||
    (record.mailing_address && isPOBox(record.mailing_address)) ||
    (record.first_name && isBusinessName(record.first_name)) ||
    (record.last_name && isBusinessName(record.last_name))
  );
};

const Records = () => {
  const { user, organization } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  console.log('Records component rendering, loading state:', loading);

  useEffect(() => {
    console.log('Auth state changed:', { user: !!user, organization: !!organization });
    if (user) {
      // Always load records if we have a user, don't depend on organization
      loadRecords();
    } else {
      console.log('No user found, cannot load records');
      setLoading(false);
    }
  }, [user]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      console.log('Starting to load records...');
      
      // First get the user's organization
      if (!user?.id) {
        console.error('No user ID available');
        setLoading(false);
        return;
      }
      
      console.log('Fetching user organization for user ID:', user.id);
      const { data: userOrgs, error: orgsError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);
        
      if (orgsError) {
        console.error('Error fetching user organizations:', orgsError);
        throw orgsError;
      }
      
      console.log('User organizations result:', userOrgs);
      
      if (!userOrgs || userOrgs.length === 0) {
        console.log('No organization found for user, no records to display');
        setRecords([]);
        setLoading(false);
        return;
      }
      
      const organizationId = userOrgs[0].organization_id;
      console.log('Using organization ID:', organizationId);
      
      // Then load records for that organization
      console.log('Fetching records for organization...');
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} records:`, data);
      setRecords(data || []);
    } catch (error: any) {
      console.error('Error loading records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load records: ' + (error.message || 'Unknown error'),
        variant: 'destructive'
      });
      setRecords([]); // Set empty records on error
    } finally {
      console.log('Finished loading records, setting loading to false');
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    // Apply search filter
    const matchesSearch = searchQuery 
      ? Object.values(record).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
      : true;
    
    // Apply filter type
    let matchesFilter = true;
    if (filterType === 'individual') {
      // Check for individual owner conditions
      matchesFilter = !!record.first_name && 
                      !!record.last_name && 
                      !!record.mailing_address &&
                      !(record.mailing_address && isPOBox(record.mailing_address)) &&
                      !(record.first_name && isBusinessName(record.first_name)) &&
                      !(record.last_name && isBusinessName(record.last_name));
    } else if (filterType === 'corporate') {
      // Check for corporate ownership conditions
      matchesFilter = !record.first_name ||
                      !record.last_name ||
                      (record.mailing_address && isPOBox(record.mailing_address)) ||
                      (record.first_name && isBusinessName(record.first_name)) ||
                      (record.last_name && isBusinessName(record.last_name));
    }

    // Apply assigned to me filter
    const matchesAssigned = assignedToMe 
      ? record.assignee_id === user?.id 
      : true;
    
    return matchesSearch && matchesFilter && matchesAssigned;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Records</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Your balance <span className="font-semibold">$0.00</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Buy Credits
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Talk To Us
          </Button>
        </div>
      </div>

      {/* Record Type Tabs */}
      <Tabs defaultValue="property" className="mb-6">
        <TabsList>
          <TabsTrigger value="property">Property Records</TabsTrigger>
          <TabsTrigger value="owner">Owner Records</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search for records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="assigned"
              checked={assignedToMe}
              onCheckedChange={setAssignedToMe}
            />
            <label htmlFor="assigned" className="text-sm">Assigned to me</label>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FilterX className="w-4 h-4" />
            Filter Records
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setAddPropertyOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New Property
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
        >
          All
        </Button>
        <Button
          variant={filterType === 'individual' ? 'default' : 'outline'}
          onClick={() => setFilterType('individual')}
        >
          Individual Owner
        </Button>
        <Button
          variant={filterType === 'corporate' ? 'default' : 'outline'}
          onClick={() => setFilterType('corporate')}
        >
          Unknown/Corporate Ownership
        </Button>
      </div>

      {/* Records Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>OWNER</TableHead>
              <TableHead>MAILING ADDRESS</TableHead>
              <TableHead>PROPERTY ADDRESS</TableHead>
              <TableHead>INFO</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>SKIPTRACE</TableHead>
              <TableHead>LISTS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    console.log(`Table row click - navigating to: /dashboard/record/${record.id}`);
                    navigate(`/dashboard/record/${record.id}`);
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    {record.first_name} {record.last_name}
                  </TableCell>
                  <TableCell>{record.mailing_address}</TableCell>
                  <TableCell>
                    {record.property_street}, {record.property_city}, {record.property_state} {record.property_zip}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {record.info?.hasEmail && <span className="text-green-500">✓</span>}
                      {record.info?.hasPhone && <span className="text-green-500">📞</span>}
                    </div>
                  </TableCell>
                  <TableCell>{record.current_status}</TableCell>
                  <TableCell>{record.info?.hasPhone ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{record.lists?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/dashboard/record/${record.id}`)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        navigate(`/debug/record/${record.id}`);
                      }}
                    >
                      <Bug className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRecords.length} records
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddPropertyDialog
        open={addPropertyOpen}
        onOpenChange={setAddPropertyOpen}
        onSuccess={loadRecords}
      />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => (
              <Card
                key={record.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  console.log(`Navigating to record: ${record.id}`);
                  navigate(`/dashboard/record/${record.id}`);
                }}
              >
                <CardHeader>
                  <CardTitle>{record.property_street}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {record.property_city}, {record.property_state} {record.property_zip}
                    </p>
                    <p className="text-sm">
                      Owner: {record.first_name} {record.last_name}
                    </p>
                    <p className="text-sm">
                      Status: {record.current_status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <BulkUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Records;
