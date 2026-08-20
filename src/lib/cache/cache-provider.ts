interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CentralCacheProvider {
  private static store = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, value: T, ttlMs = 60000): void {
    CentralCacheProvider.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  static get<T>(key: string): T | null {
    const entry = CentralCacheProvider.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      CentralCacheProvider.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  static invalidate(pattern: string): void {
    for (const key of CentralCacheProvider.store.keys()) {
      if (key.includes(pattern)) {
        CentralCacheProvider.store.delete(key);
      }
    }
  }
}
