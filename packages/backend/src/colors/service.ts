import { colors, colorsToUsers } from "../db/schemas/colors";
import { desc, sql } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { HTTPException } from "hono/http-exception";

export class ColorService {
  constructor() {}

  async create(db: LibSQLDatabase<any>, name: string) {
    const result = await db
      .insert(colors)
      .values({
        name,
      })
      .returning({ id: colors.id });

    return result[0];
  }

  async find(db: LibSQLDatabase<any>, page: number, userId: number) {
    const limit = 6;

    const result = await db
      .select({
        id: colors.id,
        name: colors.name,
        savedCount: colors.savedCount,
        saved: sql`CASE WHEN ${colorsToUsers.colorId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      })
      .from(colors)
      .leftJoin(
        colorsToUsers,
        sql`${colorsToUsers.colorId} = ${colors.id} AND ${colorsToUsers.userId} = ${userId}`
      )
      .orderBy(desc(colors.savedCount))
      .offset((page - 1) * limit)
      .limit(limit);

    return result;
  }

  async findOne(db: LibSQLDatabase<any>, name: string) {
    const result = await db
      .select({ id: colors.id, savedCount: colors.savedCount })
      .from(colors)
      .where(sql`${colors.name} = ${name}`);

    const color = result[0];

    return color;
  }

  async save(db: LibSQLDatabase<any>, name: string, userId: number) {
    const color = await this.findOne(db, name);
    let id = color?.id;

    if (color !== undefined) {
      await db
        .update(colors)
        .set({ savedCount: color.savedCount + 1 })
        .where(sql`${colors.id} = ${color.id}`);
    } else {
      const color = await this.create(db, name);
      id = color.id;
    }

    const isSaved = await db
      .select({ userId: colorsToUsers.userId })
      .from(colorsToUsers)
      .where(
        sql`${colorsToUsers.colorId} = ${id} AND ${colorsToUsers.userId} = ${userId}`
      );

    if (isSaved.length !== 0) {
      throw new HTTPException(409, { message: "Color already saved" });
    }

    await db.insert(colorsToUsers).values({
      userId,
      colorId: id,
    });

    return userId;
  }

  async unsave(db: LibSQLDatabase<any>, name: string, userId: number) {
    const color = await this.findOne(db, name);

    const result = await db
      .delete(colorsToUsers)
      .where(
        sql`${colorsToUsers.colorId} = ${color.id} AND ${colorsToUsers.userId} = ${userId}`
      )
      .returning({ colorId: colorsToUsers.colorId });

    if (result.length === 0 || result[0].colorId !== color.id) {
      throw new HTTPException(500, { message: "Something went wrong" });
    }

    await db
      .update(colors)
      .set({ savedCount: color.savedCount - 1 })
      .where(sql`${colors.id} = ${color.id}`);

    return result[0].colorId;
  }
}
