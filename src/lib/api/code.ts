import { badRequest } from "./errors";
import { CODE_REGEX } from "@/lib/code";

/**
 * Lit le code de liaison depuis l'en-tête `x-flamb-code`.
 * null = mode communauté (pas de code).
 * Un code présent mais invalide → 400.
 */
export function getOwnerCode(req: Request): string | null {
  const raw = req.headers.get("x-flamb-code");
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (!CODE_REGEX.test(code)) {
    throw badRequest("Code de liaison invalide.");
  }
  return code;
}
