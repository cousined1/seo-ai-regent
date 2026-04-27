"use client";

import { useConsent } from "./consent-provider";
import type { ConsentCategory } from "@/lib/consent/consent-types";

export function useConsentGate(category: ConsentCategory): boolean {
  const { consent } = useConsent();
  return consent[category] === true;
}