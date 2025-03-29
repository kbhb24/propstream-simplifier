import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import { ChevronLeft, X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { PropertyStatusEnum, LeadTemperatureEnum } from '@/types/database'

interface AddPropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface PhoneNumber {
  number: string
  type: 'Unknown' | 'Landline' | 'Mobile' | 'VoIP'
  tags: string[]
}

interface Note {
  text: string
  created_at: string
  updated_at: string
}

interface PropertyFormData {
  // Owner Details
  companyName: string
  firstName: string
  lastName: string
  email: string
  ownerAddress: string
  ownerCity: string
  ownerState: string
  ownerZip: string
  
  // Property Details
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  notes: Note[]
  
  // Phone Numbers
  phoneNumbers: PhoneNumber[]
  
  // Lists & Tags
  lists: string[]
  tags: string[]
}

// Add this type for tag/list suggestions
interface Suggestion {
  value: string;
  type: 'tag' | 'list';
}

// Add these constants for predefined tags and lists
const PREDEFINED_TAGS = [
  'High Priority',
  'Follow Up',
  'Call Attempt 1',
  'Do Not Call',
  'Wrong Number',
  'Interested',
  'Not Interested'
];

const PREDEFINED_LISTS = [
  'Preforeclosure',
  'Vacant',
  'Inherited',
  'Tax Delinquent',
  'Out of State Owner',
  'Absentee Owner'
];

const formatPhoneNumber = (input: string): string => {
  // Remove all non-numeric characters
  const cleaned = input.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length >= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }
  
  return cleaned
}

const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const formatZipCode = (zip: string): string => {
  // Remove all non-numeric characters
  return zip.replace(/\D/g, '').slice(0, 5);
};

const isValidZipCode = (zip: string): boolean => {
  return /^\d{5}$/.test(zip) || zip.trim() === '';
};

