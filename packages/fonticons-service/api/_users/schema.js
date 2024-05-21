const { fonticons } = require("../_fonticons/schema");

const { sqliteTable, integer, text } = require("drizzle-orm/sqlite-core");
const { relations, sql } = require("drizzle-orm");

const users = sqliteTable("users", {
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

module.exports = { users };
