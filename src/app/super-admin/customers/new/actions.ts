import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function createCustomer(formData: FormData) {
  "use server";
  
  const supabase = await createClient();
  
  // Extract form fields
  const company_name = formData.get("company_name") as string;
  const owner_name = formData.get("owner_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const domain = formData.get("domain") as string;
  const monthly_fee = Number(formData.get("monthly_fee") || 0);
  const payment_status = formData.get("payment_status") as string || "pending";
  const notes = formData.get("notes") as string;
  
  // Calculate expiry date (+30 days default)
  const expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + 30);
  
  // 1. Create the customer record
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      company_name,
      owner_name,
      email,
      phone,
      domain,
      monthly_fee,
      payment_status,
      notes,
      status: "active",
      expiry_date: expiry_date.toISOString(),
    })
    .select()
    .single();

  if (customerError || !customer) {
    console.error("Failed to create customer:", customerError);
    throw new Error("Failed to create customer");
  }

  // 2. Generate a secure random license key (e.g. WACRM-XXXX-XXXX-XXXX)
  const randomBytes = crypto.randomBytes(6).toString("hex").toUpperCase();
  const license_key = `WACRM-${randomBytes.slice(0, 4)}-${randomBytes.slice(4, 8)}-${randomBytes.slice(8)}`;

  // 3. Create the license record linked to the customer
  const { error: licenseError } = await supabase
    .from("licenses")
    .insert({
      customer_id: customer.id,
      license_key,
      status: "active"
    });

  if (licenseError) {
    console.error("Failed to create license:", licenseError);
    throw new Error("Failed to create license");
  }

  revalidatePath("/super-admin/customers");
  redirect("/super-admin/customers");
}
