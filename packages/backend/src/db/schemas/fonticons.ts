import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const fonticons = sqliteTable("fonticons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  thumbnail: text("thumbnail").notNull(),
  userId: integer("user_id").notNull(),
});

export const fonticonsRelations = relations(fonticons, ({ one }) => ({
  user: one(users, {
    fields: [fonticons.userId],
    references: [users.id],
  }),
}));
