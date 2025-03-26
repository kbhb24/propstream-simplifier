
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SecureDashboardLayout from '@/components/layout/SecureDashboardLayout';
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
import { PlusCircle, Search, FilterX, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setRecords(data || []);
      } catch (error: any) {
        console.error('Error fetching records:', error);
        toast({
          title: 'Error fetching records',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const filteredRecords = records.filter((record: any) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      record.title?.toLowerCase().includes(searchTerm) ||
      record.address?.toLowerCase().includes(searchTerm) ||
      record.city?.toLowerCase().includes(searchTerm) ||
      record.state?.toLowerCase().includes(searchTerm) ||
      record.zip?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <SecureDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Records</h2>
        <Button asChild>
          <Link to="/dashboard/records/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Record
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="vacant">Vacant</TabsTrigger>
            <TabsTrigger value="with-phone">With Phone</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <FilterX className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>All Records</CardTitle>
              <CardDescription>
                Manage and view all your property records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <p>Loading records...</p>
                </div>
              ) : filteredRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.title}</TableCell>
                        <TableCell>{record.address}</TableCell>
                        <TableCell>{record.city}</TableCell>
                        <TableCell>{record.state}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            record.status === 'new' 
                              ? 'bg-blue-100 text-blue-800' 
                              : record.status === 'contacted' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dashboard/records/${record.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">No records found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try a different search term' : 'Add your first record to get started'}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link to="/dashboard/records/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Record
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacant" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Vacant Properties</CardTitle>
              <CardDescription>
                View and manage vacant property records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No vacant properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Add vacant properties to see them here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="with-phone" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Properties with Phone Numbers</CardTitle>
              <CardDescription>
                View properties that have phone numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No properties with phone numbers found</h3>
                <p className="text-muted-foreground mb-4">
                  Add phone numbers to properties to see them here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SecureDashboardLayout>
  );
};

export default Records;
