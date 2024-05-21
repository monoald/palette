import { Hono } from "hono";
import { UserService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { dbConnection } from "../dbConnection";

const service = new UserService();
export const users = new Hono<{
  Variables: { db: LibSQLDatabase<any> };
  Bindings: { JWT_SECRET: string };
}>();

users.use(dbConnection());

users.get("/", async (c) => {
  const db = c.get("db");

  const users = await service.find(db);

  return c.json(users);
});

users.post("/signin", async (c) => {
  const body = await c.req.json();
  const db = c.get("db");

  const user = await service.signin(db, body.key, c.env?.JWT_SECRET as string);

  return c.json(user);
});

users.get("collections", jwtWithSecret(), async (c) => {
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const collections = await service.getCollections(db, payload.id);

  return c.json(collections);
});
