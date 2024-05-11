import { db } from "../dbConnection";
import { icons } from "../db/schemas/icons";
import { sql } from "drizzle-orm";
import { Icon } from "../fonticons/types";

export class IconService {
  constructor() {}

  async createByFontIcon(data: Icon[], fonticonId: number) {
    data = data.map((icon) => ({ ...icon, fonticonId }));

    const result = await db
      .insert(icons)
      .values(data)
      .returning({ id: icons.id });

    return result;
  }

  async deleteByFontIcon(fonticonId: number) {
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

  async findByFontIcon(fonticonId: number) {
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
}
