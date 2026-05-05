import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  CredentialEncryptionError,
  decryptCredentials,
  decryptJsonCredentials,
  encryptCredentials,
  encryptJsonCredentials,
} from "@/lib/security/credentials";

const TEST_KEY = "x".repeat(48);

describe("credential encryption", () => {
  let original: string | undefined;

  beforeEach(() => {
    original = process.env.CREDENTIAL_ENCRYPTION_KEY;
    process.env.CREDENTIAL_ENCRYPTION_KEY = TEST_KEY;
  });

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CREDENTIAL_ENCRYPTION_KEY;
    } else {
      process.env.CREDENTIAL_ENCRYPTION_KEY = original;
    }
  });

  it("round-trips a plaintext payload through AES-256-GCM", () => {
    const ciphertext = encryptCredentials("super-secret-token");

    expect(ciphertext.startsWith("v1:")).toBe(true);
    expect(ciphertext).not.toContain("super-secret-token");
    expect(decryptCredentials(ciphertext)).toBe("super-secret-token");
  });

  it("produces distinct ciphertexts for the same plaintext", () => {
    const a = encryptCredentials("token");
    const b = encryptCredentials("token");

    expect(a).not.toBe(b);
    expect(decryptCredentials(a)).toBe("token");
    expect(decryptCredentials(b)).toBe("token");
  });

  it("round-trips JSON payloads", () => {
    const payload = { accessToken: "a", refreshToken: "b" };
    const encoded = encryptJsonCredentials(payload);

    expect(decryptJsonCredentials(encoded)).toEqual(payload);
  });

  it("rejects tampered ciphertext via the GCM auth tag", () => {
    const ciphertext = encryptCredentials("token");
    const parts = ciphertext.split(":");
    const tampered = [parts[0], parts[1], parts[2], parts[3].slice(0, -2) + "AA"].join(":");

    expect(() => decryptCredentials(tampered)).toThrow();
  });

  it("rejects payloads encrypted with a different key", () => {
    const ciphertext = encryptCredentials("token");

    process.env.CREDENTIAL_ENCRYPTION_KEY = "y".repeat(48);

    expect(() => decryptCredentials(ciphertext)).toThrow();
  });

  it("throws a configuration error when the key is missing", () => {
    delete process.env.CREDENTIAL_ENCRYPTION_KEY;

    expect(() => encryptCredentials("token")).toThrow(CredentialEncryptionError);
  });

  it("throws a configuration error when the key is too short", () => {
    process.env.CREDENTIAL_ENCRYPTION_KEY = "short";

    expect(() => encryptCredentials("token")).toThrow(CredentialEncryptionError);
  });

  it("rejects payloads with an unrecognized format prefix", () => {
    expect(() => decryptCredentials("v9:a:b:c")).toThrow(CredentialEncryptionError);
  });
});
