import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const icons = sqliteTable("icons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  svg: text("svg").notNull(),
  unicode: text("unicode").notNull(),
  color: text("color").notNull(),
  fonticonId: integer("fontIcon_id").notNull(),
})
