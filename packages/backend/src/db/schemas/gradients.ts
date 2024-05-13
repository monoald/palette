import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";

export const gradients = sqliteTable("gradients", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull().unique(),
  savedCount: integer("saved_count").notNull().default(1),
});

export const gradientsToUsers = sqliteTable("gradientsToUsers", {
  gradientId: integer("gradient_id")
    .notNull()
    .references(() => gradients.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const gradientsRelations = relations(gradients, ({ many }) => ({
  users: many(gradientsToUsers),
}));

export const gradientsToUserRelations = relations(
  gradientsToUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [gradientsToUsers.userId],
      references: [users.id],
    }),
    gradient: one(gradients, {
      fields: [gradientsToUsers.gradientId],
      references: [gradients.id],
    }),
  })
);
