import { Hono } from "hono";
import { UserService } from "./service";
import { jwtWithSecret } from "../middlewares/jwtWithSecret";

const service = new UserService();
export const users = new Hono();

users.get("/", async (c) => {
  const users = await service.find();

  return c.json(users);
});

users.post("/signin", async (c) => {
  const body = await c.req.json();

  const user = await service.signin(body.key, c.env?.JWT_SECRET as string);

  return c.json(user);
});

users.get("collections", jwtWithSecret(), async (c) => {
  const payload = c.get("jwtPayload");
  const collections = await service.getCollections(payload.id);

  return c.json(collections);
});
