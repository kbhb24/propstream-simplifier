import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import type { Record } from '@/types/supabase';

interface PropertyDetailsProps {
  record: Record;
  onUpdate: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ record, onUpdate }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    air_conditioner: record.air_conditioner || '',
    year_built: record.year_built?.toString() || '',
    bedrooms: record.bedrooms?.toString() || '',
    bathrooms: record.bathrooms?.toString() || '',
    square_feet: record.square_feet?.toString() || '',
    lot_size: record.lot_size || '',
    current_status: record.current_status || '',
    lead_temperature: record.lead_temperature || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData: any = {
        air_conditioner: formData.air_conditioner || null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        lot_size: formData.lot_size || null,
        current_status: formData.current_status,
        lead_temperature: formData.lead_temperature
      };

      const { error } = await supabase
        .from('records')
        .update(updateData)
        .eq('id', record.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property details updated successfully',
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating property details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property details',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      air_conditioner: record.air_conditioner || '',
      year_built: record.year_built?.toString() || '',
      bedrooms: record.bedrooms?.toString() || '',
      bathrooms: record.bathrooms?.toString() || '',
      square_feet: record.square_feet?.toString() || '',
      lot_size: record.lot_size || '',
      current_status: record.current_status || '',
      lead_temperature: record.lead_temperature || ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">EDIT PROPERTY DETAILS</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">ADDRESS</h3>
          <p className="text-base">{record.property_street}</p>
          <p className="text-base">
            {record.property_city}, {record.property_state} {record.property_zip}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">AIR CONDITIONER</h3>
            <Select 
              value={formData.air_conditioner} 
              onValueChange={(value) => handleInputChange('air_conditioner', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Window">Window</SelectItem>
                <SelectItem value="Split System">Split System</SelectItem>
                <SelectItem value="Portable">Portable</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">YEAR</h3>
            <Input
              value={formData.year_built}
              onChange={(e) => handleInputChange('year_built', e.target.value)}
              type="number"
              placeholder="Year Built"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">BEDROOMS</h3>
            <Input
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              type="number"
              placeholder="Number of Bedrooms"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">BATHROOMS</h3>
            <Input
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              type="number"
              placeholder="Number of Bathrooms"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">SQUARE FEET</h3>
            <Input
              value={formData.square_feet}
              onChange={(e) => handleInputChange('square_feet', e.target.value)}
              type="number"
              placeholder="Square Footage"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">LOT SIZE</h3>
            <Input
              value={formData.lot_size}
              onChange={(e) => handleInputChange('lot_size', e.target.value)}
              placeholder="Lot Size"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">STATUS</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              value={formData.current_status} 
              onValueChange={(value) => handleInputChange('current_status', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unknown">Unknown</SelectItem>
                <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                <SelectItem value="Tenant Occupied">Tenant Occupied</SelectItem>
                <SelectItem value="Vacant">Vacant</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={formData.lead_temperature} 
              onValueChange={(value) => handleInputChange('lead_temperature', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select temperature..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">PROPERTY DETAILS</h3>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">ADDRESS</h3>
        <p className="text-base">{record.property_street}</p>
        <p className="text-base">
          {record.property_city}, {record.property_state} {record.property_zip}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">AIR CONDITIONER</h3>
          <p className="text-base">{record.air_conditioner || '—'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">YEAR</h3>
          <p className="text-base">{record.year_built || '—'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">BEDROOMS</h3>
          <p className="text-base">{record.bedrooms || '—'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">BATHROOMS</h3>
          <p className="text-base">{record.bathrooms || '—'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">SQUARE FEET</h3>
          <p className="text-base">{record.square_feet ? record.square_feet.toLocaleString() : '—'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">LOT SIZE</h3>
          <p className="text-base">{record.lot_size || '—'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">STATUS</h3>
        <div className="flex gap-2">
          <Badge variant="outline">{record.current_status}</Badge>
          <Badge variant="secondary">{record.lead_temperature}</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">CONTACT ATTEMPTS</h3>
        <p className="text-base">{record.contact_attempts || 0}</p>
        {record.last_contact_attempt && (
          <p className="text-sm text-gray-500 mt-1">
            Last attempt: {new Date(record.last_contact_attempt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails; 