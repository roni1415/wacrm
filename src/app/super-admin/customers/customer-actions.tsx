"use client";

import { useTransition } from "react";
import { MoreHorizontal, Power, PowerOff, CalendarPlus, Banknote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleCustomerStatus, renewCustomer, markCustomerPaid } from "./actions";

type Customer = {
  id: string;
  status: string;
  expiry_date: string | null;
  payment_status: string;
};

export function CustomerActions({ customer }: { customer: Customer }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(() => {
      toggleCustomerStatus(customer.id, customer.status);
    });
  };

  const handleRenew = () => {
    startTransition(() => {
      renewCustomer(customer.id, customer.expiry_date);
    });
  };

  const handleMarkPaid = () => {
    startTransition(() => {
      markCustomerPaid(customer.id);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="inline-flex h-8 w-8 p-0 items-center justify-center rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        disabled={isPending}
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleRenew} className="flex gap-2 items-center cursor-pointer">
            <CalendarPlus className="w-4 h-4" />
            Renew (+30 Days)
          </DropdownMenuItem>
          
          {customer.payment_status !== "paid" && (
            <DropdownMenuItem onClick={handleMarkPaid} className="flex gap-2 items-center cursor-pointer text-success">
              <Banknote className="w-4 h-4" />
              Mark as Paid
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          
          {customer.status === "active" ? (
            <DropdownMenuItem onClick={handleToggleStatus} className="text-danger flex gap-2 items-center cursor-pointer">
              <PowerOff className="w-4 h-4" />
              Suspend CRM
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleToggleStatus} className="text-success flex gap-2 items-center cursor-pointer">
              <Power className="w-4 h-4" />
              Activate CRM
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
