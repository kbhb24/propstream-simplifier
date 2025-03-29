import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import {
  Image,
  Upload,
  Loader2,
  Trash2
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Create a separate Supabase client with storage capability for file uploads
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseWithStorage = createClient(supabaseUrl, supabaseAnonKey)

interface PhotosProps {
  recordId: string
  userId: string
  files: Array<{
    id: string
    file_name: string
    file_type: string | null
    storage_path: string
    content_type: string | null
    created_at: string
  }>
  onPhotoAdded: (file: any) => void
  onPhotoDeleted: (fileId: string) => void
}

export function RecordDetailPhotos({ 
  recordId, 
  userId, 
  files = [],
  onPhotoAdded,
  onPhotoDeleted
}: PhotosProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const imageFiles = files.filter(file => 
    file.content_type?.startsWith('image/') || 
    file.file_type?.startsWith('image/')
  )

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target
    if (!fileInput.files || fileInput.files.length === 0) return

    const file = fileInput.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${recordId}/${fileName}`
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseWithStorage.storage
        .from('property_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        throw uploadError
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabaseWithStorage.storage
        .from('property_photos')
        .getPublicUrl(filePath)
      
      // Save file record in the database
      const { data, error: dbError } = await supabaseWithStorage
        .from('record_files')
        .insert({
          record_id: recordId,
          user_id: userId,
          file_name: file.name,
          file_type: 'image',
          file_size: file.size,
          storage_path: filePath,
          content_type: file.type,
          metadata: {
            url: publicUrl,
            width: null,
            height: null,
          }
        })
        .select()
        .single()
      
      if (dbError) {
        throw dbError
      }
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      })
      
      // Clear the file input
      fileInput.value = ''
      
      // Call the callback to update parent component
      onPhotoAdded(data)
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeletePhoto = async (fileId: string, filePath: string) => {
    if (!fileId || !filePath) return
    
    setIsDeleting(fileId)
    
    try {
      // Delete from Supabase Storage
      const { error: storageError } = await supabaseWithStorage.storage
        .from('property_photos')
        .remove([filePath])
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
      
      // Delete from database
      const { error: dbError } = await supabaseWithStorage
        .from('record_files')
        .delete()
        .eq('id', fileId)
      
      if (dbError) {
        throw dbError
      }
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      })
      
      // Call the callback to update parent component
      onPhotoDeleted(fileId)
    } catch (error: any) {
      console.error('Error deleting photo:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete photo",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Property Photos</h3>
        <div>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center p-6 border rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading photo...</p>
          </div>
        </div>
      )}
      
      {imageFiles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageFiles.map(file => {
            // Get public URL
            const { data: { publicUrl } } = supabaseWithStorage.storage
              .from('property_photos')
              .getPublicUrl(file.storage_path)
            
            return (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-0 aspect-square">
                  <img 
                    src={publicUrl} 
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
                <CardFooter className="p-2 bg-muted/10 justify-between">
                  <p className="text-xs truncate max-w-[70%]">{file.file_name}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full" 
                    onClick={() => handleDeletePhoto(file.id, file.storage_path)}
                    disabled={isDeleting === file.id}
                  >
                    {isDeleting === file.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3 text-destructive" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No property photos yet</p>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  )
} 