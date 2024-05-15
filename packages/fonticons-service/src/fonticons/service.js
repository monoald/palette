const boom = require("@hapi/boom");

// const Icon = require("../models/icon.model");
// const User = require("../models/user.model");
// const { toSvgFont, normalizeSvg } = require("../svgToFont/toSvgFont");
// const generateFonts = require("../svgToFont/fonts/generateFonts");
// const iconsToZip = require("../svgToFont/fonts/iconsToZip");

// class IconService {
//   constructor() {}

//   async create(data, userId) {
//     const user = await User.findById(userId).select("_id icons");
//     const icons = await Icon.find({ name: data.name }).select("users");
//     let exists = false;

//     for (const i in icons) {
//       exists = Boolean(
//         icons[i].users.find((user) => user._id.toString() === userId)
//       );
//       if (exists) {
//         break;
//       }
//     }

//     if (exists)
//       throw boom.conflict(`Collection name "${data.name}" already used.`);

//     const normalizedSvgs = [];

//     for (const i in data.icons) {
//       normalizedSvgs.push(await normalizeSvg(data.icons[i], data.color));
//     }

//     const newIcon = new Icon({
//       ...data,
//       icons: normalizedSvgs,
//       users: [userId],
//     });

//     await newIcon.save();
//     user.icons.splice(0, 0, newIcon.id);
//     await user.save();

//     return newIcon.id;
//   }

//   async find(page) {
//     const limit = 80;
//     const offset = (page - 1) * limit;
//     const icons = await Icon.find({})
//       .limit(limit)
//       .skip(offset)
//       .select("id name color");

//     return icons;
//   }

//   async findOne(id, name) {
//     const icons = await Icon.find({ name }).select("id name color icons");

//     if (!icons) {
//       throw boom.notFound(`Icon not found.`);
//     }

//     const icon = icons.find((icn) => {
//       return icn._id.toString() === id;
//     });

//     if (!icon) {
//       throw boom.notFound(`Icon not found.`);
//     }

//     return icon;
//   }

//   async update(data, id) {
//     if (data.icons) {
//       const normalizedSvgs = [];

//       for (const i in data.icons) {
//         normalizedSvgs.push(await normalizeSvg(data.icons[i], data.color));
//       }

//       data.icons = normalizedSvgs;
//     }

//     await Icon.findOneAndUpdate({ _id: id }, data);

//     return id;
//   }

//   async delete(userId, id) {
//     const icon = await Icon.findById(id);

//     if (!icon) throw boom.conflict(`Icon does not exist.`);

//     const user = await User.findById(userId);

//     if (!user) throw boom.conflict(`User does not exist.`);
//     const iconIndex = user.icons.findIndex((icon) => icon.toString() === id);

//     if (iconIndex === -1) throw boom.conflict(`User has no icon ${icon.name}.`);

//     await Icon.deleteOne({ _id: id });
//     user.icons.splice(iconIndex, 1);
//     await user.save();

//     return id;
//   }

//   async downloadFonts(id) {
//     const icon = await Icon.findById(id).select("name icons color");

//     if (!icon) throw boom.conflict(`Collection does not exist.`);

//     const font = await toSvgFont(icon.icons, icon.name);

//     const fonts = await generateFonts(icon, font);

//     const file = Buffer.from(fonts, "base64");

//     return { file, name: icon.name };
//   }

//   async downloadIcons(id) {
//     const icon = await Icon.findById(id).select("name icons");

//     if (!icon) throw boom.conflict(`Collection does not exist.`);

//     const iconsZip = await iconsToZip(icon.icons);

//     const file = Buffer.from(iconsZip, "base64");

//     return { file, name: icon.name };
//   }
// }

// module.exports = IconService;

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

  async create(data, userId) {
    const result = await db
      .insert(fonticons)
      .values({
        ...data.fonticon,
        userId,
        name: normalizeName(data.fonticon.name),
      })
      .returning({ id: fonticons.id });

    const fonticonId = result[0].id;
    await service.createByFonticon(data.icons, fonticonId);

    return result;
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
      return undefined;
    }

    const fonticon = result[0];

    return {
      ...fonticon,
      icons: await service.findByFonticon(fonticon.id),
    };
  }

  async save(data, userId) {
    const fonticon = await this.findOne(data.fonticon.name, userId);

    if (fonticon !== undefined) {
      throw boom.conflict("You have a Font Icon with that name already");
    }

    await this.create(data, userId);

    return userId;
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

  async update(id, userId, data) {
    if (data.fonticon) {
      await db
        .update(fonticons)
        .set(data.fonticon)
        .where(
          sql`${fonticons.id} = ${id} AND ${fonticons.userId} = ${userId}`
        );
    }

    if (
      data.icons &&
      (data.icons.new || data.icons.delete || data.icons.update)
    ) {
      await service.updateByFonticon(data.icons, id);
    }
  }

  async downloadFonts(fonticon) {
    const normalizedIcons = fonticon;

    for (const i in fonticon.svg) {
      normalizeSvg.icons[i] = await normalizeSvg(data, data.color);
    }

    const font = await toSvgFont(fonticon.icons, fonticon.name);

    const fonts = await generateFonts(fonticon, font);

    const file = Buffer.from(fonts, "base64");

    return { file, name: fonticon.name };
  }

  async downloadFontsFromSaved(id) {
    const result = await db
      .select({
        name: fonticons.name,
        color: fonticons.color,
      })
      .from(fonticons)
      .where(sql`${fonticons.id} = ${id}`);

    const icon = result[0];

    if (icon === undefined) throw boom.conflict(`Collection does not exist.`);

    icon.icons = await service.findByFonticon(id);

    const font = await toSvgFont(icon.icons, icon.name);

    const fonts = await generateFonts(icon, font);

    const file = Buffer.from(fonts, "base64");

    return { file, name: icon.name };
  }

  async downloadIcons(id) {
    const icons = await service.findByFonticon(id);

    if (icons.length === 0) throw boom.conflict(`Collection does not exist.`);

    const iconsZip = await iconsToZip(icons);

    const file = Buffer.from(iconsZip, "base64");

    return { file, name: icons.name };
  }
}

module.exports = { FonticonService };
