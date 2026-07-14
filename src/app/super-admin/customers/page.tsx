import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomerActions } from "./customer-actions";

export default async function SuperAdminCustomers() {
  const supabase = await createClient();
  
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-2">
            Manage WACRM instances, licenses, and manual payments.
          </p>
        </div>
        <Link href="/super-admin/customers/new">
          <Button>Add Customer</Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No customers found. Create your first client.
                </TableCell>
              </TableRow>
            )}
            
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.company_name}</TableCell>
                <TableCell>{customer.owner_name}<br/><span className="text-xs text-muted-foreground">{customer.phone}</span></TableCell>
                <TableCell>
                  <Badge variant={
                    customer.status === 'active' ? 'default' : 
                    customer.status === 'suspended' ? 'destructive' : 'secondary'
                  }>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {customer.expiry_date 
                    ? new Date(customer.expiry_date).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell>₹{customer.monthly_fee}</TableCell>
                <TableCell>
                  <Badge variant={customer.payment_status === 'overdue' ? 'destructive' : 'outline'}>
                    {customer.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CustomerActions customer={customer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
