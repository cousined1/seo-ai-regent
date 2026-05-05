import { NextResponse, type NextRequest } from "next/server";

const AUTH_SESSION_COOKIE = "seo-ai-regent-session";

const PROTECTED_PREFIXES = ["/app", "/account"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function readCookie(request: NextRequest, name: string): string | null {
  const cookie = request.cookies.get(name);
  return cookie?.value ?? null;
}

async function verifySessionSignature(token: string, secret: string): Promise<boolean> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex <= 0) return false;

  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!payload || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  if (expected.length !== signature.length) return false;

  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(signature);
  if (a.byteLength !== b.byteLength) return false;

  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildConnectSrc(): string[] {
  const sources = ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com"];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      const origin = new URL(siteUrl).origin;
      if (!sources.includes(origin)) {
        sources.push(origin);
      }
    } catch {
      // invalid URL, skip
    }
  }

  return sources;
}

function buildCsp(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const gtmEnabled = Boolean(process.env.NEXT_PUBLIC_GTM_ID?.trim());
  const gtmScriptHosts = gtmEnabled
    ? " https://www.googletagmanager.com https://www.google-analytics.com"
    : "";
  const strictDynamic = gtmEnabled ? " 'strict-dynamic'" : "";
  const scriptSources = `'self' 'nonce-${nonce}'${strictDynamic}${gtmScriptHosts}${isDevelopment ? " 'unsafe-eval'" : ""}`;
  const connectSrc = buildConnectSrc().join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  if (isProtectedRoute(pathname)) {
    const secret = process.env.AUTH_SESSION_SECRET;
    if (!secret) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set("Content-Security-Policy", csp);
      return redirectResponse;
    }

    const token = readCookie(request, AUTH_SESSION_COOKIE);
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set("Content-Security-Policy", csp);
      return redirectResponse;
    }

    const valid = await verifySessionSignature(token, secret);
    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set("Content-Security-Policy", csp);
      return redirectResponse;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
