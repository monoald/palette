import { Hono } from "hono";
import { FonticonService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";

const service = new FonticonService();
export const fonticons = new Hono();

fonticons.get("/", async (c) => {
  const fonticons = await service.find();

  return c.json(fonticons);
});

fonticons.post(
  "/save",
  jwtWithSecret(),
  async (c) => {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");

    const userId = await service.save(body, payload.id);

    return c.json({ userId });
  }
);

fonticons.post(
  "/unsave",
  jwtWithSecret(),
  async (c) => {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");

    await service.unsave(body.id, payload.id);

    c.status(204);
    return c.body(null);
  }
);
