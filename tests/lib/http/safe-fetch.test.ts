import { describe, expect, it } from "vitest";

import {
  UnsafeUrlError,
  assertSafeUrl,
  isPrivateAddress,
  safeFetch,
} from "@/lib/http/safe-fetch";

describe("isPrivateAddress", () => {
  it.each([
    "127.0.0.1",
    "10.0.0.1",
    "172.16.5.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "0.0.0.0",
    "100.64.0.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])("flags %s as private", (addr) => {
    expect(isPrivateAddress(addr)).toBe(true);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])(
    "treats %s as public",
    (addr) => {
      expect(isPrivateAddress(addr)).toBe(false);
    },
  );
});

describe("assertSafeUrl", () => {
  it("accepts public https URLs", () => {
    const url = assertSafeUrl("https://example.com/path");
    expect(url.hostname).toBe("example.com");
  });

  it("rejects non-http(s) protocols", () => {
    expect(() => assertSafeUrl("file:///etc/passwd")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("ftp://example.com")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("gopher://example.com")).toThrow(UnsafeUrlError);
  });

  it("rejects literal private IPs", () => {
    expect(() => assertSafeUrl("http://127.0.0.1/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://169.254.169.254/latest/meta-data/")).toThrow(
      UnsafeUrlError,
    );
    expect(() => assertSafeUrl("http://[::1]/")).toThrow(UnsafeUrlError);
  });

  it("rejects localhost-style hostnames", () => {
    expect(() => assertSafeUrl("http://localhost/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://service.internal/")).toThrow(UnsafeUrlError);
  });

  it("rejects malformed URLs", () => {
    expect(() => assertSafeUrl("not a url")).toThrow(UnsafeUrlError);
  });
});

describe("safeFetch", () => {
  it("rejects unsafe URLs before issuing any network request", async () => {
    await expect(safeFetch("http://127.0.0.1/")).rejects.toThrow(UnsafeUrlError);
    await expect(safeFetch("file:///etc/passwd")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects DNS names that resolve to private addresses", async () => {
    // RFC 6761 reserves these for documentation/testing; they must not resolve
    // to anything routable in production environments.
    await expect(safeFetch("http://localhost.localhost/")).rejects.toThrow(
      UnsafeUrlError,
    );
  });
});
