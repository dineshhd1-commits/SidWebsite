/**
 * Best-effort in-memory rate limiter for Route Handlers. Vercel serverless
 * functions are not guaranteed to share memory across invocations/regions,
 * so this does NOT provide a hard guarantee under distributed load - it's a
 * pragmatic first line of defense (stops naive single-origin brute-force /
 * spam scripts) rather than a substitute for an edge-level WAF or a shared
 * store like Upstash Redis. Documented as a known limitation.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically forget old buckets so this map can't grow unbounded across
// the lifetime of a warm serverless instance.
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

/** Returns true if the request is allowed, false if it should be rejected
 * (429). `key` should combine the route name and client identifier so
 * different endpoints don't share a budget. */
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
