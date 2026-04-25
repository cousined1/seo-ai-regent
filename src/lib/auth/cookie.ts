export const AUTH_SESSION_COOKIE = "seo-ai-regent-session";

function shouldMarkSecure() {
  return process.env.NODE_ENV === "production";
}

function secureAttribute() {
  return shouldMarkSecure() ? "; Secure" : "";
}

export function buildSessionCookieValue(
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  return `${AUTH_SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureAttribute()}`;
}

export function buildExpiredSessionCookie() {
  return `${AUTH_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureAttribute()}`;
}

export function readSessionCookie(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  for (const cookie of cookieHeader.split(";")) {
    const [name, ...rest] = cookie.trim().split("=");

    if (name === AUTH_SESSION_COOKIE) {
      return rest.join("=") || null;
    }
  }

  return null;
}
