import { readRecentCacheObservabilityEvents } from "@/lib/observability/cache-log";
import { getRouteCacheMetrics } from "@/lib/observability/cache-metrics";
import { withDebugAccess } from "@/lib/debug/responses";

export async function GET(request: Request) {
  return withDebugAccess(request, async () => ({
    metrics: getRouteCacheMetrics(),
    recentEvents: await readRecentCacheObservabilityEvents(),
  }));
}
