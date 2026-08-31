export const ADMIN_SESSION_COOKIE = 'sid_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacHex(secret: string, input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isValidAdminPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Constant-time comparison so response timing can't leak how many leading
  // characters of ADMIN_PASSWORD a guess got right.
  const [candidateHash, passwordHash] = await Promise.all([sha256Hex(candidate), sha256Hex(password)]);
  return timingSafeEqual(candidateHash, passwordHash);
}

/** Signs a fresh, expiring session token: base64url(iat.exp).hmacHex(iat.exp).
 * Verifying it (requireAdminSession) only needs ADMIN_JWT_SECRET, not the
 * password - so unlike a deterministic hash of the password, a token can't
 * be precomputed from a leaked/hardcoded password fallback, and rotating
 * ADMIN_JWT_SECRET alone invalidates every outstanding session. */
export async function createAdminSessionToken(): Promise<string | null> {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  const iat = Date.now();
  const exp = iat + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${iat}.${exp}`;
  const signature = await hmacHex(secret, payload);
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signature}`;
}

/** Verifies the admin session cookie on an incoming API request. Every
 * mutating admin API route (catalog writes, gallery/testimonial/package
 * edits, uploads) must call this before touching data - without it, the
 * route's Supabase service-role client would let anyone on the internet
 * write/delete admin data with a plain unauthenticated request, since the
 * admin dashboard's "you must be logged in" check is only ever enforced in
 * the browser (React state), which a direct API call bypasses entirely.
 *
 * Checks the HMAC signature against ADMIN_JWT_SECRET, then that the token
 * hasn't expired - not just the cookie's own maxAge, which only the browser
 * enforces and does nothing for a captured raw cookie value. */
export async function requireAdminSession(request: Request): Promise<boolean> {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false; // ADMIN_JWT_SECRET not configured - fail closed.

  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]) : null;
  if (!token) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return false;
  }
  const expectedSignature = await hmacHex(secret, payload);
  if (!timingSafeEqual(signature, expectedSignature)) return false;

  const [, expStr] = payload.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}
