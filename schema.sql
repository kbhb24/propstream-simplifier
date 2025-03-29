-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_records_updated ON public.records;
DROP TRIGGER IF EXISTS on_records_created ON public.records;
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_created_by();
DROP FUNCTION IF EXISTS public.get_record_stats();
DROP TABLE IF EXISTS public.record_files;
DROP TABLE IF EXISTS public.record_messages;
DROP TABLE IF EXISTS public.record_tasks;
DROP TABLE IF EXISTS public.record_offers;
DROP TABLE IF EXISTS public.record_direct_mail;
DROP TABLE IF EXISTS public.record_attempts;
DROP TABLE IF EXISTS public.record_emails;
DROP TABLE IF EXISTS public.record_phone_numbers;
DROP TABLE IF EXISTS public.records;
DROP TABLE IF EXISTS public.organizations;
DROP TABLE IF EXISTS public.plans;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.upload_limits;
DROP TYPE IF EXISTS property_status;
DROP TYPE IF EXISTS lead_temperature;
DROP TYPE IF EXISTS attempt_type;
DROP TYPE IF EXISTS offer_status;
DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS message_type;
DROP TYPE IF EXISTS direct_mail_status;

-- Create enums for various statuses and types
CREATE TYPE property_status AS ENUM (
  'Unknown',
  'Owner Occupied',
  'Tenant Occupied',
  'Vacant',
  'Under Construction',
  'For Sale',
  'For Rent'
);

CREATE TYPE lead_temperature AS ENUM (
  'Cold',
  'Warm',
  'Hot',
  'Dead'
);

CREATE TYPE attempt_type AS ENUM (
  'calls',
  'directMail',
  'sms',
  'rvm'
);

CREATE TYPE offer_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'expired',
  'withdrawn'
);

CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE message_type AS ENUM (
  'note',
  'sms',
  'email',
  'call',
  'system'
);

CREATE TYPE direct_mail_status AS ENUM (
  'pending',
  'sent',
  'delivered',
  'failed',
  'returned'
);

-- Organizations table for team management
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Plans table for subscription management
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_upload_limit INTEGER NOT NULL DEFAULT 25000,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table to track user subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Upload limits table to track monthly upload limits
CREATE TABLE upload_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  month DATE NOT NULL,
  uploads_used INTEGER DEFAULT 0,
  uploads_limit INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, organization_id, month)
);

-- Records table for property data
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  
  -- Property Information
  property_street TEXT NOT NULL,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  property_county TEXT,
  property_type TEXT,
  current_status property_status DEFAULT 'Unknown',
  
  -- Building Details
  year_built INTEGER,
  square_feet INTEGER,
  lot_size TEXT,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  stories INTEGER,
  units INTEGER,
  heating_type TEXT,
  air_conditioner TEXT,
  
  -- Land Details
  apn TEXT,
  parcel_id TEXT,
  legal_description TEXT,
  land_zoning TEXT,
  
  -- Tax Details
  tax_auction_date DATE,
  total_taxes NUMERIC,
  tax_delinquent_value NUMERIC,
  delinquent_year INTEGER,
  years_behind_taxes INTEGER,
  
  -- Sale Details
  deed TEXT,
  mls_number TEXT,
  last_sale_price NUMERIC,
  last_sale_date DATE,
  estimated_value NUMERIC,
  
  -- Owner Information
  company_name TEXT,
  first_name TEXT,
  last_name TEXT,
  owned_since DATE,
  mailing_address TEXT,
  mailing_city TEXT,
  mailing_state TEXT,
  mailing_zip TEXT,
  
  -- Marketing & Contact
  do_not_mail BOOLEAN DEFAULT false,
  do_not_call BOOLEAN DEFAULT false,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  contact_attempts INTEGER DEFAULT 0,
  
  -- Lead Information
  lead_temperature lead_temperature DEFAULT 'Cold',
  lead_source TEXT,
  lead_status TEXT,
  assignee_id UUID REFERENCES auth.users(id),
  
  -- Lists and Tags
  lists TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Validation constraints
  CONSTRAINT valid_year CHECK (year_built > 1600 OR year_built IS NULL),
  CONSTRAINT valid_numbers CHECK (
    (bedrooms >= 0 OR bedrooms IS NULL) AND
    (bathrooms >= 0 OR bathrooms IS NULL) AND
    (square_feet >= 0 OR square_feet IS NULL) AND
    (estimated_value >= 0 OR estimated_value IS NULL) AND
    (last_sale_price >= 0 OR last_sale_price IS NULL)
  )
);

