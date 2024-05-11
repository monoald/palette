import { createClient } from "@libsql/client";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";

const client = createClient({
  // url: c.env.TURSO_DATABASE_URL,
  // authToken: c.env.TURSO_AUTH_TOKEN,
  // encryptionKey: c.env.ENCRYPTION_KEY,
  url: "http://127.0.0.1:8080",
});

export const db = drizzle(client);
