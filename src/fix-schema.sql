-- Check if the property_status type exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
    -- Create the enum if it doesn't exist
    CREATE TYPE property_status AS ENUM (
      'Unknown',
      'Owner Occupied',
      'Tenant Occupied',
      'Vacant',
      'Under Construction',
      'For Sale',
      'For Rent'
    );
  END IF;
END$$;

-- Check if the lead_temperature type exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_temperature') THEN
    -- Create the enum if it doesn't exist
    CREATE TYPE lead_temperature AS ENUM (
      'Cold',
      'Warm',
      'Hot',
      'Dead'
    );
  END IF;
END$$;

-- Check if current_status column exists in records table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'current_status'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE records ADD COLUMN current_status property_status DEFAULT 'Unknown';
  END IF;
END$$;

-- Ensure the column has the proper type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'current_status' AND data_type != 'USER-DEFINED'
  ) THEN
    -- Alter the column type if it's not the enum
    ALTER TABLE records ALTER COLUMN current_status TYPE property_status USING current_status::text::property_status;
  END IF;
END$$;

-- Check and update lead_temperature column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'lead_temperature' AND data_type != 'USER-DEFINED'
  ) THEN
    -- Alter the column type if it's not the enum
    ALTER TABLE records ALTER COLUMN lead_temperature TYPE lead_temperature USING lead_temperature::text::lead_temperature;
  END IF;
END$$;

-- Check if do_not_contact column exists in records table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'do_not_contact'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE records ADD COLUMN do_not_contact BOOLEAN DEFAULT false;
  END IF;
END$$;

-- Check if contact_attempts column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'contact_attempts'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE records ADD COLUMN contact_attempts INTEGER DEFAULT 0;
  END IF;
END$$;

-- Check if all required columns exist in records table
DO $$
BEGIN
  -- Create the records table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'records') THEN
    CREATE TABLE records (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_id UUID NOT NULL REFERENCES auth.users(id),
      property_street TEXT NOT NULL,
      property_city TEXT,
      property_state TEXT,
      property_zip TEXT,
      current_status property_status DEFAULT 'Unknown',
      lead_temperature lead_temperature DEFAULT 'Cold',
      contact_attempts INTEGER DEFAULT 0,
      do_not_contact BOOLEAN DEFAULT false
    );
  ELSE
    -- Check for other required columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'id') THEN
      ALTER TABLE records ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'created_at') THEN
      ALTER TABLE records ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'user_id') THEN
      ALTER TABLE records ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'property_street') THEN
      ALTER TABLE records ADD COLUMN property_street TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'property_city') THEN
      ALTER TABLE records ADD COLUMN property_city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'property_state') THEN
      ALTER TABLE records ADD COLUMN property_state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'property_zip') THEN
      ALTER TABLE records ADD COLUMN property_zip TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'organization_id') THEN
      ALTER TABLE records ADD COLUMN organization_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'first_name') THEN
      ALTER TABLE records ADD COLUMN first_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'last_name') THEN
      ALTER TABLE records ADD COLUMN last_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'mailing_address') THEN
      ALTER TABLE records ADD COLUMN mailing_address TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'lists') THEN
      ALTER TABLE records ADD COLUMN lists TEXT[];
    END IF;

    -- Handle info JSONB column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'records' AND column_name = 'info') THEN
      ALTER TABLE records ADD COLUMN info JSONB DEFAULT '{"hasEmail": false, "hasPhone": false}'::jsonb;
    END IF;
  END IF;
END$$;

-- Fix row-level security policies
DO $$
BEGIN
  -- Enable RLS on records table
  ALTER TABLE records ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own records" ON records;
  DROP POLICY IF EXISTS "Users can insert their own records" ON records;
  DROP POLICY IF EXISTS "Users can update their own records" ON records;
  DROP POLICY IF EXISTS "Users can delete their own records" ON records;
  
  -- Create appropriate policies
  CREATE POLICY "Users can view their own records" 
    ON records FOR SELECT 
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert their own records" 
    ON records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can update their own records" 
    ON records FOR UPDATE 
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can delete their own records" 
    ON records FOR DELETE 
    USING (auth.uid() = user_id);
