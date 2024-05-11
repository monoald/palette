import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const fonticons = sqliteTable("fonticons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  thumbnail: text("thumbnail").notNull(),
  userId: integer("user_id").notNull(),
})
