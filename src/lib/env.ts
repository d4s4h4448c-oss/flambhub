export const env = {
  tursoUrl: process.env.TURSO_DATABASE_URL ?? "file:./data/flambhub.db",
  tursoToken: process.env.TURSO_AUTH_TOKEN ?? undefined,
  adminToken: process.env.ADMIN_API_TOKEN ?? undefined,
};
