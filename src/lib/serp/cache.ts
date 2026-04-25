interface CachedValue<T> {
  value: T;
  cachedAt: number;
}

const serpCache = new Map<string, CachedValue<unknown>>();

function normalizeKeyword(keyword: string) {
  return keyword.trim().toLowerCase();
}

export function getCachedSerp<T>(keyword: string): CachedValue<T> | null {
  const cached = serpCache.get(normalizeKeyword(keyword));
  return (cached as CachedValue<T> | undefined) ?? null;
}

export function setCachedSerp<T>(keyword: string, value: T) {
  serpCache.set(normalizeKeyword(keyword), {
    value,
    cachedAt: Date.now(),
  });
}

export function clearSerpCache() {
  serpCache.clear();
}
