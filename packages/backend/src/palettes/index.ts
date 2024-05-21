import { Hono } from "hono";
import { PaletteService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { dbConnection } from "../dbConnection";

const service = new PaletteService();
export const palettes = new Hono<{
  Variables: { db: LibSQLDatabase<any> };
}>();

palettes.use(dbConnection());

palettes.get("/", async (c) => {
  const { page, userId } = c.req.query();
  const db = c.get("db");

  const palettes = await service.find(db, +page, +userId);

  return c.json(palettes);
});

palettes.post("/save", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.save(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});

palettes.post("/unsave", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");
  const db = c.get("db");

  const id = await service.unsave(db, body.name, payload.id);

  c.status(200);
  return c.json({ id });
});