END$$;

-- Notify completion
DO $$
BEGIN
  RAISE NOTICE 'Schema update completed successfully.';
END$$;

-- Add missing columns to records table
DO $$
BEGIN
  -- Add last_contact_attempt column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'last_contact_attempt'
  ) THEN
    ALTER TABLE records ADD COLUMN last_contact_attempt TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Ensure contact_attempts column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'records' AND column_name = 'contact_attempts'
  ) THEN
    ALTER TABLE records ADD COLUMN contact_attempts INTEGER DEFAULT 0;
  END IF;
END$$;

-- Make sure record_attempts table has timestamps
DO $$
BEGIN
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'record_attempts' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE record_attempts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'record_attempts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE record_attempts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  END IF;
END$$;

-- Enable RLS on record_attempts table if not already enabled
ALTER TABLE record_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for record_attempts
DROP POLICY IF EXISTS "Users can view their own record_attempts" ON record_attempts;
DROP POLICY IF EXISTS "Users can insert their own record_attempts" ON record_attempts;
DROP POLICY IF EXISTS "Users can update their own record_attempts" ON record_attempts;
DROP POLICY IF EXISTS "Users can delete their own record_attempts" ON record_attempts;

-- Create new comprehensive policies
-- Allow viewing of record attempts
CREATE POLICY "Users can view their own record_attempts"
ON record_attempts FOR SELECT
USING (auth.uid() = user_id);

-- Allow insertion of record attempts
CREATE POLICY "Users can insert their own record_attempts"
ON record_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow updating of record attempts
CREATE POLICY "Users can update their own record_attempts"
ON record_attempts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow deletion of record attempts
CREATE POLICY "Users can delete their own record_attempts"
ON record_attempts FOR DELETE
USING (auth.uid() = user_id);

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON record_attempts TO authenticated;

-- Create or ensure correct indexes for performance
CREATE INDEX IF NOT EXISTS idx_record_attempts_record_id ON record_attempts(record_id);
CREATE INDEX IF NOT EXISTS idx_record_attempts_user_id ON record_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_record_attempts_created_at ON record_attempts(created_at);

-- Create a trigger to automatically update updated_at on record_attempts
CREATE OR REPLACE FUNCTION update_record_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_record_attempts_updated_at ON record_attempts;
CREATE TRIGGER update_record_attempts_updated_at
BEFORE UPDATE ON record_attempts
FOR EACH ROW
EXECUTE FUNCTION update_record_attempts_updated_at();

-- Fix lead_temperature issues - ensure column exists and has correct case conversion
DO $$
BEGIN
  -- Make sure there's a trigger function that handles case conversion
  CREATE OR REPLACE FUNCTION normalize_lead_temperature()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Standardize the format: capitalize first letter, lowercase the rest
    IF NEW.lead_temperature IS NOT NULL THEN
      -- Convert 'hot' or 'HOT' to 'Hot'
      IF LOWER(NEW.lead_temperature::text) = 'hot' THEN
        NEW.lead_temperature = 'Hot';
      -- Convert 'warm' or 'WARM' to 'Warm'
      ELSIF LOWER(NEW.lead_temperature::text) = 'warm' THEN
        NEW.lead_temperature = 'Warm';
      -- Convert 'cold' or 'COLD' to 'Cold'
      ELSIF LOWER(NEW.lead_temperature::text) = 'cold' THEN
        NEW.lead_temperature = 'Cold';
      -- Convert 'dead' or 'DEAD' to 'Dead'
      ELSIF LOWER(NEW.lead_temperature::text) = 'dead' THEN
        NEW.lead_temperature = 'Dead';
      END IF;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create or replace the trigger
  DROP TRIGGER IF EXISTS normalize_lead_temperature_trigger ON records;
  CREATE TRIGGER normalize_lead_temperature_trigger
  BEFORE INSERT OR UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION normalize_lead_temperature();
  
  -- Convert existing lowercase values to proper case
  UPDATE records SET lead_temperature = 'Hot' WHERE LOWER(lead_temperature::text) = 'hot';
  UPDATE records SET lead_temperature = 'Warm' WHERE LOWER(lead_temperature::text) = 'warm';
  UPDATE records SET lead_temperature = 'Cold' WHERE LOWER(lead_temperature::text) = 'cold';
  UPDATE records SET lead_temperature = 'Dead' WHERE LOWER(lead_temperature::text) = 'dead';
