/** Letters and spaces only - shared by any free-text name/location field
 * across the site (Event Location, Contact "Your Full Name", etc.) that
 * should reject numbers and special characters. */
const ALPHA_SPACE_PATTERN = /^[a-zA-Z\s]*$/;

/** Strips anything that isn't a letter or a space - used on every keystroke
 * so invalid characters never actually appear in the field. */
export function sanitizeAlphaInput(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, '');
}

/** Defensive check for submit time. */
export function isAlphaSpaceOnly(value: string): boolean {
  return ALPHA_SPACE_PATTERN.test(value);
}

/** Strict alphanumeric only - A-Z, a-z, 0-9. Rejects spaces, punctuation,
 * emojis, and all special/unicode symbols. */
const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]*$/;

export function sanitizeAlphanumericOnly(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

export function isAlphanumericOnly(value: string): boolean {
  return ALPHANUMERIC_PATTERN.test(value);
}
