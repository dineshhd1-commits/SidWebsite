/**
 * Client & Server Cookie Utilities for SID Events
 * Manages lightweight cookies to reduce database load and maintain fast user sessions:
 * - `sid_last_booking`: Last submitted booking summary (accessible on return visits)
 * - `sid_builder_draft`: Current event builder selections (avoids repeated server trips)
 */

export interface LastBookingCookie {
  refCode: string;
  customerName: string;
  customerPhone?: string;
  weddingDate?: string;
  venueCity?: string;
  guestCount?: number;
  submittedAt: string;
  pdfUrl?: string | null;
  whatsappUrl?: string;
  fullMessage?: string;
}

const COOKIE_LAST_BOOKING = 'sid_last_booking';
const COOKIE_BUILDER_DRAFT = 'sid_builder_draft';

// --- Client-side Helpers ---

export function setCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match && match[3] ? decodeURIComponent(match[3]) : null;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}

/** Store the latest booking confirmation in cookie */
export function setLastBookingCookie(booking: LastBookingCookie): void {
  try {
    setCookie(COOKIE_LAST_BOOKING, JSON.stringify(booking), 30);
  } catch (e) {
    console.warn('Failed to set booking cookie:', e);
  }
}

/** Retrieve the latest booking confirmation from cookie */
export function getLastBookingCookie(): LastBookingCookie | null {
  try {
    const raw = getCookie(COOKIE_LAST_BOOKING);
    return raw ? (JSON.parse(raw) as LastBookingCookie) : null;
  } catch {
    return null;
  }
}

/** Persist active builder selections into draft cookie */
export function setBuilderDraftCookie(draft: Record<string, unknown>): void {
  try {
    setCookie(COOKIE_BUILDER_DRAFT, JSON.stringify(draft), 7);
  } catch (e) {
    console.warn('Failed to set builder draft cookie:', e);
  }
}

/** Retrieve active builder draft from cookie */
export function getBuilderDraftCookie(): Record<string, unknown> | null {
  try {
    const raw = getCookie(COOKIE_BUILDER_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
