// Admin session cookie: "<expiresAtMs>.<base64url(HMAC-SHA256(secret, expiresAtMs))>".
// Uses Web Crypto only, so the same code runs in Edge middleware and Node routes.

export const SESSION_COOKIE = "bdw_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return secret ? `bdw-session:${secret}` : null;
}

// base64url without Buffer (Edge-safe).
function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return toBase64Url(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${await hmac(secret, String(expiresAt))}`;
}

export async function verifySession(value: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expiresAt = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;
  return timingSafeEqual(await hmac(secret, expiresAt), sig);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Constant-time password check against ADMIN_PASSWORD. */
export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMAC digests so lengths are equal regardless of input length.
  const salt = "bdw-password-check";
  const [a, b] = await Promise.all([hmac(salt, input), hmac(salt, expected)]);
  return timingSafeEqual(a, b);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
