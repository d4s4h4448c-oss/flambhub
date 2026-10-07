import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const now = sql`(unixepoch() * 1000)`;

export const wheels = sqliteTable("wheels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(now),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(now),
});

export const wheelEntries = sqliteTable(
  "wheel_entries",
  {
    id: text("id").primaryKey(),
    wheelId: text("wheel_id")
      .notNull()
      .references(() => wheels.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    weight: integer("weight").notNull().default(1),
    position: integer("position").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(now),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(now),
  },
  (t) => [index("wheel_entries_wheel_idx").on(t.wheelId)],
);

export const wheelSpins = sqliteTable(
  "wheel_spins",
  {
    id: text("id").primaryKey(),
    wheelId: text("wheel_id")
      .notNull()
      .references(() => wheels.id, { onDelete: "cascade" }),
    entryId: text("entry_id").notNull(),
    resultLabel: text("result_label").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(now),
  },
  (t) => [
    uniqueIndex("wheel_spins_wheel_id_idx").on(t.wheelId, t.id),
    index("wheel_spins_created_idx").on(t.createdAt),
  ],
);

export const bonusHunts = sqliteTable(
  "bonus_hunts",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    currency: text("currency").notNull().default("EUR"),
    startingAmount: real("starting_amount").notNull().default(0),
    ownerCode: text("owner_code"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(now),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(now),
  },
  (t) => [index("bonus_hunts_owner_idx").on(t.ownerCode)],
);

export const huntSlots = sqliteTable(
  "hunt_slots",
  {
    id: text("id").primaryKey(),
    huntId: text("hunt_id")
      .notNull()
      .references(() => bonusHunts.id, { onDelete: "cascade" }),
    slotName: text("slot_name").notNull(),
    provider: text("provider").notNull().default(""),
    stake: real("stake").notNull(),
    player: text("player").notNull().default(""),
    status: text("status", { enum: ["pending", "in_progress", "collected"] })
      .notNull()
      .default("pending"),
    isBounty: integer("is_bounty", { mode: "boolean" }).notNull().default(false),
    winAmount: real("win_amount").notNull().default(0),
    collectedAt: integer("collected_at", { mode: "timestamp_ms" }),
    position: integer("position").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(now),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(now),
  },
  (t) => [
    index("hunt_slots_hunt_idx").on(t.huntId),
    index("hunt_slots_status_idx").on(t.status),
  ],
);

export const wheelsRelations = relations(wheels, ({ many }) => ({
  entries: many(wheelEntries),
  spins: many(wheelSpins),
}));

export const wheelEntriesRelations = relations(wheelEntries, ({ one }) => ({
  wheel: one(wheels, {
    fields: [wheelEntries.wheelId],
    references: [wheels.id],
  }),
}));

export const wheelSpinsRelations = relations(wheelSpins, ({ one }) => ({
  wheel: one(wheels, {
    fields: [wheelSpins.wheelId],
    references: [wheels.id],
  }),
}));

export const bonusHuntsRelations = relations(bonusHunts, ({ many }) => ({
  slots: many(huntSlots),
}));

export const huntSlotsRelations = relations(huntSlots, ({ one }) => ({
  hunt: one(bonusHunts, {
    fields: [huntSlots.huntId],
    references: [bonusHunts.id],
  }),
}));

export type Wheel = typeof wheels.$inferSelect;
export type WheelEntry = typeof wheelEntries.$inferSelect;
export type WheelSpin = typeof wheelSpins.$inferSelect;
export type BonusHunt = typeof bonusHunts.$inferSelect;
export type HuntSlot = typeof huntSlots.$inferSelect;
export type SlotStatus = HuntSlot["status"];
