export const CODE_STORAGE_KEY = "flambhub-code";

export const CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** Formatte un UUID en code court du type XXXX-XXXX-XXXX. */
export function formatCode(uuid: string): string {
  const hex = uuid.replace(/-/g, "").slice(0, 12).toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidCode(code: string): boolean {
  return CODE_REGEX.test(code);
}
