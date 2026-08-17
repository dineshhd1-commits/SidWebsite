/** Letters and spaces only - shared by any free-text name/location field
 * across the site (Event Location, Contact "Your Full Name", etc.) that
 * should reject numbers and special characters. */
const ALPHA_SPACE_PATTERN = /^[a-zA-Z\s]*$/;

/** Strips anything that isn't a letter or a space - used on every keystroke
 * so invalid characters never actually appear in the field. */
export function sanitizeAlphaInput(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, '');
}

/** Defensive check for submit time (autofill, paste via a path that skips
 * onChange, etc.) - the live sanitization above should make this redundant
 * in normal typing, but submission should never trust that alone. */
export function isAlphaSpaceOnly(value: string): boolean {
  return ALPHA_SPACE_PATTERN.test(value);
}
