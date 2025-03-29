import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function CsvTemplateDownload() {
  const handleDownloadTemplate = () => {
    // Define CSV headers
    const headers = [
      'property_street',
      'property_city', 
      'property_state', 
      'property_zip',
      'current_status',
      'year_built',
      'square_feet',
      'lot_size',
      'bedrooms',
      'bathrooms',
      'company_name',
      'first_name',
      'last_name',
      'email',
      'mailing_address',
      'mailing_city',
      'mailing_state',
      'mailing_zip',
      'estimated_value',
      'last_sale_date',
      'last_sale_price',
      'lead_temperature',
      'notes'
    ].join(',');

    // Create sample data (empty row with the correct structure)
    const sampleRow = [
      '123 Main St',
      'Anytown',
      'CA',
      '90210',
      'Unknown',
      '2005',
      '2000',
      '0.25 acres',
      '3',
      '2.5',
      'ABC Properties LLC',
      'John',
      'Doe',
      'john.doe@example.com',
      '456 Business Ave',
      'Anytown',
      'CA',
      '90210',
      '500000',
      '2020-01-15',
      '450000',
      'Cold',
      'Sample property notes'
    ].join(',');

    // Create CSV content
    const content = `${headers}\n${sampleRow}`;
    
    // Create Blob and download link
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'property_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDownloadTemplate}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download CSV Template
    </Button>
  );
} 