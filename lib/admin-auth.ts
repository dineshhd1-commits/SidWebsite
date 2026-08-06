export const ADMIN_SESSION_COOKIE = 'sid_admin_session';
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Derives the expected session token from the server-only ADMIN_PASSWORD env var.
 * Never store or transmit the raw password itself in the cookie. */
export async function getExpectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(`sid-admin-session:${password}`);
}

export async function isValidAdminPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Constant-time comparison so response timing can't leak how many leading
  // characters of ADMIN_PASSWORD a guess got right.
  const [candidateHash, passwordHash] = await Promise.all([sha256Hex(candidate), sha256Hex(password)]);
  if (candidateHash.length !== passwordHash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidateHash.length; i++) {
    diff |= candidateHash.charCodeAt(i) ^ passwordHash.charCodeAt(i);
  }
  return diff === 0;
}

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
