const { db } = require("../dbConnection");
const { icons } = require("./schema");
const { sql } = require("drizzle-orm");
const { normalizeSvg } = require("../svgToFont/toSvgFont");

class IconService {
  constructor() {}

  async createByFonticon(data, fonticonId) {
    const newIcons = [];
    for (const i in data) {
      newIcons.push({
        fonticonId,
        ...(await normalizeSvg(data[i], data[i].color)),
      });
    }

    await db.insert(icons).values(newIcons);
  }

  async deleteByFonticon(fonticonId) {
    await db.delete(icons).where(sql`${icons.fonticonId} = ${fonticonId}`);

    return fonticonId;
  }

  async find() {
    const result = await db
      .select({
        id: icons.id,
        name: icons.name,
        color: icons.color,
        unicode: icons.unicode,
        svg: icons.svg,
      })
      .from(icons);

    return result;
  }

  async findByFonticon(fonticonId) {
    const result = await db
      .select({
        id: icons.id,
        name: icons.name,
        svg: icons.svg,
        unicode: icons.unicode,
        color: icons.color,
      })
      .from(icons)
      .where(sql`${icons.fonticonId} = ${fonticonId}`);

    return result;
  }

  async updateByFonticon(data, fonticonId) {
    // Delete
    if (data.delete) {
      for (const icon of data.delete) {
        await db.delete(icons).where(sql`${icons.id} = ${icon.id}`);
      }
    }

    // Insert
    if (data.new) {
      const newIcons = data.new.map((icon) => ({ ...icon, fonticonId }));
      await db.insert(icons).values(newIcons);
    }

    // Update
    if (data.update) {
      for (const icon of data.update) {
        await db
          .update(icons)
          .set(icon)
          .where(sql`${icons.id} = ${icon.id}`);
      }
    }
  }
}

module.exports = { IconService };
