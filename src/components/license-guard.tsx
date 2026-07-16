"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function LicenseGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Skip license check ONLY for super-admin routes
    if (pathname?.startsWith("/super-admin")) {
      setIsValidating(false);
      return;
    }

    const checkLicense = async () => {
      const licenseKey = process.env.NEXT_PUBLIC_LICENSE_KEY;
      
      // If no license key is configured, we assume this is the central server or running locally
      if (!licenseKey) {
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch("/api/v1/license/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            license_key: licenseKey,
            domain: window.location.hostname,
          }),
        });

        if (!res.ok) {
          throw new Error(`License verification failed with status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.valid) {
          if (pathname !== "/suspended") {
            router.replace("/suspended");
          } else {
            setIsValidating(false);
          }
        } else {
          // If valid and they are on the suspended page, save them!
          if (pathname === "/suspended") {
            router.replace("/dashboard");
          } else {
            setIsValidating(false);
          }
        }
      } catch (error) {
        console.error("Failed to verify license", error);
        // On network failure, we might want to allow access temporarily or cache the last result.
        // For MVP, we let them pass if the network fails to avoid blocking legitimate users.
        setIsValidating(false);
      }
    };

    checkLicense();
    
    // Periodically check every 1 hour
    const interval = setInterval(checkLicense, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pathname, router]);

  if (isValidating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
