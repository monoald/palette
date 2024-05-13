import { db } from "../dbConnection";
import { gradients, gradientsToUsers } from "../db/schemas/gradients";
import { desc, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class GradientService {
  constructor() {}

  async create(name: string) {
    const result = await db
      .insert(gradients)
      .values({
        name,
      })
      .returning({ id: gradients.id });

    return result[0];
  }

  async find(page: number, userId: number) {
    const limit = 6;

    const result = await db
      .select({
        id: gradients.id,
        name: gradients.name,
        savedCount: gradients.savedCount,
        saved: sql`CASE WHEN ${gradientsToUsers.gradientId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      })
      .from(gradients)
      .leftJoin(
        gradientsToUsers,
        sql`${gradientsToUsers.gradientId} = ${gradients.id} AND ${gradientsToUsers.userId} = ${userId}`
      )
      .orderBy(desc(gradients.savedCount))
      .offset((page - 1) * limit)
      .limit(limit);

    return result;
  }

  async findOne(name: string) {
    const result = await db
      .select({ id: gradients.id, savedCount: gradients.savedCount })
      .from(gradients)
      .where(sql`${gradients.name} = ${name}`);

    const gradient = result[0];

    return gradient;
  }

  async save(name: string, userId: number) {
    const gradient = await this.findOne(name);
    let id = gradient?.id;

    if (gradient !== undefined) {
      await db
        .update(gradients)
        .set({ savedCount: gradient.savedCount + 1 })
        .where(sql`${gradients.id} = ${gradient.id}`);
    } else {
      const gradient = await this.create(name);
      id = gradient.id;
    }

    const isSaved = await db
      .select({ userId: gradientsToUsers.userId })
      .from(gradientsToUsers)
      .where(
        sql`${gradientsToUsers.gradientId} = ${id} AND ${gradientsToUsers.userId} = ${userId}`
      );

    if (isSaved.length !== 0) {
      throw new HTTPException(409, { message: "Gradient already saved" });
    }

    await db.insert(gradientsToUsers).values({
      userId,
      gradientId: id,
    });

    return userId;
  }

  async unsave(name: string, userId: number) {
    const gradient = await this.findOne(name);

    const result = await db
      .delete(gradientsToUsers)
      .where(
        sql`${gradientsToUsers.gradientId} = ${gradient.id} AND ${gradientsToUsers.userId} = ${userId}`
      )
      .returning({ gradientId: gradientsToUsers.gradientId });

    if (result.length === 0 || result[0].gradientId !== gradient.id) {
      throw new HTTPException(500, { message: "Something went wrong" });
    }

    await db
      .update(gradients)
      .set({ savedCount: gradient.savedCount - 1 })
      .where(sql`${gradients.id} = ${gradient.id}`);

    return result[0].gradientId;
  }
}
