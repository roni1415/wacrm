"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
  dashboard: "dashboard",
  inbox: "inbox",
  notifications: "notifications",
  contacts: "contacts",
  pipelines: "pipelines",
  broadcasts: "broadcasts",
  automations: "automations",
  settings: "settings",
  flows: "flows",
  agents: "aiAgents",
};

export function ShellBreadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 0) return null;
  
  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          
          const translationKey = pageTitles[segment];
          // Use translation if available, otherwise fallback to capitalized segment
          const title = translationKey 
            ? t(translationKey as any) 
            : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
          
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <Link href={href} className="transition-colors hover:text-foreground">
                    {title}
                  </Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