-- Phone numbers table
CREATE TABLE record_phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  phone_number TEXT NOT NULL,
  phone_type TEXT,
  is_valid BOOLEAN DEFAULT true,
  is_mobile BOOLEAN,
  carrier TEXT,
  dnc_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email addresses table
CREATE TABLE record_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email_address TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_email CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Contact attempts table
CREATE TABLE record_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type attempt_type NOT NULL,
  status TEXT,
  result TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Direct mail campaigns table
CREATE TABLE record_direct_mail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_name TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status direct_mail_status NOT NULL DEFAULT 'pending',
  sent_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Offers table
CREATE TABLE record_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC NOT NULL,
  offer_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status offer_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE record_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  assignee_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority NOT NULL DEFAULT 'medium',
  status task_status NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for internal communication
CREATE TABLE record_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message_type message_type NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES record_messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Files table for property documents and photos
CREATE TABLE record_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  content_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_organization_id ON records(organization_id);
CREATE INDEX idx_records_property_state ON records(property_state);
CREATE INDEX idx_records_lead_temperature ON records(lead_temperature);
CREATE INDEX idx_records_current_status ON records(current_status);
CREATE INDEX idx_records_lists ON records USING gin(lists);
CREATE INDEX idx_records_tags ON records USING gin(tags);
CREATE INDEX idx_records_created_at ON records(created_at);
CREATE INDEX idx_record_phone_numbers_record_id ON record_phone_numbers(record_id);
CREATE INDEX idx_record_emails_record_id ON record_emails(record_id);
CREATE INDEX idx_record_attempts_record_id ON record_attempts(record_id);
CREATE INDEX idx_record_direct_mail_record_id ON record_direct_mail(record_id);
CREATE INDEX idx_record_offers_record_id ON record_offers(record_id);
CREATE INDEX idx_record_tasks_record_id ON record_tasks(record_id);
CREATE INDEX idx_record_tasks_assignee_id ON record_tasks(assignee_id);
CREATE INDEX idx_record_messages_record_id ON record_messages(record_id);
CREATE INDEX idx_record_files_record_id ON record_files(record_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_direct_mail ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their organization's data"
  ON organizations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE organization_id = organizations.id
    )
  );

CREATE POLICY "Plans are readable by all authenticated users"
  ON plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their upload limits"
  ON upload_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their organization's records"
  ON records FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE organization_id = records.organization_id
    )
  );

CREATE POLICY "Users can insert their own records"
  ON records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their organization's records"
  ON records FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE organization_id = records.organization_id
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM subscriptions WHERE organization_id = records.organization_id
    )
  );

CREATE POLICY "Users can delete their own records"
  ON records FOR DELETE
  USING (auth.uid() = user_id);

-- Create similar policies for all related tables
-- ... (policies for phone numbers, emails, attempts, etc.)

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to get record statistics
CREATE OR REPLACE FUNCTION public.get_record_stats(user_id UUID)
RETURNS TABLE (
  total_records BIGINT,
  monthly_uploads INTEGER,
  vacant_properties BIGINT,
  new_vacant_properties BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT r.id)::BIGINT as total_records,
    COALESCE(ul.uploads_used, 0) as monthly_uploads,
    COUNT(DISTINCT CASE WHEN r.current_status = 'Vacant' THEN r.id END)::BIGINT as vacant_properties,
    COUNT(DISTINCT CASE 
      WHEN r.current_status = 'Vacant' 
      AND r.updated_at >= date_trunc('month', CURRENT_DATE)
      THEN r.id 
    END)::BIGINT as new_vacant_properties
  FROM records r
  LEFT JOIN upload_limits ul ON 
    ul.user_id = r.user_id 
    AND ul.month = date_trunc('month', CURRENT_DATE)
  WHERE r.user_id = $1
  GROUP BY ul.uploads_used;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER on_records_updated
  BEFORE UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create similar triggers for all related tables
CREATE TRIGGER on_record_phone_numbers_updated
  BEFORE UPDATE ON record_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ... (similar triggers for other tables)

-- Insert default plans
INSERT INTO plans (name, description, monthly_upload_limit, price, features) VALUES
  ('Basic', 'Basic plan with limited features', 25000, 29.99, '{"max_users": 2, "max_phone_numbers": 30, "max_emails": 10}'::jsonb),
  ('Pro', 'Professional plan with advanced features', 50000, 59.99, '{"max_users": 5, "max_phone_numbers": 50, "max_emails": 20}'::jsonb),
  ('Elite', 'Elite plan with all features', 100000, 99.99, '{"max_users": 10, "max_phone_numbers": 100, "max_emails": 50}'::jsonb)
ON CONFLICT (id) DO NOTHING; 