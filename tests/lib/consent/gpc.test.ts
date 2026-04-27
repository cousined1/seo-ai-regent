import { describe, expect, it, afterEach } from "vitest";
import { detectGPCSignal } from "@/lib/consent/gpc";

describe("detectGPCSignal", () => {
  afterEach(() => {
    delete (navigator as any).globalPrivacyControl;
  });

  it("returns true when navigator.globalPrivacyControl is true", () => {
    (navigator as any).globalPrivacyControl = true;
    expect(detectGPCSignal()).toBe(true);
  });

  it("returns false when navigator.globalPrivacyControl is false", () => {
    (navigator as any).globalPrivacyControl = false;
    expect(detectGPCSignal()).toBe(false);
  });

  it("returns false when navigator.globalPrivacyControl is undefined", () => {
    delete (navigator as any).globalPrivacyControl;
    expect(detectGPCSignal()).toBe(false);
  });

  it("returns true when navigator.globalPrivacyControl is '1' (string form)", () => {
    (navigator as any).globalPrivacyControl = "1";
    expect(detectGPCSignal()).toBe(true);
  });
});