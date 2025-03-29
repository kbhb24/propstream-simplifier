-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create an enum for property status
CREATE TYPE property_status AS ENUM (
  'Unknown',
  'Owner Occupied',
  'Tenant Occupied',
  'Vacant',
  'Under Construction',
  'For Sale',
  'For Rent'
);

-- Create an enum for lead temperature
CREATE TYPE lead_temperature AS ENUM (
  'Cold',
  'Warm',
  'Hot',
  'Dead'
);

-- Create the records table
CREATE TABLE IF NOT EXISTS public.records (
  -- Primary key and user reference
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Owner Information
  company_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  mailing_address TEXT,
  mailing_city TEXT,
  mailing_state TEXT,
  mailing_zip TEXT,
  phone_numbers JSONB DEFAULT '[]'::jsonb CHECK (
    jsonb_typeof(phone_numbers) = 'array' AND
    (
      SELECT bool_and(
        jsonb_typeof(value->>'number') = 'string' AND
        jsonb_typeof(value->>'type') = 'string' AND
        jsonb_typeof(value->'tags') = 'array'
      )
      FROM jsonb_array_elements(phone_numbers) value
    )
  ),
  
  -- Property Information
  property_street TEXT NOT NULL,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  property_county TEXT,
  current_status property_status DEFAULT 'Unknown',
  
  -- Property Details
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet INTEGER,
  lot_size TEXT,
  year_built INTEGER,
  property_type TEXT,
  zoning TEXT,
  estimated_value NUMERIC,
  last_sale_date DATE,
  last_sale_price NUMERIC,
  
  -- Lists and Tags
  lists TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Tasks
  tasks JSONB DEFAULT '[]'::jsonb CHECK (
    jsonb_typeof(tasks) = 'array' AND
    (
      SELECT bool_and(
        jsonb_typeof(value->>'id') = 'string' AND
        jsonb_typeof(value->>'title') = 'string' AND
        jsonb_typeof(value->>'status') = 'string' AND
        (jsonb_typeof(value->>'assigned_to') = 'string' OR value->>'assigned_to' IS NULL) AND
        jsonb_typeof(value->>'created_at') = 'string'
      )
      FROM jsonb_array_elements(tasks) value
    )
  ),
  
  -- Marketing
  marketing_status TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  contact_attempts INTEGER DEFAULT 0,
  do_not_contact BOOLEAN DEFAULT false,
  
  -- Lead Information
  lead_temperature lead_temperature DEFAULT 'Cold',
  lead_source TEXT,
  lead_status TEXT,
  assignee_id UUID REFERENCES auth.users(id),
  
  -- Notes
  notes JSONB DEFAULT '[]'::jsonb CHECK (
    jsonb_typeof(notes) = 'array' AND
    (
      SELECT bool_and(
        jsonb_typeof(value->>'text') = 'string' AND
        jsonb_typeof(value->>'created_at') = 'string' AND
        jsonb_typeof(value->>'updated_at') = 'string'
      )
      FROM jsonb_array_elements(notes) value
    )
  ),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_records_user_id ON public.records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_property_state ON public.records(property_state);
CREATE INDEX IF NOT EXISTS idx_records_lead_temperature ON public.records(lead_temperature);
CREATE INDEX IF NOT EXISTS idx_records_current_status ON public.records(current_status);
CREATE INDEX IF NOT EXISTS idx_records_lists ON public.records USING gin(lists);
CREATE INDEX IF NOT EXISTS idx_records_tags ON public.records USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON public.records(created_at);

-- Enable Row Level Security
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own records"
  ON public.records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records"
  ON public.records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records"
  ON public.records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records"
  ON public.records
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at and updated_by
DROP TRIGGER IF EXISTS on_records_updated ON public.records;
CREATE TRIGGER on_records_updated
  BEFORE UPDATE ON public.records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create a trigger to set created_by on insert
CREATE OR REPLACE FUNCTION public.handle_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS on_records_created ON public.records;
CREATE TRIGGER on_records_created
  BEFORE INSERT ON public.records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_created_by(); 