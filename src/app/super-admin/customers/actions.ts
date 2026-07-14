"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCustomerStatus(customerId: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === "active" ? "suspended" : "active";

  await supabase
    .from("customers")
    .update({ status: newStatus })
    .eq("id", customerId);

  revalidatePath("/super-admin/customers");
}

export async function renewCustomer(customerId: string, currentExpiry: string | null) {
  const supabase = await createClient();
  
  // If no expiry exists, start from today
  const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
  
  // Add 30 days
  baseDate.setDate(baseDate.getDate() + 30);

  await supabase
    .from("customers")
    .update({ 
      expiry_date: baseDate.toISOString(),
      status: "active" // auto-activate if they were suspended
    })
    .eq("id", customerId);

  revalidatePath("/super-admin/customers");
}

export async function markCustomerPaid(customerId: string) {
  const supabase = await createClient();

  await supabase
    .from("customers")
    .update({ payment_status: "paid" })
    .eq("id", customerId);

  revalidatePath("/super-admin/customers");
}