END$$;

-- Create a function to safely increment contact attempts
CREATE OR REPLACE FUNCTION increment_contact_attempts(record_id UUID, timestamp TIMESTAMPTZ)
RETURNS void AS $$
BEGIN
  UPDATE records
  SET contact_attempts = COALESCE(contact_attempts, 0) + 1,
      last_contact_attempt = timestamp,
      updated_at = timestamp
  WHERE id = record_id;
END;
$$ LANGUAGE plpgsql;

-- Create attempt_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_type') THEN
    CREATE TYPE attempt_type AS ENUM ('calls', 'directMail', 'sms', 'rvm');
  END IF;
END$$;

-- Drop and recreate offer_status enum with correct values
DROP TYPE IF EXISTS offer_status CASCADE;
CREATE TYPE offer_status AS ENUM (
  'seller_considering',
  'accepted',
  'rejected',
  'under_contract',
  'canceled'
);

-- Update or create record_offers table
CREATE TABLE IF NOT EXISTS record_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(12,2) NOT NULL,
  agreed_amount DECIMAL(12,2),
  status offer_status DEFAULT 'seller_considering',
  notes TEXT,
  offer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- Removed deleted_at column to prevent soft deletes
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_record_offers_record_id ON record_offers(record_id);
CREATE INDEX IF NOT EXISTS idx_record_offers_user_id ON record_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_record_offers_status ON record_offers(status);

-- Add RLS policies
ALTER TABLE record_offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view offers they created or for records they own" ON record_offers;
DROP POLICY IF EXISTS "Users can insert their own offers" ON record_offers;
DROP POLICY IF EXISTS "Users can update offers they created or for records they own" ON record_offers;

-- Recreate policies
CREATE POLICY "Users can view offers they created or for records they own" ON record_offers
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = record_offers.record_id 
      AND records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own offers" ON record_offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update offers they created or for records they own" ON record_offers
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = record_offers.record_id 
      AND records.user_id = auth.uid()
    )
  );

-- Drop soft delete trigger and function since we want to keep offers permanently
DROP TRIGGER IF EXISTS trigger_soft_delete_offer ON record_offers;
DROP FUNCTION IF EXISTS soft_delete_offer();

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_record_offers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_record_offers_timestamp
  BEFORE UPDATE ON record_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_record_offers_timestamp();

-- Create or update phone_numbers table to associate with both owners and properties
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  number VARCHAR(20) NOT NULL,
  type VARCHAR(50), -- mobile, home, work, etc.
  status VARCHAR(50) DEFAULT 'unknown', -- unknown, valid, invalid, do_not_call
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for phone numbers to owners
CREATE TABLE IF NOT EXISTS owner_phone_numbers (
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  phone_number_id UUID REFERENCES phone_numbers(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (owner_id, phone_number_id)
);

-- Create junction table for phone numbers to records (properties)
CREATE TABLE IF NOT EXISTS record_phone_numbers (
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  phone_number_id UUID REFERENCES phone_numbers(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (record_id, phone_number_id)
);

-- Add indexes for phone number relationships
CREATE INDEX IF NOT EXISTS idx_owner_phone_numbers_owner_id ON owner_phone_numbers(owner_id);
CREATE INDEX IF NOT EXISTS idx_owner_phone_numbers_phone_id ON owner_phone_numbers(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_record_phone_numbers_record_id ON record_phone_numbers(record_id);
CREATE INDEX IF NOT EXISTS idx_record_phone_numbers_phone_id ON record_phone_numbers(phone_number_id);

-- Add RLS policies for phone numbers
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_phone_numbers ENABLE ROW LEVEL SECURITY;

-- Users can view phone numbers they have access to
CREATE POLICY "Users can view phone numbers they have access to" ON phone_numbers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM owner_phone_numbers opn
      JOIN owners o ON o.id = opn.owner_id
      WHERE opn.phone_number_id = phone_numbers.id
      AND o.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM record_phone_numbers rpn
      JOIN records r ON r.id = rpn.record_id
      WHERE rpn.phone_number_id = phone_numbers.id
      AND r.user_id = auth.uid()
    )
  );

-- Users can insert phone numbers
CREATE POLICY "Users can insert phone numbers" ON phone_numbers
  FOR INSERT WITH CHECK (true);

-- Users can update phone numbers they have access to
CREATE POLICY "Users can update phone numbers they have access to" ON phone_numbers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM owner_phone_numbers opn
      JOIN owners o ON o.id = opn.owner_id
      WHERE opn.phone_number_id = phone_numbers.id
      AND o.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM record_phone_numbers rpn
      JOIN records r ON r.id = rpn.record_id
      WHERE rpn.phone_number_id = phone_numbers.id
      AND r.user_id = auth.uid()
    )
  );

