import { cacheRateLimit } from './redis';

/**
 * Dual rate limiter:
 * 1. Distributed rate limiting via Redis (when REDIS_URL is configured).
 * 2. In-memory sliding bucket fallback for zero-config local dev or edge fallback.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/** Synchronous in-memory rate limit check */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

/** Asynchronous Redis-backed rate limit check with in-memory fallback */
export async function checkRateLimitAsync(key: string, limit: number, windowMs: number): Promise<boolean> {
  const windowSeconds = Math.max(1, Math.round(windowMs / 1000));
  try {
    return await cacheRateLimit(`rate:${key}`, limit, windowSeconds);
  } catch {
    return checkRateLimit(key, limit, windowMs);
  }
}

