import { requireAdminUser } from "@/lib/auth/access";
import { isCacheDebugRouteEnabled } from "@/lib/observability/cache-log";

export async function evaluateDebugAccess(request: Request) {
  if (!isCacheDebugRouteEnabled()) {
    return {
      ok: false as const,
      status: 404 as const,
      reason: "disabled" as const,
      error: "Cache debug route is not enabled.",
    };
  }

  const authenticated = await requireAdminUser(request);

  if (authenticated instanceof Response) {
    const payload = (await authenticated.json()) as { error: string };

    return {
      ok: false as const,
      status: authenticated.status as 401 | 403,
      reason: authenticated.status === 401 ? ("auth-required" as const) : ("admin-required" as const),
      error: payload.error,
    };
  }

  return {
    ok: true as const,
    userId: authenticated.user.id,
    role: authenticated.user.role,
  };
}