-- Function to check if user has reached their upload limit
CREATE OR REPLACE FUNCTION check_upload_limit(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_month TEXT;
  v_current_usage INT;
  v_upload_limit INT;
BEGIN
  -- Get current month in YYYY-MM format
  v_current_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  -- Get current usage and limit
  SELECT 
    COALESCE(ul.uploads_used, 0),
    COALESCE(ul.uploads_limit, s.monthly_upload_limit)
  INTO v_current_usage, v_upload_limit
  FROM subscriptions s
  LEFT JOIN upload_limits ul ON 
    ul.user_id = p_user_id 
    AND ul.organization_id = p_organization_id 
    AND ul.month = v_current_month
  WHERE s.user_id = p_user_id
  AND s.organization_id = p_organization_id
  AND s.status = 'active'
  LIMIT 1;
  
  -- Return true if under limit, false if reached limit
  RETURN COALESCE(v_current_usage < v_upload_limit, true);
END;
$$ LANGUAGE plpgsql;

-- Function to increment upload count
CREATE OR REPLACE FUNCTION increment_upload_count(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS void AS $$
DECLARE
  v_current_month TEXT;
  v_limit_record upload_limits%ROWTYPE;
BEGIN
  -- Get current month in YYYY-MM format
  v_current_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  -- Try to get existing record
  SELECT * INTO v_limit_record
  FROM upload_limits
  WHERE user_id = p_user_id
  AND organization_id = p_organization_id
  AND month = v_current_month;
  
  IF v_limit_record.id IS NOT NULL THEN
    -- Update existing record
    UPDATE upload_limits
    SET uploads_used = uploads_used + 1,
        updated_at = NOW()
    WHERE id = v_limit_record.id;
  ELSE
    -- Insert new record
    INSERT INTO upload_limits (
      user_id,
      organization_id,
      month,
      uploads_used,
      uploads_limit
    )
    SELECT 
      p_user_id,
      p_organization_id,
      v_current_month,
      1,
      s.monthly_upload_limit
    FROM subscriptions s
    WHERE s.user_id = p_user_id
    AND s.organization_id = p_organization_id
    AND s.status = 'active'
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to check upload limits before insert
CREATE OR REPLACE FUNCTION check_upload_limit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check for new records, not updates
  IF TG_OP = 'INSERT' THEN
    IF NOT check_upload_limit(NEW.user_id, NEW.organization_id) THEN
      RAISE EXCEPTION 'Monthly upload limit reached';
    END IF;
    
    -- Increment the upload count
    PERFORM increment_upload_count(NEW.user_id, NEW.organization_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on records table
DROP TRIGGER IF EXISTS check_upload_limit_trigger ON records;
CREATE TRIGGER check_upload_limit_trigger
  BEFORE INSERT ON records
  FOR EACH ROW
  EXECUTE FUNCTION check_upload_limit_trigger(); 