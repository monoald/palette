import { Hono } from "hono";
import { GradientService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";

const service = new GradientService();
export const gradients = new Hono();

gradients.get("/", async (c) => {
  const gradients = await service.find();

  return c.json(gradients);
})

gradients.post(
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

gradients.post(
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
