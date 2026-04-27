import { describe, expect, it } from "vitest";
import {
  CONSENT_TO_GCM_MAP,
  getGCMUpdateCommand,
} from "@/lib/consent/gcm";
import type { ConsentCategories } from "@/lib/consent/consent-types";

describe("Google Consent Mode helpers", () => {
  it("maps all-accepted consent to all-granted GCM signal", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("granted");
    expect(command.ad_storage).toBe("granted");
    expect(command.ad_user_data).toBe("granted");
    expect(command.ad_personalization).toBe("granted");
    expect(command.functionality_storage).toBe("granted");
    expect(command.security_storage).toBe("granted");
  });

  it("maps consent-rejected to all-denied except security_storage", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("denied");
    expect(command.ad_storage).toBe("denied");
    expect(command.ad_user_data).toBe("denied");
    expect(command.ad_personalization).toBe("denied");
    expect(command.functionality_storage).toBe("denied");
    expect(command.security_storage).toBe("granted");
  });

  it("maps mixed consent correctly", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: true,
      preferences: false,
      marketing: false,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("granted");
    expect(command.ad_storage).toBe("denied");
    expect(command.functionality_storage).toBe("denied");
    expect(command.security_storage).toBe("granted");
  });
});