"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { trackSubscriptionPurchased } from "@/lib/analytics/gtm";

function CheckoutSuccessTrackerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (searchParams?.get("checkout") !== "success") return;

    firedRef.current = true;
    trackSubscriptionPurchased();

    const next = new URLSearchParams(searchParams.toString());
    next.delete("checkout");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname ?? "";
    router.replace(url, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}

export function CheckoutSuccessTracker() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessTrackerInner />
    </Suspense>
  );
}
