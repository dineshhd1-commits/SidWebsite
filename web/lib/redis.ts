import type Redis from 'ioredis';

/**
 * Shared Redis caching client with automatic in-memory fallback.
 * If REDIS_URL or REDIS_HOST is configured, connects to Redis.
 * If not configured or if connection drops, operations gracefully fall back
 * to an internal TTL-aware memory store without throwing or breaking the app.
 */

interface MemoryEntry {
  val: string;
  exp: number; // Unix timestamp in ms
}

class MemoryStore {
  private map = new Map<string, MemoryEntry>();

  get(key: string): string | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (entry.exp > 0 && entry.exp < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return entry.val;
  }

  set(key: string, val: string, ttlSeconds?: number): void {
    const exp = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
    this.map.set(key, { val, exp });
  }

  del(key: string | string[]): void {
    const keys = Array.isArray(key) ? key : [key];
    for (const k of keys) {
      this.map.delete(k);
    }
  }

  incr(key: string, ttlSeconds: number): number {
    const current = this.get(key);
    const count = current ? parseInt(current, 10) + 1 : 1;
    this.set(key, count.toString(), ttlSeconds);
    return count;
  }
}

const memoryStore = new MemoryStore();
let redisClient: any = null;
let redisAvailable = false;
let RedisCtor: any = null;

function getRedisCtor(): any {
  if (typeof window !== 'undefined') return null;
  if (!RedisCtor) {
    try {
      // Use eval require so bundlers (Webpack/Turbopack) don't bundle ioredis into client bundles
      const req = eval('require');
      RedisCtor = req('ioredis');
    } catch {
      RedisCtor = null;
    }
  }
  return RedisCtor;
}

function getRedisClient(): Redis | null {
  if (typeof window !== 'undefined') return null; // Server-only
  if (redisClient) return redisAvailable ? redisClient : null;

  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  if (!redisUrl && !process.env.REDIS_HOST) {
    return null;
  }

  const RedisClass = getRedisCtor();
  if (!RedisClass) return null;

  try {
    if (redisUrl && redisUrl.startsWith('redis')) {
      redisClient = new RedisClass(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
        retryStrategy(times: number) {
          if (times > 3) return null;
          return Math.min(times * 100, 1000);
        },
      });
    } else if (process.env.REDIS_HOST) {
      redisClient = new RedisClass({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
      });
    }

    if (redisClient) {
      redisClient.on('connect', () => {
        redisAvailable = true;
      });
      redisClient.on('error', () => {
        redisAvailable = false;
      });
      redisClient.connect().catch(() => {
        redisAvailable = false;
      });
    }
  } catch {
    redisAvailable = false;
    redisClient = null;
  }

  return redisAvailable ? redisClient : null;
}

/** Get a cached JSON-deserialized object by key */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (client) {
      const raw = await client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }
  } catch (err) {
    // Redis failed, fall back to memory
  }

  const mem = memoryStore.get(key);
  return mem ? (JSON.parse(mem) as T) : null;
}

/** Store a JSON-serializable value in cache with optional TTL in seconds */
export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const serialized = JSON.stringify(value);
  try {
    const client = getRedisClient();
    if (client) {
      if (ttlSeconds > 0) {
        await client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await client.set(key, serialized);
      }
      return;
    }
  } catch (err) {
    // Fall back to memory
  }

  memoryStore.set(key, serialized, ttlSeconds);
}

/** Invalidate one or more keys from cache */
export async function cacheDel(key: string | string[]): Promise<void> {
  try {
    const client = getRedisClient();
    if (client) {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length > 0) {
        await client.del(...keys);
      }
      return;
    }
  } catch (err) {
    // Fall back to memory
  }

  memoryStore.del(key);
}

/**
 * Distributed rate limiter using Redis INCR + EXPIRE with in-memory fallback.
 * Returns true if request is within limit, false if exceeded.
 */
export async function cacheRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (client) {
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, windowSeconds);
      }
      return count <= limit;
    }
  } catch (err) {
    // Fall back to memory
  }

  const count = memoryStore.incr(key, windowSeconds);
  return count <= limit;
}
