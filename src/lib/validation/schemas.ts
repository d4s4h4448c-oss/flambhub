import { z } from "zod";
import { CURRENCY_CODES } from "@/lib/data/currencies";

const entrySchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Le libellé ne peut pas être vide.")
    .max(100, "Le libellé est trop long (100 caractères max)."),
  weight: z.coerce
    .number()
    .int("Le poids doit être un nombre entier.")
    .min(1, "Le poids minimum est 1.")
    .max(1000, "Le poids maximum est 1000."),
});

export const createWheelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de la roue ne peut pas être vide.")
    .max(80, "Le nom est trop long (80 caractères max)."),
  entries: z
    .array(entrySchema)
    .min(1, "Ajoute au moins une entrée.")
    .max(50, "50 entrées maximum par roue."),
});

export const updateWheelSchema = createWheelSchema;

export const spinSchema = z.object({
  id: z
    .string()
    .min(8, "Identifiant de tirage invalide.")
    .max(64, "Identifiant de tirage invalide.")
    .regex(/^[A-Za-z0-9-]+$/, "Identifiant de tirage invalide."),
});

export const createHuntSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de la session ne peut pas être vide.")
    .max(120, "Le nom est trop long (120 caractères max)."),
  currency: z.enum(CURRENCY_CODES).default("EUR"),
  startingAmount: z.coerce
    .number()
    .nonnegative("Le montant de départ ne peut pas être négatif.")
    .max(1_000_000_000, "Montant de départ trop élevé.")
    .default(0),
});

export const updateHuntSchema = createHuntSchema;

export const SLOT_STATUSES = ["pending", "in_progress", "collected"] as const;
export type SlotStatus = (typeof SLOT_STATUSES)[number];

export const slotSchema = z.object({
  slotName: z
    .string()
    .trim()
    .min(1, "Le nom de la slot est requis.")
    .max(120, "Nom de slot trop long (120 caractères max)."),
  provider: z
    .string()
    .trim()
    .max(120, "Nom du provider trop long (120 caractères max).")
    .default(""),
  stake: z.coerce
    .number()
    .positive("La mise doit être supérieure à 0.")
    .max(1_000_000_000, "Mise trop élevée."),
  player: z
    .string()
    .trim()
    .max(80, "Nom de l'utilisateur trop long (80 caractères max).")
    .default(""),
  status: z.enum(SLOT_STATUSES).default("pending"),
  isBounty: z.coerce.boolean().default(false),
  winAmount: z.coerce
    .number()
    .nonnegative("Le gain ne peut pas être négatif.")
    .max(1_000_000_000, "Gain trop élevé.")
    .default(0),
});

export type SlotInput = z.infer<typeof slotSchema>;

export type CreateWheelInput = z.infer<typeof createWheelSchema>;
export type EntryInput = z.infer<typeof entrySchema>;
export type CreateHuntInput = z.infer<typeof createHuntSchema>;
