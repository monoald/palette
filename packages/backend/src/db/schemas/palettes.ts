import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";

export const palettes = sqliteTable("palettes", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
  savedCount: integer("saved_count").notNull().default(1),
  length: integer("length").notNull(),
  upId: text("up_id").notNull().unique(),
});

export const palettesToUsers = sqliteTable("palettesToUsers", {
  paletteId: integer("palette_id")
    .notNull()
    .references(() => palettes.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const palettesRelations = relations(palettes, ({ many }) => ({
  users: many(palettesToUsers),
}));

export const palettesToUserRelations = relations(
  palettesToUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [palettesToUsers.userId],
      references: [users.id],
    }),
    palette: one(palettes, {
      fields: [palettesToUsers.paletteId],
      references: [palettes.id],
    }),
  })
);
