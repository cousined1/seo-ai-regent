import { DEBUG_BACKEND_STATUS_CONTRACT } from "@/lib/debug/backend-status";
import { DEBUG_CACHE_METRICS_CONTRACT } from "@/lib/debug/cache-metrics";
import { DEBUG_SNAPSHOT_INVALIDATION_CONTRACT } from "@/lib/debug/snapshot-invalidation";

export const DEBUG_ROUTE_CONTRACTS = [
  DEBUG_BACKEND_STATUS_CONTRACT,
  DEBUG_CACHE_METRICS_CONTRACT,
  DEBUG_SNAPSHOT_INVALIDATION_CONTRACT,
] as const;

export function getDebugManifest() {
  return {
    namespace: "debug",
    routes: DEBUG_ROUTE_CONTRACTS,
  };
}
