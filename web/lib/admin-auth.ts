export const ADMIN_SESSION_COOKIE = 'sid_admin_session';

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
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

/** Verifies the admin session cookie on an incoming API request. Every
 * mutating admin API route (catalog writes, gallery/testimonial/package
 * edits, uploads) must call this before touching data - without it, the
 * route's Supabase service-role client would let anyone on the internet
 * write/delete admin data with a plain unauthenticated request, since the
 * admin dashboard's "you must be logged in" check is only ever enforced in
 * the browser (React state), which a direct API call bypasses entirely. */
export async function requireAdminSession(request: Request): Promise<boolean> {
  const expected = await getExpectedAdminToken();
  if (!expected) return false; // ADMIN_PASSWORD not configured - fail closed.
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]) : null;
  if (!token || token.length !== expected.length) return false;
  // Constant-time comparison, matching isValidAdminPassword's approach.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
