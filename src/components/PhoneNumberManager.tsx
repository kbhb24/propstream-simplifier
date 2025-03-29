import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Phone, Plus } from 'lucide-react';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type PhoneNumber = Tables['phone_numbers']['Row'];
type OwnerPhoneNumber = Tables['owner_phone_numbers']['Row'];
type RecordPhoneNumber = Tables['record_phone_numbers']['Row'];

type PhoneNumberWithRelations = PhoneNumber & {
  owner_phone_numbers?: OwnerPhoneNumber[];
  record_phone_numbers?: RecordPhoneNumber[];
  is_primary?: boolean;
};

interface PhoneNumberManagerProps {
  recordId: string;
  userId: string;
  onUpdate?: () => void;
}

const PHONE_TYPES = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'home', label: 'Home' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' }
] as const;

const PHONE_STATUSES = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'valid', label: 'Valid' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'do_not_call', label: 'Do Not Call' }
] as const;

export function PhoneNumberManager({ recordId, userId, onUpdate }: PhoneNumberManagerProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberWithRelations[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [newType, setNewType] = useState<string>('mobile');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhoneNumbers();
  }, [userId, recordId]);

  const fetchPhoneNumbers = async () => {
    try {
      let query;
      
      if (userId) {
        // Fetch phone numbers for owner
        const { data, error } = await supabase
          .from('phone_numbers')
          .select(`
            *,
            owner_phone_numbers!inner(is_primary)
          `)
          .eq('owner_phone_numbers.owner_id', userId);
          
        if (error) throw error;
        if (!data) return;

        setPhoneNumbers(
          data.map((d) => ({
            ...d,
            is_primary: d.owner_phone_numbers[0].is_primary,
          }))
        );
      }
      
      if (recordId) {
        // Fetch phone numbers for record
        const { data, error } = await supabase
          .from('phone_numbers')
          .select(`
            *,
            record_phone_numbers!inner(is_primary)
          `)
          .eq('record_phone_numbers.record_id', recordId);
          
        if (error) throw error;
        if (!data) return;

        setPhoneNumbers(
          data.map((d) => ({
            ...d,
            is_primary: d.record_phone_numbers[0].is_primary,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load phone numbers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter a phone number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAdding(true);

      // Format the phone number (basic formatting, you might want to use a library for better validation)
      const formattedNumber = newNumber.replace(/\D/g, '');
      if (formattedNumber.length !== 10) {
        toast({
          title: 'Invalid number',
          description: 'Please enter a valid 10-digit phone number.',
          variant: 'destructive',
        });
        return;
      }

      // Insert the phone number
      const { data: phoneData, error: phoneError } = await supabase
        .from('phone_numbers')
        .insert({
          number: formattedNumber,
          type: newType,
          status: 'unknown',
        })
        .select()
        .single();

      if (phoneError) throw phoneError;

      // Create the association
      const { error: linkError } = await supabase
        .from(recordId ? 'record_phone_numbers' : 'owner_phone_numbers')
        .insert({
          [recordId ? 'record_id' : 'owner_id']: recordId || userId,
          phone_number_id: phoneData.id,
          is_primary: phoneNumbers.length === 0, // Make primary if it's the first number
        });

      if (linkError) throw linkError;

      toast({
        title: 'Success',
        description: 'Phone number added successfully',
      });

      setNewNumber('');
      setNewType('mobile');
      fetchPhoneNumbers();
      onUpdate?.();

    } catch (error) {
      console.error('Error adding phone number:', error);
      toast({
        title: 'Error',
        description: 'Failed to add phone number. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleSetPrimary = async (phoneId: string) => {
    try {
      if (userId) {
        await supabase
          .from('owner_phone_numbers')
          .update({ is_primary: false })
          .eq('owner_id', userId);

        await supabase
          .from('owner_phone_numbers')
          .update({ is_primary: true })
          .eq('owner_id', userId)
          .eq('phone_number_id', phoneId);
      }

      if (recordId) {
        await supabase
          .from('record_phone_numbers')
          .update({ is_primary: false })
          .eq('record_id', recordId);

        await supabase
          .from('record_phone_numbers')
          .update({ is_primary: true })
          .eq('record_id', recordId)
          .eq('phone_number_id', phoneId);
      }

      fetchPhoneNumbers();
      onUpdate?.();

    } catch (error) {
      console.error('Error setting primary phone:', error);
      toast({
        title: 'Error',
        description: 'Failed to set primary phone number.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (phoneId: string, newStatus: string) => {
    try {
      await supabase
        .from('phone_numbers')
        .update({ status: newStatus })
        .eq('id', phoneId);

      fetchPhoneNumbers();
      onUpdate?.();

    } catch (error) {
      console.error('Error updating phone status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update phone status.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (phoneId: string) => {
    try {
      setIsLoading(true);

      // The phone number will be automatically removed from junction tables due to CASCADE
      await supabase
        .from('phone_numbers')
        .delete()
        .eq('id', phoneId);

      fetchPhoneNumbers();
      onUpdate?.();

    } catch (error) {
      console.error('Error deleting phone number:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete phone number.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading phone numbers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Phone Numbers ({phoneNumbers.length}/30)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Phone
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNumber} className="flex gap-2">
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="flex-1"
          />
          <Select
            value={newType}
            onValueChange={setNewType}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHONE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!newNumber}>
            Add
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {phoneNumbers.map((phone) => (
          <div
            key={phone.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{phone.number}</span>
              {phone.is_primary && (
                <Badge variant="secondary" className="ml-2">
                  Primary
                </Badge>
              )}
              <Badge
                variant={
                  phone.status === 'valid'
                    ? 'default'
                    : phone.status === 'invalid'
                    ? 'destructive'
                    : phone.status === 'do_not_call'
                    ? 'destructive'
                    : 'secondary'
                }
                className="ml-2"
              >
                {phone.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={phone.status}
                onValueChange={(value) => handleUpdateStatus(phone.id, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {!phone.is_primary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetPrimary(phone.id)}
                >
                  Make Primary
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(phone.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 