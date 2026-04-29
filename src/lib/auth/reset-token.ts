import { createHmac, randomBytes } from "node:crypto";

import { getServerEnv } from "@/lib/env";

export function createPasswordResetToken() {
  const token = randomBytes(24).toString("hex");
  return {
    token,
    tokenHash: hashPasswordResetToken(token),
  };
}

export function hashPasswordResetToken(token: string) {
  const env = getServerEnv();
  const secret = env.authResetTokenSecret ?? env.authSessionSecret ?? "";
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function verifyPasswordResetTokenHash(token: string, hash: string) {
  const computed = hashPasswordResetToken(token);
  if (computed.length !== hash.length) return false;
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
