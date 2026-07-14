import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCustomer } from "./actions";

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Onboard Client</h1>
          <p className="text-muted-foreground mt-1">
            Register a new self-hosted WACRM instance and generate a license.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>
            This information will be tied to their unique CRM license.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCustomer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input id="company_name" name="company_name" placeholder="e.g. Satva Solutions" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain / IP Address *</Label>
                <Input id="domain" name="domain" placeholder="crm.company.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input id="owner_name" name="owner_name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Phone</Label>
                <Input id="phone" name="phone" placeholder="+91..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_fee">Monthly Fee (₹)</Label>
                <Input id="monthly_fee" name="monthly_fee" type="number" defaultValue={10000} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">Initial Payment Status</Label>
                <select 
                  id="payment_status" 
                  name="payment_status" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="Needs custom chatbot setup, paid via UPI..."
                className="min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Activate CRM License</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
