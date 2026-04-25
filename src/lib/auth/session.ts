import { createHmac, timingSafeEqual } from "node:crypto";

import { getConfigErrorMessage, getServerEnv } from "@/lib/env";

export interface AuthSession {
  userId: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  mfaVerified: boolean;
  sessionVersion: number;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret() {
  const secret = getServerEnv().authSessionSecret;

  if (!secret) {
    throw new Error(getConfigErrorMessage("AUTH_SESSION_SECRET"));
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSignedSession(session: AuthSession) {
  const encodedPayload = toBase64Url(JSON.stringify(session));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function readSignedSession(value: string | null) {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);

  if (
    expectedSignature.length !== signature.length ||
    !timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(encodedPayload)) as AuthSession;
  } catch {
    return null;
  }
}
