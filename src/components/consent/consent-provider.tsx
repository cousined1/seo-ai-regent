"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ConsentCategories } from "@/lib/consent/consent-types";
import { DEFAULT_CONSENT, ACCEPT_ALL_CONSENT, REJECT_NON_ESSENTIAL_CONSENT } from "@/lib/consent/consent-types";
import { readConsentFromDocument, writeConsentToDocument } from "@/lib/consent/consent-cookie";
import { detectGPCSignal } from "@/lib/consent/gpc";
import { pushGCMUpdate } from "@/lib/consent/gcm";

interface ConsentContextValue {
  consent: ConsentCategories;
  showBanner: boolean;
  showPreferencesModal: boolean;
  updateConsent: (categories: ConsentCategories) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const existing = readConsentFromDocument();
    if (existing) {
      setConsent(existing.c);
      setShowBanner(false);
      pushGCMUpdate(existing.c);
    } else if (detectGPCSignal()) {
      setConsent(REJECT_NON_ESSENTIAL_CONSENT);
      writeConsentToDocument(REJECT_NON_ESSENTIAL_CONSENT);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setInitialized(true);
  }, []);

  const updateConsent = useCallback((categories: ConsentCategories) => {
    const updated: ConsentCategories = {
      ...categories,
      necessary: true,
    };
    setConsent(updated);
    writeConsentToDocument(updated);
    pushGCMUpdate(updated);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent(ACCEPT_ALL_CONSENT);
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent(REJECT_NON_ESSENTIAL_CONSENT);
  }, [updateConsent]);

  const openPreferences = useCallback(() => {
    setShowPreferencesModal(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferencesModal(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        showBanner,
        showPreferencesModal,
        updateConsent,
        acceptAll,
        rejectNonEssential,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}