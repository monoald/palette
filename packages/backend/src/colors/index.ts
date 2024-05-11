import { Hono } from "hono";
import { ColorService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";

const service = new ColorService();
export const colors = new Hono();

colors.get("/", async (c) => {
  const colors = await service.find();

  return c.json(colors);
})

colors.post(
  "/save",
  jwtWithSecret(),
  async (c) => {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");

    const id = await service.save(body.name, payload.id)

    c.status(200);
    return c.json({ id });
  }
)

colors.post(
  "/unsave",
  jwtWithSecret(),
  async (c) => {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");

    const id = await service.unsave(body.name, payload.id);

    c.status(200);
    return c.json({ id })
  }
)
