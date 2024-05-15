const { sqliteTable, integer, text } = require("drizzle-orm/sqlite-core");
const { relations } = require("drizzle-orm");
const { icons } = require("../icons/schema");
const { users } = require("../users/schema");

const fonticons = sqliteTable("fonticons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  thumbnail: text("thumbnail").notNull(),
  userId: integer("user_id").notNull(),
});

module.exports = { fonticons };
