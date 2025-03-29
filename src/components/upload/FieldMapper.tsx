import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FIELD_MAPPINGS } from '@/lib/upload-service';
import { PropertyStatus, LeadTemperature } from '@/types/database';

interface FieldMapperProps {
  headers: string[];
  sampleData: Record<string, string>[];
  onMapChange: (mappings: Record<string, string>) => void;
  onContinue: () => void;
}

const DATABASE_FIELDS = [
  { label: 'Property Street', value: 'property_street', required: true },
  { label: 'Property City', value: 'property_city' },
  { label: 'Property State', value: 'property_state' },
  { label: 'Property ZIP', value: 'property_zip' },
  { label: 'Property County', value: 'property_county' },
  { label: 'Property Type', value: 'property_type' },
  { label: 'Current Status', value: 'current_status' },
  { label: 'Year Built', value: 'year_built' },
  { label: 'Square Feet', value: 'square_feet' },
  { label: 'Lot Size', value: 'lot_size' },
  { label: 'Bedrooms', value: 'bedrooms' },
  { label: 'Bathrooms', value: 'bathrooms' },
  { label: 'Company Name', value: 'company_name' },
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Email', value: 'email' },
  { label: 'Mailing Address', value: 'mailing_address' },
  { label: 'Mailing City', value: 'mailing_city' },
  { label: 'Mailing State', value: 'mailing_state' },
  { label: 'Mailing ZIP', value: 'mailing_zip' },
  { label: 'Last Sale Price', value: 'last_sale_price' },
  { label: 'Last Sale Date', value: 'last_sale_date' },
  { label: 'Estimated Value', value: 'estimated_value' },
  { label: 'Lead Temperature', value: 'lead_temperature' },
  { label: 'Lead Source', value: 'lead_source' },
  { label: 'Lead Status', value: 'lead_status' },
  { label: 'Notes', value: 'note_text' },
];

export function FieldMapper({ headers, sampleData, onMapChange, onContinue }: FieldMapperProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [autoMapped, setAutoMapped] = useState(false);

  // Auto-map fields on component mount
  useEffect(() => {
    if (!autoMapped && headers.length > 0) {
      const initialMappings: Record<string, string> = {};

      // Try to auto-map fields using our predefined mappings
      headers.forEach(header => {
        const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_');
        const mappedField = FIELD_MAPPINGS[normalizedHeader];
        
        if (mappedField) {
          initialMappings[header] = mappedField;
        }
      });

      // Check if we have a property_street mapping, otherwise look for best match
      if (!Object.values(initialMappings).includes('property_street')) {
        const addressHeaders = headers.filter(h => 
          h.toLowerCase().includes('address') || 
          h.toLowerCase().includes('street')
        );
        
        if (addressHeaders.length > 0) {
          // Use the first address-like header for property_street
          initialMappings[addressHeaders[0]] = 'property_street';
        }
      }

      setMappings(initialMappings);
      setAutoMapped(true);
      onMapChange(initialMappings);
    }
  }, [headers, autoMapped, onMapChange]);

  const handleMappingChange = (header: string, dbField: string) => {
    const newMappings = { ...mappings, [header]: dbField };
    setMappings(newMappings);
    onMapChange(newMappings);
  };

  const isPropertyStreetMapped = Object.values(mappings).includes('property_street');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Match your CSV columns to our database fields. Property Street is required.
          </p>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
              <div className="col-span-4">CSV Column</div>
              <div className="col-span-4">Database Field</div>
              <div className="col-span-4">Sample Data</div>
            </div>
            
            <div className="divide-y">
              {headers.map((header, index) => (
                <div key={header} className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-4 truncate">{header}</div>
                  <div className="col-span-4">
                    <Select
                      value={mappings[header] || ''}
                      onValueChange={(value) => handleMappingChange(header, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ignore this column</SelectItem>
                        {DATABASE_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 truncate text-sm text-muted-foreground">
                    {sampleData[0]?.[header] || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isPropertyStreetMapped && (
            <div className="text-red-500 text-sm">
              Property Street mapping is required to continue.
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              onClick={onContinue} 
              disabled={!isPropertyStreetMapped}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 