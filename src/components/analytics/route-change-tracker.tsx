"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics/gtm";

function RouteChangeTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}${path}`;
    if (lastUrlRef.current === fullUrl) return;
    lastUrlRef.current = fullUrl;
    const title = typeof document !== "undefined" ? document.title : undefined;
    trackPageView(fullUrl, title);
  }, [pathname, searchParams]);

  return null;
}

export function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <RouteChangeTrackerInner />
    </Suspense>
  );
}
