import { ReactNode } from "react";
import { ShieldAlert, Users, CreditCard, Key } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify super admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    // Redirect non-admins back to their dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Super Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 text-primary">
          <ShieldAlert className="h-5 w-5" />
          <span className="font-semibold">Super Admin HQ</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/super-admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
            <ShieldAlert className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/super-admin/customers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link href="/super-admin/licenses" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <Key className="h-4 w-4" />
            Licenses
          </Link>
          <Link href="/super-admin/payments" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Payments
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
