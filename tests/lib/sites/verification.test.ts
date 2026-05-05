import { describe, expect, it } from "vitest";

import { generateVerificationToken, verifyHtmlTag, verifyDnsTxt, getVerificationInstructions } from "@/lib/sites/verification";
import type { VerificationMethod } from "@prisma/client";

describe("generateVerificationToken", () => {
  it("generates a unique token each time", () => {
    const token1 = generateVerificationToken();
    const token2 = generateVerificationToken();
    expect(token1).not.toBe(token2);
  });

  it("generates a token with expected length", () => {
    const token = generateVerificationToken();
    expect(token.length).toBeGreaterThan(20);
  });

  it("generates an alphanumeric token", () => {
    const token = generateVerificationToken();
    expect(token).toMatch(/^[a-zA-Z0-9]+$/);
  });
});

describe("verifyHtmlTag", () => {
  it("returns true when meta tag is present with correct token", async () => {
    const html = `<html><head><meta name="seo-ai-regent-verification" content="abc123token"></head><body></body></html>`;
    const result = await verifyHtmlTag(html, "abc123token");
    expect(result).toBe(true);
  });

  it("returns false when meta tag has wrong token", async () => {
    const html = `<html><head><meta name="seo-ai-regent-verification" content="wrong-token"></head><body></body></html>`;
    const result = await verifyHtmlTag(html, "abc123token");
    expect(result).toBe(false);
  });

  it("returns false when meta tag is missing", async () => {
    const html = `<html><head></head><body></body></html>`;
    const result = await verifyHtmlTag(html, "abc123token");
    expect(result).toBe(false);
  });

  it("returns false when page is empty", async () => {
    const result = await verifyHtmlTag("", "abc123token");
    expect(result).toBe(false);
  });
});

describe("verifyDnsTxt", () => {
  it("returns true when DNS TXT record matches", async () => {
    const records = ["v=spf1 include:_spf.google.com ~all", "seo-ai-regent-verification=abc123token"];
    const result = await verifyDnsTxt(records, "abc123token");
    expect(result).toBe(true);
  });

  it("returns false when DNS TXT record does not match", async () => {
    const records = ["v=spf1 include:_spf.google.com ~all", "seo-ai-regent-verification=wrong-token"];
    const result = await verifyDnsTxt(records, "abc123token");
    expect(result).toBe(false);
  });

  it("returns false when no matching DNS TXT record exists", async () => {
    const records = ["v=spf1 include:_spf.google.com ~all"];
    const result = await verifyDnsTxt(records, "abc123token");
    expect(result).toBe(false);
  });

  it("returns false when records are empty", async () => {
    const result = await verifyDnsTxt([], "abc123token");
    expect(result).toBe(false);
  });
});

describe("getVerificationInstructions", () => {
  it("returns HTML tag instructions", () => {
    const instructions = getVerificationInstructions("HTML_TAG", "abc123token");
    expect(instructions).toContain("meta");
    expect(instructions).toContain("abc123token");
  });

  it("returns DNS TXT instructions", () => {
    const instructions = getVerificationInstructions("DNS_TXT", "abc123token");
    expect(instructions).toContain("TXT");
    expect(instructions).toContain("abc123token");
  });

  it("returns FILE_UPLOAD instructions", () => {
    const instructions = getVerificationInstructions("FILE_UPLOAD", "abc123token");
    expect(instructions).toContain("seo-ai-regent-verification");
    expect(instructions).toContain("abc123token");
  });
});
