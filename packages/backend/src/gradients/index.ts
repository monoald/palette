import { Hono } from "hono";
import { GradientService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { dbConnection } from "../dbConnection";

const service = new GradientService();
export const gradients = new Hono<{
  Variables: { db: LibSQLDatabase<any> };
}>();

gradients.use(dbConnection());

gradients.get("/", async (c) => {
  const { page, userId } = c.req.query();
  const db = c.get("db");

  const gradients = await service.find(db, +page, +userId);

  return c.json(gradients);
});

gradients.post("/save", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.save(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});

gradients.post("/unsave", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.unsave(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});
