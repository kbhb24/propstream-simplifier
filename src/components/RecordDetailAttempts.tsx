import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Phone, Mail, MessageSquare, Voicemail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addRecordAttempt } from '@/lib/supabase-helpers'
import { AttemptType } from '@/types/database'

interface AttemptProps {
  recordId: string
  userId: string
  attempts: Array<{
    id: string
    type: AttemptType
    status: string | null
    notes: string | null
    created_at: string
  }>
  onAttemptAdded: (data: any, type: AttemptType) => void
}

export function RecordDetailAttempts({ 
  recordId, 
  userId, 
  attempts = [],
  onAttemptAdded
}: AttemptProps) {
  const { toast } = useToast()
  const [loadingType, setLoadingType] = useState<AttemptType | null>(null)

  const handleAddAttempt = async (type: AttemptType) => {
    if (!recordId || !userId) return
    
    setLoadingType(type)
    
    try {
      console.log('Adding attempt:', type, 'for record:', recordId)
      const result = await addRecordAttempt(recordId, userId, type)
      
      const attemptData = result.data || {
        id: `temp-${Date.now()}`,
        record_id: recordId,
        user_id: userId,
        type: type,
        status: 'completed',
        notes: `Attempted to contact via ${type}`,
        created_at: new Date().toISOString(),
      }
      
      toast({
        title: "Success",
        description: `${type} attempt recorded`,
      })
      
      onAttemptAdded(attemptData, type)
    } catch (error: any) {
      console.error(`Error adding ${type} attempt:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to record ${type} attempt`,
        variant: "destructive",
      })
    } finally {
      setLoadingType(null)
    }
  }

  // Count attempts by type
  const callAttempts = attempts.filter(a => a.type === 'calls').length || 0
  const directMailAttempts = attempts.filter(a => a.type === 'directMail').length || 0
  const smsAttempts = attempts.filter(a => a.type === 'sms').length || 0
  const rvmAttempts = attempts.filter(a => a.type === 'rvm').length || 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Call Attempts</p>
            <p className="text-2xl font-bold">{callAttempts}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddAttempt('calls')}
            disabled={loadingType === 'calls'}
          >
            {loadingType === 'calls' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Direct Mail Attempts</p>
            <p className="text-2xl font-bold">{directMailAttempts}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddAttempt('directMail')}
            disabled={loadingType === 'directMail'}
          >
            {loadingType === 'directMail' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">SMS Attempts</p>
            <p className="text-2xl font-bold">{smsAttempts}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddAttempt('sms')}
            disabled={loadingType === 'sms'}
          >
            {loadingType === 'sms' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">RVM Attempts</p>
            <p className="text-2xl font-bold">{rvmAttempts}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddAttempt('rvm')}
            disabled={loadingType === 'rvm'}
          >
            {loadingType === 'rvm' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Attempt History */}
      <div className="space-y-2">
        <h3 className="font-medium">Contact History</h3>
        <div className="border rounded-lg divide-y">
          {attempts.length > 0 ? (
            attempts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((attempt) => (
              <div key={attempt.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    {attempt.type === 'calls' && <Phone className="h-4 w-4" />}
                    {attempt.type === 'sms' && <MessageSquare className="h-4 w-4" />}
                    {attempt.type === 'directMail' && <Mail className="h-4 w-4" />}
                    {attempt.type === 'rvm' && <Voicemail className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {attempt.type === 'calls' ? 'Call attempt' : 
                       attempt.type === 'sms' ? 'SMS sent' : 
                       attempt.type === 'directMail' ? 'Direct mail sent' : 
                       'Ringless voicemail sent'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(attempt.created_at).toLocaleString()} • {attempt.status || 'Completed'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No contact attempts yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 