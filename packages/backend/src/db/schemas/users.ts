import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { colorsToUsers } from "./colors";
import { palettesToUsers } from "./palettes";
import { gradientsToUsers } from "./gradients";
import { fonticons } from "./fonticons";

export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").notNull(),
  provider: text("provider", {
    enum: ["google", "github", "facebook"],
  }).notNull(),
  signinKey: text("signin_key"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  colors: many(colorsToUsers),
  palettes: many(palettesToUsers),
  gradients: many(gradientsToUsers),
  fonticons: many(fonticons),
}));
