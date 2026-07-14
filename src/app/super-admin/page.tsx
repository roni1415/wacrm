import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, ShieldCheck, Banknote } from "lucide-react";

export default async function SuperAdminDashboard() {
  const supabase = await createClient();
  
  // Fetch high level metrics
  const { count: totalClients } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const { count: activeClients } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: suspendedClients } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("status", "suspended");

  const { data: revenueData } = await supabase
    .from("customers")
    .select("monthly_fee")
    .eq("status", "active");

  const monthlyRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.monthly_fee || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SaaS Overview</h1>
        <p className="text-muted-foreground mt-2">
          Manage all instances, licenses, and offline billing here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
            <ShieldCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedClients || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
