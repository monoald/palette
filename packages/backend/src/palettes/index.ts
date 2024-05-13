import { Hono } from "hono";
import { PaletteService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";

const service = new PaletteService();
export const palettes = new Hono();

palettes.get("/", async (c) => {
  const palettes = await service.find();

  return c.json(palettes);
});

palettes.post("/save", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");

  const id = await service.save(body.name, payload.id);

  c.status(200);
  return c.json({ id });
});

palettes.post("/unsave", jwtWithSecret(), async (c) => {
  const body = await c.req.json();
  const payload = c.get("jwtPayload");

  const id = await service.unsave(body.name, payload.id);

  c.status(200);
  return c.json({ id });
});
