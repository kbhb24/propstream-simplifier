-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT NOT NULL,
  monthly_upload_limit INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Create upload_limits table
CREATE TABLE IF NOT EXISTS upload_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: YYYY-MM
  uploads_limit INTEGER NOT NULL,
  uploads_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, organization_id, month)
);

-- Add stripe_customer_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create function to check upload limits
CREATE OR REPLACE FUNCTION check_upload_limit(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_month TEXT;
  v_upload_limit RECORD;
  v_subscription RECORD;
BEGIN
  v_current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  -- Get current subscription
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE user_id = p_user_id
    AND organization_id = p_organization_id
    AND status = 'active'
    AND current_period_end > NOW();

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Get or create upload limit for current month
  SELECT * INTO v_upload_limit
  FROM upload_limits
  WHERE user_id = p_user_id
    AND organization_id = p_organization_id
    AND month = v_current_month;

  IF NOT FOUND THEN
    -- Create new upload limit record
    INSERT INTO upload_limits (
      user_id,
      organization_id,
      month,
      uploads_limit
    )
    SELECT
      p_user_id,
      p_organization_id,
      v_current_month,
      p.monthly_upload_limit
    FROM plans p
    WHERE p.id = v_subscription.plan_id
    RETURNING * INTO v_upload_limit;
  END IF;

  -- Check if user has exceeded limit
  RETURN v_upload_limit.uploads_used < v_upload_limit.uploads_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment upload count
CREATE OR REPLACE FUNCTION increment_upload_count(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_month TEXT;
  v_upload_limit RECORD;
BEGIN
  v_current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  -- Get current upload limit
  SELECT * INTO v_upload_limit
  FROM upload_limits
  WHERE user_id = p_user_id
    AND organization_id = p_organization_id
    AND month = v_current_month;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Increment upload count
  UPDATE upload_limits
  SET uploads_used = uploads_used + 1,
      updated_at = NOW()
  WHERE id = v_upload_limit.id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_limits ENABLE ROW LEVEL SECURITY;

-- Plans policies
CREATE POLICY "Plans are viewable by everyone" ON plans
  FOR SELECT USING (true);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Upload limits policies
CREATE POLICY "Users can view their own upload limits" ON upload_limits
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_upload_limits_user_id ON upload_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_upload_limits_organization_id ON upload_limits(organization_id);
CREATE INDEX IF NOT EXISTS idx_upload_limits_month ON upload_limits(month);

-- Insert default plans
INSERT INTO plans (name, description, price, stripe_price_id, monthly_upload_limit, features)
VALUES
  (
    'Basic',
    'Perfect for small teams',
    49.99,
    'price_basic_monthly',
    100,
    '["Up to 100 monthly uploads", "Basic support", "Email notifications"]'::jsonb
  ),
  (
    'Professional',
    'For growing businesses',
    99.99,
    'price_professional_monthly',
    500,
    '["Up to 500 monthly uploads", "Priority support", "Email notifications", "API access"]'::jsonb
  ),
  (
    'Enterprise',
    'For large organizations',
    299.99,
    'price_enterprise_monthly',
    2000,
    '["Unlimited monthly uploads", "24/7 support", "Email notifications", "API access", "Custom integrations"]'::jsonb
  )
ON CONFLICT (name) DO NOTHING; 