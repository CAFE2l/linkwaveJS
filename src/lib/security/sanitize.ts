export function sanitizeText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEmail(value: string) {
  return sanitizeText(value).toLowerCase();
}

export function normalizeUsername(value: string) {
  return sanitizeText(value).toLowerCase().replace(/[^a-z0-9_]/g, "");
}
