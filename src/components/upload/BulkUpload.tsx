import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadService, UploadProgress, RecordUploadData } from '@/lib/upload-service';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FieldMapper } from './FieldMapper';
import { CsvTemplateDownload } from './CsvTemplateDownload';
import Papa from 'papaparse';

enum UploadStep {
  SELECT_FILE,
  MAP_FIELDS,
  VALIDATION,
  UPLOAD
}

export function BulkUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const uploadService = UploadService.getInstance();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [sampleData, setSampleData] = useState<Record<string, string>[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<UploadStep>(UploadStep.SELECT_FILE);
  const [rawRecords, setRawRecords] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      setFile(file);
      setError(null);
      
      // Parse headers and sample data
      Papa.parse(file, {
        header: true,
        preview: 5, // Get only a few rows for sample data
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // Get headers from the first row
            const headers = results.meta.fields || [];
            setCsvHeaders(headers);
            setSampleData(results.data as Record<string, string>[]);
            setRawRecords(results.data);
            
            // Move to field mapping step if we have headers
            if (headers.length > 0) {
              setCurrentStep(UploadStep.MAP_FIELDS);
            }
          } else {
            setError('Could not parse CSV headers. Please check the file format.');
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: currentStep !== UploadStep.SELECT_FILE,
  });

  const handleFieldMappingsChange = (mappings: Record<string, string>) => {
    setFieldMappings(mappings);
  };

  const handleMappingContinue = () => {
    if (!file || !user) return;
    
    setCurrentStep(UploadStep.VALIDATION);
    validateRecords();
  };

  const validateRecords = async () => {
    if (!rawRecords.length) return;
    
    try {
      setError(null);
      
      // Transform records using the field mappings
      const mappedRecords = rawRecords.map(record => {
        const mappedRecord: Record<string, any> = {};
        
        for (const [csvField, value] of Object.entries(record)) {
          const dbField = fieldMappings[csvField];
          if (dbField) {
            mappedRecord[dbField] = value;
          }
        }
        
        return mappedRecord as RecordUploadData;
      });
      
      // Validate the mapped records
      const validationProgress = await uploadService.validateRecords(mappedRecords);
      setProgress(validationProgress);
      
      if (validationProgress.failed > 0) {
        toast({
          title: 'Validation Errors',
          description: `${validationProgress.failed} records failed validation. Check the errors below.`,
          variant: 'destructive',
        });
      } else {
        setCurrentStep(UploadStep.UPLOAD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during validation');
      toast({
        title: 'Validation Failed',
        description: 'An error occurred while validating the records.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setUploading(true);
      setError(null);
      
      // Transform records using the field mappings
      const mappedRecords = rawRecords.map(record => {
        const mappedRecord: Record<string, any> = {};
        
        for (const [csvField, value] of Object.entries(record)) {
          const dbField = fieldMappings[csvField];
          if (dbField) {
            mappedRecord[dbField] = value;
          }
        }
        
        return mappedRecord as RecordUploadData;
      });
      
      // Upload the mapped records
      const uploadProgress = await uploadService.uploadRecords(mappedRecords);
      setProgress(uploadProgress);

      if (uploadProgress.failed > 0) {
        toast({
          title: 'Upload Errors',
          description: `${uploadProgress.failed} records failed to upload. Check the errors below.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload Successful',
          description: `Successfully uploaded ${uploadProgress.success} records.`,
        });
        // Reset to initial state
        setFile(null);
        setCsvHeaders([]);
        setSampleData([]);
        setRawRecords([]);
        setFieldMappings({});
        setCurrentStep(UploadStep.SELECT_FILE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      toast({
        title: 'Upload Failed',
        description: 'An error occurred while processing the file.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const goBack = () => {
    if (currentStep === UploadStep.MAP_FIELDS) {
      setCurrentStep(UploadStep.SELECT_FILE);
      setFile(null);
    } else if (currentStep === UploadStep.VALIDATION || currentStep === UploadStep.UPLOAD) {
      setCurrentStep(UploadStep.MAP_FIELDS);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Records</CardTitle>
        <CardDescription>
          Upload a CSV file containing property records. You'll be able to map your CSV columns to our database fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {['Select File', 'Map Fields', 'Validate', 'Upload'].map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index === currentStep 
                    ? 'text-primary font-medium' 
                    : index < currentStep 
                      ? 'text-muted-foreground' 
                      : 'text-muted-foreground/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    index === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : index < currentStep 
                        ? 'bg-primary/20' 
                        : 'bg-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-1 rounded-full">
            <div
              className="bg-primary h-1 rounded-full transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === UploadStep.SELECT_FILE && (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4 ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Selected file:</p>
                  <p className="font-medium">{file.name}</p>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setProgress(null);
                    }}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isDragActive
                      ? 'Drop the file here'
                      : 'Drag and drop a CSV file here, or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only CSV files are supported
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <CsvTemplateDownload />
            </div>
          </>
        )}

        {currentStep === UploadStep.MAP_FIELDS && csvHeaders.length > 0 && (
          <>
            <Button 
              variant="outline" 
              onClick={goBack} 
              className="mb-4"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to File Selection
            </Button>
            <FieldMapper 
              headers={csvHeaders} 
              sampleData={sampleData}
              onMapChange={handleFieldMappingsChange}
              onContinue={handleMappingContinue}
            />
          </>
        )}

        {(currentStep === UploadStep.VALIDATION || currentStep === UploadStep.UPLOAD) && progress && (
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={goBack} 
              className="mb-2"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Field Mapping
            </Button>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {currentStep === UploadStep.VALIDATION ? 'Validation Progress' : 'Upload Progress'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {progress.processed} of {progress.total} records processed
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {progress.success}
                  </div>
                  {progress.failed > 0 && (
                    <div className="flex items-center text-sm text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      {progress.failed}
                    </div>
                  )}
                </div>
              </div>
              <Progress value={(progress.processed / progress.total) * 100} />
            </div>

            {progress?.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {currentStep === UploadStep.VALIDATION ? 'Validation Errors' : 'Upload Errors'}
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
                  {progress.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === UploadStep.UPLOAD && (
              <Button
                onClick={handleUpload}
                disabled={uploading || progress.failed > 0}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Records'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 