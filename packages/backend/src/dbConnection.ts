import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as users from "./db/schemas/users";
import * as colors from "./db/schemas/colors";
import * as palettes from "./db/schemas/palettes";
import * as gradients from "./db/schemas/gradients";
import * as fonticons from "./db/schemas/fonticons";

export const client = createClient({
  // url: c.env.TURSO_DATABASE_URL,
  // authToken: c.env.TURSO_AUTH_TOKEN,
  // encryptionKey: c.env.ENCRYPTION_KEY,
  url: "http://127.0.0.1:8080",
});

export const db = drizzle(client, {
  schema: { ...users, ...colors, ...palettes, ...gradients, ...fonticons },
});
