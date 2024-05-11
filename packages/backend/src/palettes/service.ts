import { db } from "../dbConnection";
import { palettes, palettesToUsers } from "../db/schemas/palettes";
import { sql } from "drizzle-orm";
import { uniquePaletteId } from "../utils/uniquePaletteId";
import { HTTPException } from "hono/http-exception";
import { appendTrailingSlash } from "hono/trailing-slash";

export class PaletteService {
  constructor() { }

  async create(name: string) {
    const upId = await uniquePaletteId(name)

    const result = await db
      .insert(palettes)
      .values({
        name,
        upId,
        length: name.split("-").length
      }).returning({ id: palettes.id });

    return result[0];
  }

  async findOne(name: string) {
    const incomingUniquePaletteId = await uniquePaletteId(name);
    const result = await db
      .select({ id: palettes.id, savedCount: palettes.savedCount })
      .from(palettes)
      .where(sql`${palettes.upId} = ${incomingUniquePaletteId}`);

    const palette = result[0];

    return palette;
  }

  async find() {
    const result = await db
      .select({
        id: palettes.id,
        upId: palettes.upId,
        name: palettes.name,
        length: palettes.length,
        savedCount: palettes.savedCount
      })
      .from(palettes);

    return result;
  }

  async save(name: string, userId: number) {
    const palette = await this.findOne(name);
    let id = palette?.id;

    if (palette !== undefined) {
      await db
        .update(palettes)
        .set({ savedCount: palette.savedCount + 1 })
        .where(sql`${palettes.id} = ${palette.id}`);
    } else {
      const palette = await this.create(name);
      id = palette.id;
    }

    const isSaved = await db
      .select({ userId: palettesToUsers.userId })
      .from(palettesToUsers)
      .where(sql`${palettesToUsers.paletteId} = ${id} AND ${palettesToUsers.userId} = ${userId}`)

    if (isSaved.length !== 0) {
      throw new HTTPException(409, { message: "Palette already saved" });
    }

    await db
      .insert(palettesToUsers)
      .values({
        userId,
        paletteId: id,
      });

    return userId;
  }

  async unsave(name: string, userId: number) {
    const palette = await this.findOne(name);

    const result = await db
      .delete(palettesToUsers)
      .where(sql`${palettesToUsers.paletteId} = ${palette.id} AND ${palettesToUsers.userId} = ${userId}`)
      .returning({ paletteId: palettesToUsers.paletteId });

    if (result.length === 0 || result[0].paletteId !== palette.id) {
      throw new HTTPException(500, { message: "Something went wrong" });
    }

    await db
      .update(palettes)
      .set({ savedCount: palette.savedCount - 1 })
      .where(sql`${palettes.id} = ${palette.id}`);

    return result[0].paletteId;
  }
}
