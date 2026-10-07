import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/flambhub.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (url.startsWith("file:")) {
  mkdirSync(dirname(resolve(url.replace(/^file:/, ""))), { recursive: true });
}

export const client = createClient({ url, authToken });
export const db = drizzle(client, { schema });
