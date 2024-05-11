import { Hono } from "hono";
import { IconService } from "./service";

const service = new IconService();
export const icons = new Hono();

icons.get("/", async (c) => {
  const icons = await service.find();

  return c.json(icons);
})

icons.get("/collection/:id", async (c) => {
  const id = +c.req.param("id");
  const icons = await service.findByFontIcon(id);

  return c.json(icons);
});
