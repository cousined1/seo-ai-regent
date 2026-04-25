import { AUTH_SESSION_COOKIE } from "@/lib/auth/cookie";
import { createSignedSession } from "@/lib/auth/session";

export function createSessionCookieHeader(options?: {
  userId?: string;
  email?: string;
  role?: "MEMBER" | "ADMIN";
  mfaVerified?: boolean;
  sessionVersion?: number;
}) {
  process.env.AUTH_SESSION_SECRET = "test-session-secret";
  process.env.AUTH_ADMIN_EMAIL = "admin@seoairegent.com";
  process.env.AUTH_ADMIN_PASSWORD_HASH = "test-hash";

  const token = createSignedSession({
    userId: options?.userId ?? "env-admin",
    email: options?.email ?? "admin@seoairegent.com",
    role: options?.role ?? "ADMIN",
    mfaVerified: options?.mfaVerified ?? true,
    sessionVersion: options?.sessionVersion ?? 1,
  });

  return `${AUTH_SESSION_COOKIE}=${token}`;
}
