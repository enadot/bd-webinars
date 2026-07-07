import { getRedis } from "./redis";

const WINDOW_SECONDS = 60;
const MAX_PER_WINDOW = 5;

// In-memory fallback (single process dev / degraded mode).
const buckets = new Map<string, { count: number; resetAt: number }>();

/** @returns true when the request is allowed. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    const now = Date.now();
    const bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt < now) {
      buckets.set(ip, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
      return true;
    }
    bucket.count += 1;
    return bucket.count <= MAX_PER_WINDOW;
  }
  try {
    const key = `bdw:rl:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, WINDOW_SECONDS);
    return count <= MAX_PER_WINDOW;
  } catch {
    return true; // never block registrations on a rate-limiter outage
  }
}
