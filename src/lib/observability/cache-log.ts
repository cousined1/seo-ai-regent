import { appendFile, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

export type CacheEvent = {
  timestamp: string;
  route: string;
  source: string;
  recomputeReason: string | null;
  prevHash?: string | null;
  hash?: string;
  target?: {
    keyword: string;
    scope: string;
  };
  deleted?: {
    keywordSnapshots: number;
    analysisSnapshots: number;
  };
};

let customLogPath: string | null = null;
let cacheDebugRouteOverride: boolean | null = null;
let cacheDebugRouteSecretOverride: string | null = null;
let customRetentionLimit: number | null = null;

const DEFAULT_CACHE_LOG_RETENTION = 200;

export function setCacheObservabilityLogPath(logPath: string) {
  customLogPath = logPath;
}

export function resetCacheObservabilityLogPath() {
  customLogPath = null;
}

export function setCacheDebugRouteOverride(enabled: boolean) {
  cacheDebugRouteOverride = enabled;
}

export function resetCacheDebugRouteOverride() {
  cacheDebugRouteOverride = null;
}

export function setCacheDebugRouteSecretOverride(secret: string) {
  cacheDebugRouteSecretOverride = secret;
}

export function resetCacheDebugRouteSecretOverride() {
  cacheDebugRouteSecretOverride = null;
}

export function isCacheDebugRouteEnabled() {
  if (cacheDebugRouteOverride !== null) {
    return cacheDebugRouteOverride;
  }

  return process.env.CACHE_DEBUG_ROUTE_ENABLED === "true";
}

export function getCacheDebugRouteSecret() {
  return cacheDebugRouteSecretOverride ?? process.env.CACHE_DEBUG_ROUTE_TOKEN?.trim() ?? null;
}

export function setCacheObservabilityLogRetentionOverride(limit: number) {
  customRetentionLimit = limit;
}

export function resetCacheObservabilityLogRetentionOverride() {
  customRetentionLimit = null;
}

export function getCacheObservabilityRetentionLimit() {
  const envLimit = process.env.CACHE_OBSERVABILITY_LOG_MAX_LINES;
  const parsedEnvLimit = envLimit ? Number(envLimit) : Number.NaN;

  if (customRetentionLimit !== null) {
    return customRetentionLimit;
  }

  if (Number.isFinite(parsedEnvLimit) && parsedEnvLimit > 0) {
    return parsedEnvLimit;
  }

  return DEFAULT_CACHE_LOG_RETENTION;
}

export function getCacheObservabilityLogPath() {
  return (
    customLogPath ??
    process.env.CACHE_OBSERVABILITY_LOG_PATH ??
    path.join(process.cwd(), "logs", "cache-observability.jsonl")
  );
}

export async function appendCacheObservabilityEvent(event: CacheEvent) {
  const logPath = getCacheObservabilityLogPath();
  await mkdir(path.dirname(logPath), { recursive: true });
  const previousHash = await readLastCacheEventHash();
  const eventWithHash = {
    ...event,
    prevHash: previousHash,
  };
  const hash = createHash("sha256")
    .update(JSON.stringify(eventWithHash))
    .digest("hex");

  await appendFile(
    logPath,
    `${JSON.stringify({
      ...eventWithHash,
      hash,
    })}\n`,
    "utf8",
  );
}

export async function readRecentCacheObservabilityEvents(limit = 20) {
  const logPath = getCacheObservabilityLogPath();

  try {
    const content = await readFile(logPath, "utf8");
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-limit);

    return lines.map((line) => JSON.parse(line) as CacheEvent);
  } catch {
    return [];
  }
}

async function readLastCacheEventHash() {
  const logPath = getCacheObservabilityLogPath();

  try {
    const content = await readFile(logPath, "utf8");
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return null;
    }

    return (JSON.parse(lines.at(-1) ?? "{}") as CacheEvent).hash ?? null;
  } catch {
    return null;
  }
}
