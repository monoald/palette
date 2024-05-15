const { sqliteTable, integer, text } = require("drizzle-orm/sqlite-core");
const { relations } = require("drizzle-orm");
const { fonticons } = require("../fonticons/schema");

const icons = sqliteTable("icons", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  svg: text("svg").notNull(),
  unicode: text("unicode").notNull(),
  color: text("color").notNull(),
  fonticonId: integer("fontIcon_id").notNull(),
});

// const iconsRelations = relations(icons, ({ one }) => ({
//   fonticon: one(fonticons, {
//     fields: [icons.fonticonId],
//     references: [fonticons.id],
//   }),
// }));

module.exports = { icons };
