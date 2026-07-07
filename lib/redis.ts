import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

/** Upstash Redis client, or null when env vars are absent (in-memory mode). */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    client = new Redis({ url, token });
  } else {
    client = null;
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "[bd-webinars] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory storage. " +
          "Config edits and leads will not persist across restarts/deploys."
      );
    }
  }
  return client;
}
