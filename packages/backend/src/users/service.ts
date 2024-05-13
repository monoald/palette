import { eq, sql } from "drizzle-orm";
import { users } from "../db/schemas/users";
import { db } from "../dbConnection";
import { HTTPException } from "hono/http-exception";
import { randomKey } from "../utils/randomKey";
import { sign } from "hono/jwt";

export class UserService {
  constructor() {}

  async find() {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        username: users.username,
        provider: users.provider,
      })
      .from(users);

    return result;
  }

  async findOne(id: string) {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        provider: users.provider,
      })
      .from(users)
      .where(sql`${users.id} = ${id}`);

    const user = result[0];

    if (user === undefined) {
      throw new HTTPException(404, { message: "Cannot find user" });
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        provider: users.provider,
      })
      .from(users)
      .where(sql`${users.email} = ${email}`);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  }

  async create(user: User) {
    const id = await db.insert(users).values(user).returning({ id: users.id });

    if (id.length === 0) {
      throw new HTTPException(501, { message: "Can not create user" });
    }
  }

  async addKey(email: string) {
    const signinKey = randomKey();

    await db
      .update(users)
      .set({ signinKey: signinKey })
      .where(sql`${users.email} = ${email}`);

    return signinKey;
  }

  async signin(key: string | null, secret: string) {
    if (!key) {
      throw new HTTPException(400, { message: "Bad request" });
    }
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        provider: users.provider,
      })
      .from(users)
      .where(sql`${users.signinKey} = ${key}`);

    const user = result[0];

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    await db
      .update(users)
      .set({
        signinKey: null,
      })
      .where(sql`${users.id} = ${user.id}`);

    const token = await sign({ id: user.id }, secret);

    return {
      token,
      user: {
        username: user.username,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async getCollections(userId: number) {
    const result = await db.query.users.findMany({
      columns: {},
      with: {
        colors: {
          columns: {},
          with: {
            color: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        palettes: {
          columns: {},
          with: {
            palette: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        gradients: {
          columns: {},
          with: {
            gradient: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        fonticons: true,
      },
      where: eq(users.id, userId),
    });

    const formated = {
      ...result[0],
      colors: result[0].colors.map((cols) => cols.color),
      palettes: result[0].palettes.map((cols) => cols.palette),
      gradients: result[0].gradients.map((cols) => cols.gradient),
    };

    return formated;
  }
}
