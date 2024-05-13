import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";

export const colors = sqliteTable("colors", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
  savedCount: integer("saved_count").notNull().default(1),
});

export const colorsToUsers = sqliteTable("colorsToUsers", {
  colorId: integer("color_id")
    .notNull()
    .references(() => colors.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  users: many(colorsToUsers),
}));

export const colorsToUserRelations = relations(colorsToUsers, ({ one }) => ({
  user: one(users, {
    fields: [colorsToUsers.userId],
    references: [users.id],
  }),
  color: one(colors, {
    fields: [colorsToUsers.colorId],
    references: [colors.id],
  }),
}));
