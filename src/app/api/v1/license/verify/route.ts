import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We use the service role key to bypass RLS for license verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { license_key, domain } = await request.json();

    if (!license_key) {
      return NextResponse.json(
        { valid: false, reason: 'Missing license key' },
        { status: 400 }
      );
    }

    // 1. Find the license
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*, customers(*)')
      .eq('license_key', license_key)
      .single();

    if (licenseError || !license) {
      return NextResponse.json({ valid: false, reason: 'Invalid license key' });
    }

    // 2. Log the check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    await supabase
      .from('licenses')
      .update({
        last_check_ip: clientIp,
        last_check_date: new Date().toISOString(),
      })
      .eq('id', license.id);

    // 3. Validate status
    const customer = license.customers;

    if (license.status !== 'active') {
      return NextResponse.json({ valid: false, reason: 'License suspended' });
    }

    if (customer.status === 'suspended') {
      return NextResponse.json({ valid: false, reason: 'Account suspended' });
    }

    if (customer.expiry_date && new Date(customer.expiry_date) < new Date()) {
      // Auto-update to expired if date passed
      await supabase
        .from('customers')
        .update({ status: 'expired' })
        .eq('id', customer.id);
      
      return NextResponse.json({ valid: false, reason: 'License expired' });
    }

    // License is valid
    return NextResponse.json({
      valid: true,
      status: customer.status,
      expiry_date: customer.expiry_date,
      company: customer.company_name
    });
  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Internal server error' },
      { status: 500 }
    );
  }
}
