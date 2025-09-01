interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
}

class DataCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize = 50;
  private maxAge = 60000;

  private generateKey(data: any): string {
    if (Array.isArray(data)) {
      return `array_${data.length}_${JSON.stringify(data.slice(0, 2))}`;
    }
    return JSON.stringify(data);
  }

  get(data: any): T | undefined {
    const key = this.generateKey(data);
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    entry.accessCount++;
    return entry.value;
  }

  set(data: any, value: T): void {
    this.cleanup();

    const key = this.generateKey(data);
    const now = Date.now();

    this.cache.set(key, {
      key,
      value,
      timestamp: now,
      accessCount: 1,
    });
  }

  has(data: any): boolean {
    return this.get(data) !== undefined;
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    });

    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries
        .filter(([, entry]) => now - entry.timestamp <= this.maxAge)
        .sort((a, b) => a[1].accessCount - b[1].accessCount);

      const toRemove = sortedEntries.slice(0, Math.floor(this.maxSize * 0.2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const processedDataCache = new DataCache<any>();
export const optionsCache = new DataCache<any>();
