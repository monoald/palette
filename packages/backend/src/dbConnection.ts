import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as users from "./db/schemas/users";
import * as colors from "./db/schemas/colors";
import * as palettes from "./db/schemas/palettes";
import * as gradients from "./db/schemas/gradients";
import * as fonticons from "./db/schemas/fonticons";

import { MiddlewareHandler } from "hono";

export const dbConnection = (): MiddlewareHandler => {
  return async (c, next) => {
    const client = createClient({
      url: c.env.TURSO_DATABASE_URL!,
      authToken: c.env.TURSO_AUTH_TOKEN,
    });

    const db = drizzle(client, {
      schema: { ...users, ...colors, ...palettes, ...gradients, ...fonticons },
    });

    c.set("db", db);

    await next();
  };
};
