"use client";

import React from "react";
import { useConsent } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { CookiePreferencesModal } from "@/components/consent/cookie-preferences-modal";

export function ConsentUI() {
  const {
    showBanner,
    showPreferencesModal,
    consent,
    acceptAll,
    rejectNonEssential,
    openPreferences,
    closePreferences,
    updateConsent,
  } = useConsent();

  return (
    <>
      {showBanner && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectNonEssential={rejectNonEssential}
          onManagePreferences={openPreferences}
        />
      )}
      {showPreferencesModal && (
        <CookiePreferencesModal
          consent={consent}
          onSave={updateConsent}
          onRejectAll={rejectNonEssential}
          onClose={closePreferences}
        />
      )}
    </>
  );
}