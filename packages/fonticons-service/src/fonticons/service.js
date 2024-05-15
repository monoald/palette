const boom = require("@hapi/boom");
const { sql } = require("drizzle-orm");
const { fonticons } = require("./schema");
const { db } = require("../dbConnection");
const { IconService } = require("../icons/service");
const { toSvgFont, normalizeSvg } = require("../svgToFont/toSvgFont");
const generateFonts = require("../svgToFont/fonts/generateFonts");
const iconsToZip = require("../svgToFont/fonts/iconsToZip");
const { normalizeName } = require("../utils/normalizeName");

const service = new IconService();

class FonticonService {
  constructor() {}

  async create(fonticon, userId) {
    const result = await db
      .insert(fonticons)
      .values({
        ...fonticon.data,
        userId,
        name: normalizeName(fonticon.data.name),
      })
      .returning({ id: fonticons.id });

    const fonticonId = result[0].id;
    await service.createByFonticon(fonticon.icons, fonticonId);

    return fonticonId;
  }

  async find() {
    const result = await db
      .select({
        id: fonticons.id,
        name: fonticons.name,
        color: fonticons.color,
        thumbnail: fonticons.thumbnail,
        userId: fonticons.userId,
      })
      .from(fonticons);

    return result;
  }

  async findOne(name, userId) {
    const result = await db
      .select({
        id: fonticons.id,
        name: fonticons.name,
        color: fonticons.color,
        thumbnail: fonticons.thumbnail,
      })
      .from(fonticons)
      .where(
        sql`${fonticons.name} = ${name} AND ${fonticons.userId} = ${userId}`
      );

    if (result.length === 0) {
      throw new boom.notFound("Font icon not found.");
    }

    const fonticon = result[0];

    return {
      data: fonticon,
      icons: await service.findByFonticon(fonticon.id),
    };
  }

  async save(fonticon, userId) {
    const fonticonSaved = await this.findOne(fonticon.data.name, userId);

    if (fonticonSaved !== undefined) {
      throw boom.conflict("You have a Font Icon with that name already");
    }

    const id = await this.create(fonticon, userId);

    return id;
  }

  async unsave(id, userId) {
    await service.deleteByFonticon(id);

    const result = await db
      .delete(fonticons)
      .where(sql`${fonticons.id} = ${id} AND ${fonticons.userId} = ${userId}`)
      .returning({ id: fonticons.id });

    if (result.length === 0) {
      throw boom.conflict("Font icon already deleted.");
    }
  }

  async update(id, userId, fonticon) {
    if (fonticon.data) {
      await db
        .update(fonticons)
        .set(fonticon.data)
        .where(
          sql`${fonticons.id} = ${id} AND ${fonticons.userId} = ${userId}`
        );
    }

    if (
      fonticon.icons &&
      (fonticon.icons.new || fonticon.icons.delete || fonticon.icons.update)
    ) {
      await service.updateByFonticon(fonticon.icons, id);
    }
  }

  async downloadFonts(fonticon) {
    const normalizedIcons = fonticon;

    for (const i in normalizedIcons.icons) {
      normalizedIcons.icons[i] = await normalizeSvg(
        normalizedIcons.icons[i],
        normalizedIcons.icons[i].color
      );
    }

    const font = await toSvgFont(
      normalizedIcons.icons,
      normalizedIcons.data.name
    );

    const fonts = await generateFonts(
      normalizedIcons.data.name,
      normalizedIcons.color,
      normalizedIcons.icons,
      font
    );

    const file = Buffer.from(fonts, "base64");

    return { file, name: normalizedIcons.name };
  }

  async downloadFontsFromSaved(id) {
    const result = await db
      .select({
        name: fonticons.name,
        color: fonticons.color,
      })
      .from(fonticons)
      .where(sql`${fonticons.id} = ${id}`);

    const fonticon = result[0];

    if (fonticon === undefined)
      throw boom.conflict(`Collection does not exist.`);

    fonticon.icons = await service.findByFonticon(id);

    const font = await toSvgFont(fonticon.icons, fonticon.name);

    const fonts = await generateFonts(
      fonticon.name,
      fonticon.color,
      fonticon.icons,
      font
    );

    const file = Buffer.from(fonts, "base64");

    return { file, name: fonticon.name };
  }

  async downloadIcons(id) {
    const fonticon = await db
      .select({ name: fonticons.name })
      .from(fonticons)
      .where(sql`${fonticons.id} = ${id}`);

    if (fonticon.length === 0) {
      throw new boom.notFound("Font icon not found.");
    }

    const icons = await service.findByFonticon(id);

    if (icons.length === 0) throw boom.conflict(`Collection does not exist.`);

    const iconsZip = await iconsToZip(icons);

    const file = Buffer.from(iconsZip, "base64");

    return { file, name: fonticon[0].name };
  }
}

module.exports = { FonticonService };
