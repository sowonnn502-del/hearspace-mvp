type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24;
const cache = new Map<string, CacheEntry<unknown>>();

export function getMusicCache<T>(key: string): T | undefined {
  const entry = cache.get(key);

  if (!entry) return undefined;

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return undefined;
  }

  return entry.value as T;
}

export function setMusicCache<T>(
  key: string,
  value: T,
  ttlMs = DEFAULT_TTL_MS,
) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}
