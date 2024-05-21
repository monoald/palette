import { Hono } from "hono";
import { ColorService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";
import { dbConnection } from "../dbConnection";
import { LibSQLDatabase } from "drizzle-orm/libsql";

const service = new ColorService();
export const colors = new Hono<{
  Variables: { db: LibSQLDatabase<any> };
}>();

colors.use(dbConnection());

colors.get("/", async (c) => {
  const { page, userId } = c.req.query();
  const db = c.get("db");

  const colors = await service.find(db, +page, +userId);

  return c.json(colors);
});

colors.post("/save", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.save(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});

colors.post("/unsave", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.unsave(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});
