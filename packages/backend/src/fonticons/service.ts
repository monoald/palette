import { sql } from "drizzle-orm";
import { fonticons } from "../db/schemas/fonticons";
import { db } from "../dbConnection";
import { Fonticons, Icon } from "./types";
import { IconService } from "../icons/service";
import { HTTPException } from "hono/http-exception";

const service = new IconService();

type Data = {
  fonticon: Fonticons,
  icons: Icon[],
}

export class FonticonService {
  constructor() { }

  async create(data: Data, userId: number) {
    const result = await db
      .insert(fonticons)
      .values({ ...data.fonticon, userId })
      .returning({ id: fonticons.id });

    const fonticonId = result[0].id;
    await service.createByFontIcon(data.icons, fonticonId);

    return result;
  }

  async find() {
    const result = await db
      .select({
        id: fonticons.id,
        name: fonticons.name,
        color: fonticons.color,
        thumbnail: fonticons.thumbnail,
        userId: fonticons.userId
      })
      .from(fonticons);

    return result;
  }

  async findOne(name: string, userId: number) {
    const result = await db
      .select({
        id: fonticons.id,
        name: fonticons.name,
        color: fonticons.color,
        thumbnail: fonticons.thumbnail,
      })
      .from(fonticons)
      .where(sql`${fonticons.name} = ${name} AND ${fonticons.userId} = ${userId}`);

    const fonticon = result[0];

    return fonticon;
  }

  async save(data: Data, userId: number) {
    const fonticon = await this.findOne(data.fonticon.name, userId);

    if (fonticon !== undefined) {
      throw new HTTPException(409, { message: "You have a Font Icon with that name already" });
    }

    await this.create(data, userId);

    return userId;
  }

  async unsave(id: number, userId: number) {
    await service.deleteByFontIcon(id);

    await db
      .delete(fonticons)
      .where(sql`${fonticons.id} = ${id} AND ${fonticons.userId} = ${userId}`);

    return id
  }
}
