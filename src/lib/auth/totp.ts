import { createHmac, timingSafeEqual } from "node:crypto";

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
