import { Hono } from "hono";
import { UserService } from "./service";

const service = new UserService();
export const users = new Hono();

users.get("/", async (c) => {
   const users = await service.find();
   
   return c.json(users);
})

users.post(
  "/signin",
  async (c) => {
  const body = await c.req.json();

  const user = await service.signin(body.key, c.env?.JWT_SECRET as string);

  return c.json(user);
})
