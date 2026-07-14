import { ShieldAlert } from "lucide-react";

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-[var(--radius-large)] border border-danger/20 bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Account Suspended
        </h1>
        
        <p className="mb-6 text-muted-foreground">
          Your CRM subscription has expired or has been suspended. Please contact your service provider to reactivate your instance.
        </p>

        <div className="rounded-md bg-muted p-4">
          <p className="text-sm font-medium text-foreground">WhatsApp Support:</p>
          <a href="https://wa.me/91XXXXXXXXXX" className="text-lg font-bold text-primary hover:underline">
            +91 XXXXXXXXXX
          </a>
        </div>
      </div>
    </div>
  );
}
