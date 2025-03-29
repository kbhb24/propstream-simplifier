-- Drop the offer_status type if it exists
DROP TYPE IF EXISTS offer_status CASCADE;

-- Create the offer_status enum type
CREATE TYPE offer_status AS ENUM (
  'seller_considering',
  'accepted',
  'rejected',
  'under_contract',
  'canceled'
);

-- Drop the record_offers table if it exists to recreate it properly
DROP TABLE IF EXISTS record_offers;

-- Create record_offers table
CREATE TABLE record_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  agreed_amount DECIMAL(12,2),
  status offer_status DEFAULT 'seller_considering',
  notes TEXT,
  offer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE record_offers
ADD CONSTRAINT fk_record_offers_record_id
FOREIGN KEY (record_id)
REFERENCES records(id)
ON DELETE CASCADE;

-- Create trigger to update updated_at on record_offers
CREATE OR REPLACE FUNCTION update_record_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_record_offers_updated_at ON record_offers;
CREATE TRIGGER update_record_offers_updated_at
BEFORE UPDATE ON record_offers
FOR EACH ROW
EXECUTE FUNCTION update_record_offers_updated_at();

-- Enable RLS on record_offers table
ALTER TABLE record_offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for record_offers
DROP POLICY IF EXISTS "Users can view their own record_offers" ON record_offers;
DROP POLICY IF EXISTS "Users can insert their own record_offers" ON record_offers;
DROP POLICY IF EXISTS "Users can update their own record_offers" ON record_offers;
DROP POLICY IF EXISTS "Users can delete their own record_offers" ON record_offers;

-- Create RLS policies
CREATE POLICY "Users can view their own record_offers"
ON record_offers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own record_offers"
ON record_offers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own record_offers"
ON record_offers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own record_offers"
ON record_offers FOR DELETE
USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON record_offers TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_record_offers_record_id ON record_offers(record_id);
CREATE INDEX IF NOT EXISTS idx_record_offers_user_id ON record_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_record_offers_created_at ON record_offers(created_at);

-- Add some test data if needed
DO $$ 
BEGIN
  -- Only insert if the table is empty
  IF NOT EXISTS (SELECT 1 FROM record_offers LIMIT 1) THEN
    INSERT INTO record_offers (
      record_id,
      user_id,
      amount,
      status,
      notes,
      offer_date
    )
    SELECT 
      r.id as record_id,
      r.user_id,
      1000000.00 as amount,
      'seller_considering' as status,
      'Test offer' as notes,
      NOW() as offer_date
    FROM records r
    LIMIT 1;
  END IF;
END $$; 