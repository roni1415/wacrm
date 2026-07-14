-- ============================================================
-- SAAS LICENSE MANAGEMENT
-- Super Admin tables for managing customers, licenses, and payments
-- ============================================================

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  domain TEXT,
  status TEXT DEFAULT 'active', -- active, suspended, trial, expired
  expiry_date TIMESTAMPTZ,
  monthly_fee NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'paid', -- paid, pending, overdue
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admins can manage customers" ON customers;
CREATE POLICY "Super admins can manage customers" 
  ON customers 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- LICENSES
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- active, suspended
  last_check_ip TEXT,
  last_check_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admins can manage licenses" ON licenses;
CREATE POLICY "Super admins can manage licenses" 
  ON licenses 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  method TEXT, -- upi, bank_transfer, cash
  remark TEXT,
  next_due TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admins can manage payments" ON payments;
CREATE POLICY "Super admins can manage payments" 
  ON payments 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Function to check if a user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (role = 'super_admin') INTO is_admin 
  FROM profiles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
