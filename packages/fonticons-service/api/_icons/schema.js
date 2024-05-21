const { sqliteTable, integer, text } = require("drizzle-orm/sqlite-core");

const icons = sqliteTable("icons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  svg: text("svg").notNull(),
  unicode: text("unicode").notNull(),
  color: text("color").notNull(),
  fonticonId: integer("fontIcon_id").notNull(),
});

module.exports = { icons };
