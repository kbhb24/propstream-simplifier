import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkingOfferButton } from '@/components/WorkingOfferButton';
import { PhoneNumberManager } from '@/components/PhoneNumberManager';
import PropertyDetails from '@/components/PropertyDetails';
import type { Record, RecordOffer, RecordAttempt, PhoneNumber } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

// Extracted utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatOfferStatus = (status: string) => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'seller_considering':
      return 'bg-blue-100 text-blue-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'under_contract':
      return 'bg-purple-100 text-purple-800';
    case 'canceled':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Extracted components for better code splitting
const OffersList = React.memo(({ 
  offers, 
  recordId, 
  userId, 
  onSuccess 
}: { 
  offers: RecordOffer[],
  recordId: string,
  userId: string,
  onSuccess: () => void
}) => (
  <div className="space-y-4">
    {offers
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((offer) => (
        <div
          key={offer.id}
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatCurrency(offer.amount)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                {formatOfferStatus(offer.status)}
              </span>
            </div>
            {offer.agreed_amount && (
              <p className="text-sm text-gray-600">
                Agreed Amount: {formatCurrency(offer.agreed_amount)}
              </p>
            )}
            {offer.notes && (
              <p className="text-sm text-gray-600">{offer.notes}</p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(offer.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WorkingOfferButton
              recordId={recordId}
              userId={userId}
              existingOffer={offer}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      ))}
  </div>
));

export function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<Record & {
    record_offers: RecordOffer[];
    record_attempts: RecordAttempt[];
    phone_numbers: PhoneNumber[];
  } | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const fetchRecord = useCallback(async () => {
    if (!id || !user) return;
    
    try {
      setLoading(true);

      const { data: recordData, error: recordError } = await supabase
        .from('records')
        .select(`
          *,
          record_offers (
            id,
            amount,
            agreed_amount,
            status,
            notes,
            offer_date,
            created_at,
            updated_at,
            user_id
          ),
          record_attempts (
            id,
            type,
            status,
            notes,
            created_at
          ),
          phone_numbers (
            id,
            number,
            type,
            status
          )
        `)
        .eq('id', id)
        .single();

      if (recordError) throw recordError;
      if (!recordData) {
        toast({
          title: 'Record not found',
          description: 'The record you are looking for does not exist.',
          variant: 'destructive',
        });
        navigate('/dashboard/records');
        return;
      }

      setRecord(recordData);
    } catch (error) {
      console.error('Error fetching record:', error);
      toast({
        title: 'Error',
        description: 'Failed to load record details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate, toast]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleAddTag = useCallback(async () => {
    if (!record || !newTag.trim()) return;

    try {
      const updatedTags = [...(record.tags || []), newTag.trim()];
      const { error } = await supabase
        .from('records')
        .update({ tags: updatedTags })
        .eq('id', record.id);

      if (error) throw error;

      setNewTag('');
      setShowTagInput(false);
      fetchRecord();
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tag.',
        variant: 'destructive',
      });
    }
  }, [record, newTag, fetchRecord, toast]);

  const handleRemoveTag = useCallback(async (tagToRemove: string) => {
    if (!record) return;

    try {
      const updatedTags = (record.tags || []).filter(tag => tag !== tagToRemove);
      const { error } = await supabase
        .from('records')
        .update({ tags: updatedTags })
        .eq('id', record.id);

      if (error) throw error;

      fetchRecord();
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tag.',
        variant: 'destructive',
      });
    }
  }, [record, fetchRecord, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {record.property_street}
          </h1>
          <div className="flex items-center gap-2">
            <a href="/dashboard/records" className="text-sm text-blue-600 hover:text-blue-800">
              Back to Records List
            </a>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">Property Details</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {record.tags?.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {showTagInput ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag"
                  className="h-6 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagInput(false)}
                  className="h-6 px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTagInput(true)}
                className="h-6"
              >
                Add Tag
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/records')}
        >
          Back to Records
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyDetails 
              record={record} 
              onUpdate={fetchRecord}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneNumberManager
              recordId={record.id}
              userId={record.user_id}
              onUpdate={fetchRecord}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Offers</CardTitle>
            <WorkingOfferButton
              recordId={id}
              userId={user.id}
              onSuccess={fetchRecord}
            />
          </CardHeader>
          <CardContent>
            {record.record_offers?.length ? (
              <OffersList 
                offers={record.record_offers}
                recordId={id}
                userId={user.id}
                onSuccess={fetchRecord}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">No offers yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 