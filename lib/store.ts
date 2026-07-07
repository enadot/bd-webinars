import { getRedis } from "./redis";
import { DEFAULT_CONFIG, mergeConfig, type WebinarConfig } from "./config";
import type { Lead } from "./leads";

const CONFIG_KEY = "bdw:config";
const LEADS_KEY = "bdw:leads";
const COUNT_KEY = "bdw:leads:count";
const EMAILS_KEY = "bdw:leads:emails";

// In-memory fallback for local dev without Redis. Persists per server process.
const memory = {
  config: null as WebinarConfig | null,
  leads: [] as Lead[],
  emails: new Set<string>(),
};

export async function getConfig(): Promise<WebinarConfig> {
  const redis = getRedis();
  if (!redis) return memory.config ?? DEFAULT_CONFIG;
  try {
    const stored = await redis.get(CONFIG_KEY);
    return mergeConfig(stored);
  } catch (err) {
    console.error("[bd-webinars] Failed to read config from Redis:", err);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: WebinarConfig): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memory.config = config;
    return;
  }
  await redis.set(CONFIG_KEY, JSON.stringify(config));
}

/** @returns false when the email was already registered (lead not re-stored). */
export async function saveLead(lead: Lead): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    if (memory.emails.has(lead.email)) return false;
    memory.emails.add(lead.email);
    memory.leads.unshift(lead);
    return true;
  }
  const added = await redis.sadd(EMAILS_KEY, lead.email);
  if (added === 0) return false;
  await redis.lpush(LEADS_KEY, JSON.stringify(lead));
  await redis.incr(COUNT_KEY);
  return true;
}

export async function isDuplicateEmail(email: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return memory.emails.has(email);
  return (await redis.sismember(EMAILS_KEY, email)) === 1;
}

export async function leadCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return memory.leads.length;
  try {
    const count = await redis.get<number>(COUNT_KEY);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function listLeads(): Promise<Lead[]> {
  const redis = getRedis();
  if (!redis) return [...memory.leads];
  const raw = await redis.lrange(LEADS_KEY, 0, -1);
  const leads: Lead[] = [];
  for (const item of raw) {
    try {
      leads.push(typeof item === "string" ? JSON.parse(item) : (item as Lead));
    } catch {
      // skip corrupt entries
    }
  }
  return leads;
}

export function usingRedis(): boolean {
  return getRedis() !== null;
}
