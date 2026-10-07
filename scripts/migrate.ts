import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runMigrations } from "../src/lib/db/migrate";

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/flambhub.db";

if (url.startsWith("file:")) {
  const filePath = resolve(url.replace(/^file:/, ""));
  mkdirSync(dirname(filePath), { recursive: true });
}

runMigrations()
  .then(() => {
    console.log(`✓ Migrations appliquées (${url})`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("✗ Échec des migrations :", err);
    process.exit(1);
  });
