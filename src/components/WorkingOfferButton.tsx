import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { RecordOffer } from '@/types/supabase';

interface WorkingOfferButtonProps {
  recordId: string;
  userId: string;
  existingOffer?: RecordOffer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formatAmount = (value: string) => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = numericValue.split('.');
  const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
  
  // Add commas for thousands
  const number = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return number ? `$${number}` : '';
};

const parseAmount = (value: string) => {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
};

export function WorkingOfferButton({ 
  recordId, 
  userId, 
  existingOffer,
  onSuccess,
  onCancel 
}: WorkingOfferButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(existingOffer ? formatAmount(existingOffer.amount.toString()) : '');
  const [agreedAmount, setAgreedAmount] = useState(existingOffer?.agreed_amount ? formatAmount(existingOffer.agreed_amount.toString()) : '');
  const [status, setStatus] = useState<string>(existingOffer?.status || 'seller_considering');
  const [notes, setNotes] = useState(existingOffer?.notes || '');
  const { toast } = useToast();

  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate amount
      const numericAmount = parseAmount(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid offer amount');
      }

      // Validate agreed amount if provided
      let numericAgreedAmount = null;
      if (agreedAmount) {
        numericAgreedAmount = parseAmount(agreedAmount);
        if (isNaN(numericAgreedAmount) || numericAgreedAmount <= 0) {
          throw new Error('Please enter a valid agreed amount');
        }
      }

      const offerData = {
        record_id: recordId,
        user_id: userId,
        amount: numericAmount,
        agreed_amount: numericAgreedAmount,
        status,
        notes: notes || null,
        offer_date: new Date().toISOString()
      };

      let error;
      if (existingOffer) {
        // Update existing offer
        const { error: updateError } = await supabase
          .from('record_offers')
          .update(offerData)
          .eq('id', existingOffer.id);
        error = updateError;
      } else {
        // Insert new offer
        const { error: insertError } = await supabase
          .from('record_offers')
          .insert(offerData);
        error = insertError;
      }

      if (error) throw error;

      // Show success message
      toast({
        title: 'Success',
        description: `Offer ${existingOffer ? 'updated' : 'submitted'} successfully`,
      });

      // Close dialog and reset form
      handleClose();
      setAmount('');
      setAgreedAmount('');
      setStatus('seller_considering');
      setNotes('');

      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit offer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant={existingOffer ? "outline" : "default"}
        size={existingOffer ? "sm" : "default"}
      >
        {existingOffer ? 'Edit Offer' : 'Make Offer'}
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {existingOffer ? 'Edit Offer' : 'New Offer'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                OFFER AMOUNT
              </label>
              <Input
                id="amount"
                type="text"
                placeholder="$0.00"
                value={amount}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
                className="text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                OFFER STATUS
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seller_considering">Seller Considering</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under_contract">Under Contract</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="agreedAmount" className="block text-sm font-medium text-gray-700">
                AGREED AMOUNT
              </label>
              <Input
                id="agreedAmount"
                type="text"
                placeholder="$0.00"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(formatAmount(e.target.value))}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                NOTES
              </label>
              <Textarea
                id="notes"
                placeholder="Add any notes about the offer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {existingOffer ? 'Update Offer' : 'Submit Offer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 