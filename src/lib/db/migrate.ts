import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from "./index";

export async function runMigrations() {
  await migrate(db, { migrationsFolder: "drizzle" });
  return client;
}