export default function AddPropertyDialog({
  open,
  onOpenChange,
  onSuccess
}: AddPropertyDialogProps) {
  const { user } = useAuth()
  const [stage, setStage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    ownerAddress: '',
    ownerCity: '',
    ownerState: '',
    ownerZip: '',
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    notes: [],
    phoneNumbers: [],
    lists: [],
    tags: []
  })

  // New state for managing new tag/list inputs
  const [newPhoneTag, setNewPhoneTag] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newList, setNewList] = useState('')
  const [customList, setCustomList] = useState('')
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState<number | null>(null)
  const [newNote, setNewNote] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    if (field === 'ownerZip' || field === 'propertyZip') {
      value = formatZipCode(value);
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handleAddPhoneNumber = () => {
    const newPhoneNumber: PhoneNumber = {
      number: '',
      type: 'Unknown',
      tags: []
    }
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, newPhoneNumber]
    }))
  }

  const handlePhoneNumberChange = (index: number, value: string) => {
    const formattedNumber = formatPhoneNumber(value)
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === index ? { ...phone, number: formattedNumber } : phone
      )
    }))
  }

  const handlePhoneTypeChange = (index: number, type: PhoneNumber['type']) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === index ? { ...phone, type } : phone
      )
    }))
  }

  const handleAddPhoneTag = (phoneIndex: number) => {
    if (!newPhoneTag.trim()) return
    
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === phoneIndex 
          ? { ...phone, tags: [...phone.tags, newPhoneTag.trim()] }
          : phone
      )
    }))
    setNewPhoneTag('')
  }

  const handleRemovePhoneTag = (phoneIndex: number, tagIndex: number) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === phoneIndex 
          ? { ...phone, tags: phone.tags.filter((_, tIndex) => tIndex !== tagIndex) }
          : phone
      )
    }))
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    const now = new Date().toISOString()
    const note: Note = {
      text: newNote.trim(),
      created_at: now,
      updated_at: now
    }
    
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, note]
    }))
    setNewNote('')
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Prevent duplicates
    if (formData.tags.includes(newTag.trim())) {
      toast({
        title: 'Duplicate Tag',
        description: 'This tag has already been added',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
    setSuggestions([]);
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleAddList = () => {
    let listToAdd = '';
    
    if (newList === 'custom' && customList.trim()) {
      listToAdd = customList.trim();
    } else if (newList && newList !== 'custom') {
      listToAdd = newList;
    }
    
    if (!listToAdd) return;

    // Prevent duplicates
    if (formData.lists.includes(listToAdd)) {
      toast({
        title: 'Duplicate List',
        description: 'This list has already been added',
        variant: 'destructive'
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      lists: [...prev.lists, listToAdd]
    }));
    
    setNewList('');
    setCustomList('');
    setSuggestions([]);
  };

  const handleRemoveList = (list: string) => {
    setFormData(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l !== list)
    }))
  }

  // Add suggestion handling
  const handleTagInput = (value: string) => {
    setNewTag(value);
    if (value.trim()) {
      const matchingTags = PREDEFINED_TAGS
        .filter(tag => tag.toLowerCase().includes(value.toLowerCase()))
        .map(tag => ({ value: tag, type: 'tag' as const }));
      setSuggestions(matchingTags);
    } else {
      setSuggestions([]);
    }
  };

  const handleListInput = (value: string) => {
    setCustomList(value);
    if (value.trim()) {
      const matchingLists = PREDEFINED_LISTS
        .filter(list => list.toLowerCase().includes(value.toLowerCase()))
        .map(list => ({ value: list, type: 'list' as const }));
      setSuggestions(matchingLists);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!canProceedToNextStage()) {
      setError('Please fix validation errors before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to get user's organization, or create a new one if none exists
      let organization_id: string;
      
      // First check if user has any organizations
      const { data: userOrgs, error: orgsError } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (orgsError) {
        console.error('Error fetching user organizations:', orgsError);
      }
      
      if (!userOrgs || userOrgs.length === 0) {
        // No existing organization, create one
        console.log('No organization found, creating one...');
        
        // Create a new organization
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert([{ 
            name: `${user.email}'s Organization`,
            plan: 'basic',
            max_users: 5
          }])
          .select('id');
        
        if (createOrgError) {
          console.error('Error creating organization:', createOrgError);
          throw new Error('Failed to create organization');
        }
        
        if (!newOrg || newOrg.length === 0) {
          throw new Error('Failed to create organization - no ID returned');
        }
        
        organization_id = newOrg[0].id;
        console.log('Created new organization:', organization_id);
        
        // Add the user to this organization
        const { error: linkUserError } = await supabase
          .from('user_organizations')
          .insert([{
            user_id: user.id,
            organization_id,
            role: 'owner'
          }]);
          
        if (linkUserError) {
          console.error('Error linking user to organization:', linkUserError);
          throw new Error('Failed to link user to organization');
        }
        
        console.log('User linked to organization successfully');
      } else {
        // Use existing organization
        organization_id = userOrgs[0].organization_id;
        console.log('Using existing organization:', organization_id);
      }

      // Create the minimal record first to test database connection
      const recordData = {
        // Required fields
        user_id: user.id,
        organization_id,
        property_street: formData.propertyAddress.trim(),
        
        // Basic property info
        property_city: formData.propertyCity.trim() || null,
        property_state: formData.propertyState.trim() || null,
        property_zip: formData.propertyZip.trim() || null,
        
        // Enum fields as plain strings without type casting
        current_status: 'Unknown',
        lead_temperature: 'Cold',
        
        // Required defaults
        contact_attempts: 0,
        do_not_contact: false,
        
        // Owner info
        first_name: formData.firstName.trim() || null,
        last_name: formData.lastName.trim() || null,
        
        // Setup info JSONB
        info: {
          hasEmail: formData.email ? true : false,
          hasPhone: formData.phoneNumbers.some(p => p.number) ? true : false
        }
      };
      
      console.log('Inserting record with organization:', recordData);
      
      const { error: insertError } = await supabase
        .from('records')
        .insert(recordData);

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(insertError.message);
        toast({
          title: 'Error',
          description: `Failed to add property: ${insertError.message}`,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Property added successfully'
      });

      // Reset form and close dialog
      onSuccess?.();
      onOpenChange(false);
      setStage(1);
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        ownerAddress: '',
        ownerCity: '',
        ownerState: '',
        ownerZip: '',
        propertyAddress: '',
        propertyCity: '',
        propertyState: '',
        propertyZip: '',
        notes: [],
        phoneNumbers: [],
        lists: [],
        tags: []
      });
    } catch (error) {
      console.error('Error adding property:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNextStage = () => {
    switch (stage) {
      case 1:
        // Owner Information validation
        if (formData.email && !isValidEmail(formData.email)) {
          return false;
        }
        if (formData.ownerZip && !isValidZipCode(formData.ownerZip)) {
          return false;
        }
        return true;
      case 2:
        // Property Information validation
        if (!formData.propertyAddress.trim()) {
          return false;
        }
        if (formData.propertyZip && !isValidZipCode(formData.propertyZip)) {
          return false;
        }
        // Validate phone numbers if any exist
        return !formData.phoneNumbers.some(phone => 
          phone.number && !isValidPhoneNumber(phone.number)
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStage()) {
      setStage(prev => Math.min(prev + 1, 3))
    } else {
      if (stage === 1 && formData.email && !isValidEmail(formData.email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address',
          variant: 'destructive'
        })
      } else if (stage === 2) {
        if (!formData.propertyAddress.trim()) {
          toast({
            title: 'Property Address Required',
            description: 'Please enter the property address to continue',
            variant: 'destructive'
          })
        }
        if (formData.phoneNumbers.some(phone => phone.number && !isValidPhoneNumber(phone.number))) {
          toast({
            title: 'Invalid Phone Number',
            description: 'Please enter valid 10-digit phone numbers',
            variant: 'destructive'
          })
        }
      }
    }
  }

  const handleBack = () => {
    setStage(prev => Math.max(prev - 1, 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[900px] h-[85vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex overflow-hidden">
            {/* Progress Indicator */}
            <div className="w-16 bg-gray-100 flex flex-col items-center py-6 gap-4">
              {[1, 2, 3].map(number => (
                <div
                  key={number}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    number === stage
                      ? 'bg-blue-600 text-white'
                      : number < stage
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {number}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Stage 1: Owner Information */}
              {stage === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">1. Who owns the property</h2>
                    <p className="text-gray-600 mb-6">Enter property owner information.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">COMPANY NAME</label>
                      <Input
                        value={formData.companyName}
                        onChange={e => handleInputChange('companyName', e.target.value)}
                        placeholder="ABC Properties LLC"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">FIRST NAME</label>
                        <Input
                          value={formData.firstName}
                          onChange={e => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">LAST NAME</label>
                        <Input
                          value={formData.lastName}
                          onChange={e => handleInputChange('lastName', e.target.value)}
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">EMAIL</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        placeholder="john.smith@example.com"
                        className={formData.email && !isValidEmail(formData.email) ? 'border-red-500' : ''}
                      />
                      {formData.email && !isValidEmail(formData.email) && (
                        <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">ADDRESS</label>
                      <Input
                        value={formData.ownerAddress}
                        onChange={e => handleInputChange('ownerAddress', e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">CITY</label>
                        <Input
                          value={formData.ownerCity}
                          onChange={e => handleInputChange('ownerCity', e.target.value)}
                          placeholder="Los Angeles"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">STATE</label>
                        <Input
                          value={formData.ownerState}
                          onChange={e => handleInputChange('ownerState', e.target.value)}
                          placeholder="CA"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">ZIP CODE</label>
                        <Input
                          value={formData.ownerZip}
                          onChange={e => handleInputChange('ownerZip', e.target.value)}
                          placeholder="90001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 2: Property Information */}
              {stage === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">2. About the property</h2>
                    <p className="text-gray-600 mb-6">Enter property information.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">ADDRESS</label>
                      <Input
                        value={formData.propertyAddress}
                        onChange={e => handleInputChange('propertyAddress', e.target.value)}
                        placeholder="456 Oak Ave"
                        required
                        className={!formData.propertyAddress.trim() ? 'border-red-500' : ''}
                      />
                      {!formData.propertyAddress.trim() && (
                        <p className="text-red-500 text-sm mt-1">Property address is required</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">CITY</label>
                        <Input
                          value={formData.propertyCity}
                          onChange={e => handleInputChange('propertyCity', e.target.value)}
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">STATE</label>
                        <Input
                          value={formData.propertyState}
                          onChange={e => handleInputChange('propertyState', e.target.value)}
                          placeholder="CA"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">ZIP CODE</label>
                        <Input
                          value={formData.propertyZip}
                          onChange={e => handleInputChange('propertyZip', e.target.value)}
                          placeholder="94101"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">PHONE NUMBERS</label>
                      <div className="space-y-4">
                        {formData.phoneNumbers.map((phone, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={phone.number}
                                onChange={e => handlePhoneNumberChange(index, e.target.value)}
                                placeholder="(555) 123-4567"
                                className={`flex-1 ${phone.number && !isValidPhoneNumber(phone.number) ? 'border-red-500' : ''}`}
                              />
                              <Select
                                value={phone.type}
                                onValueChange={value => handlePhoneTypeChange(index, value as PhoneNumber['type'])}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Unknown">Unknown</SelectItem>
                                  <SelectItem value="Landline">Landline</SelectItem>
                                  <SelectItem value="Mobile">Mobile</SelectItem>
                                  <SelectItem value="VoIP">VoIP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {phone.number && !isValidPhoneNumber(phone.number) && (
                              <p className="text-red-500 text-sm">Please enter a valid 10-digit phone number</p>
                            )}
                            
                            {/* Phone Tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {phone.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                                  {tag}
                                  <button
                                    onClick={() => handleRemovePhoneTag(index, tagIndex)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add phone tag (e.g., 'Wrong Number', 'Do Not Call')"
                                value={selectedPhoneIndex === index ? newPhoneTag : ''}
                                onChange={e => {
                                  setSelectedPhoneIndex(index);
                                  setNewPhoneTag(e.target.value);
                                }}
                                onKeyPress={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddPhoneTag(index);
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddPhoneTag(index)}
                              >
                                Add Tag
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddPhoneNumber}
                          className="w-full"
                        >
                          Add a new phone
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">NOTES</label>
                      <div className="space-y-4">
                        {formData.notes.map((note, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Added {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Textarea
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            placeholder="Add a note about the property..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 3: Lists & Tags */}
              {stage === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">3. Lists & Tags</h2>
                    <p className="text-gray-600 mb-6">Add the property to lists and apply tags.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">LISTS</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.lists.map((list, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {list}
                            <button
                              onClick={() => handleRemoveList(list)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={newList}
                          onValueChange={setNewList}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select or create a new list" />
                          </SelectTrigger>
                          <SelectContent>
                            {PREDEFINED_LISTS.map(list => (
                              <SelectItem key={list} value={list}>
                                {list}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create new list
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {newList === 'custom' ? (
                          <>
                            <Input
                              value={customList}
                              onChange={e => handleListInput(e.target.value)}
                              placeholder="Enter new list name"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddList}
                              disabled={!customList.trim()}
                            >
                              Add
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddList}
                            disabled={!newList}
                          >
                            Add to List
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">TAGS</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a new tag"
                          value={newTag}
                          onChange={e => handleTagInput(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTag}
                          disabled={!newTag.trim()}
                        >
                          Add Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={stage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              {stage < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedToNextStage()}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Property'}
                </Button>
              )}
            </div>
            
            {error && (
              <p className="text-red-500 text-sm mt-2">
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 