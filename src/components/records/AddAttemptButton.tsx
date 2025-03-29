import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { AttemptType } from '@/types/database'

interface AddAttemptButtonProps {
  recordId: string
  userId: string
  attemptType: AttemptType
  onSuccess?: (data: any) => void
}

export function AddAttemptButton({ 
  recordId, 
  userId, 
  attemptType,
  onSuccess 
}: AddAttemptButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddAttempt = async () => {
    if (!recordId || !userId) return
    
    setIsLoading(true)
    
    try {
      console.log('Adding attempt:', attemptType, 'for record:', recordId)
      
      // Step 1: Insert the attempt
      const { data, error } = await supabase
        .from('record_attempts')
        .insert({
          record_id: recordId,
          user_id: userId,
          type: attemptType,
          status: 'completed',
          notes: `Attempted to contact via ${attemptType}`
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error adding attempt:', error)
        throw error
      }
      
      console.log('Attempt added successfully:', data)
      
      // Step 2: Update the contact attempts count on the record
      const { error: updateError } = await supabase
        .from('records')
        .update({ 
          contact_attempts: supabase.rpc('increment', { 
            row_id: recordId,
            table_name: 'records',
            column_name: 'contact_attempts',
            increment_amount: 1
          }),
          last_contact_attempt: new Date().toISOString()
        })
        .eq('id', recordId)
      
      if (updateError) {
        console.error('Error updating record contact attempts:', updateError)
        throw updateError
      }
      
      // Success
      toast({
        title: "Success",
        description: `${attemptType} attempt recorded`,
      })
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error: any) {
      console.error('Error in handleAddAttempt:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to record attempt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleAddAttempt}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  )
} 