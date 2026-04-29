import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { getServerEnv } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getMfaEncryptionKey() {
  const env = getServerEnv();
  const secret = env.authSessionSecret ?? "";
  return Buffer.from(secret.padEnd(KEY_LENGTH, "\0").slice(0, KEY_LENGTH), "utf8");
}

export function encryptMfaSecret(plaintext: string): string {
  const key = getMfaEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptMfaSecret(ciphertext: string): string {
  const key = getMfaEncryptionKey();
  const data = Buffer.from(ciphertext, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function encryptMfaSecretForStorage(plaintext: string): string {
  return encryptMfaSecret(plaintext);
}

export function decryptMfaSecretFromStorage(ciphertext: string): string {
  return decryptMfaSecret(ciphertext);
}

function normalizeBase32(value: string) {
  return value.toUpperCase().replace(/=+$/g, "");
}

function base32ToBuffer(value: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";

  for (const character of normalizeBase32(value)) {
    const index = alphabet.indexOf(character);

    if (index === -1) {
      throw new Error("Invalid TOTP secret.");
    }

    bits += index.toString(2).padStart(5, "0");
  }

  const bytes = bits.match(/.{1,8}/g) ?? [];

  return Buffer.from(
    bytes
      .filter((chunk) => chunk.length === 8)
      .map((chunk) => Number.parseInt(chunk, 2)),
  );
}

function generateHotp(secret: string, counter: number) {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  counterBuffer.writeUInt32BE(counter >>> 0, 4);

  const digest = createHmac("sha1", base32ToBuffer(secret)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}

function constantTimeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

export function verifyTotpToken(secret: string, token: string, now = Date.now()) {
  const normalizedToken = token.trim();

  if (!/^[0-9]{6}$/.test(normalizedToken)) {
    return false;
  }

  const counter = Math.floor(now / 30_000);
  let matched = false;

  for (let offset = -1; offset <= 1; offset += 1) {
    if (constantTimeEqual(generateHotp(secret, counter + offset), normalizedToken)) {
      matched = true;
    }
  }

  return matched;
}
