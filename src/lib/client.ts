import { CODE_REGEX, CODE_STORAGE_KEY, formatCode } from "@/lib/code";

export const ADMIN_STORAGE_KEY = "flambhub-admin";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(value: string): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, value);
  } catch {
    /* stockage indisponible */
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    /* stockage indisponible */
  }
}

export function getClientCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CODE_STORAGE_KEY);
    return value && CODE_REGEX.test(value) ? value : null;
  } catch {
    return null;
  }
}

export function setClientCode(code: string): void {
  try {
    localStorage.setItem(CODE_STORAGE_KEY, code);
  } catch {
    /* stockage indisponible */
  }
}

export function clearClientCode(): void {
  try {
    localStorage.removeItem(CODE_STORAGE_KEY);
  } catch {
    /* stockage indisponible */
  }
}

export function newClientCode(): string {
  return formatCode(crypto.randomUUID());
}

/**
 * fetch avec le code de liaison (x-flamb-code) si un code est enregistré
 * dans le navigateur. Utilisé par le site pour voir les mêmes hunts que
 * l'extension.
 */
export async function flambFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const code = getClientCode();
  if (code) headers.set("x-flamb-code", code);
  const admin = getAdminToken();
  if (admin) headers.set("x-admin-token", admin);
  return fetch(input, { ...init, headers });
}
