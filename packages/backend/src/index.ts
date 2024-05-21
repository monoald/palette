import { Hono } from "hono";
import { auth } from "./auth";
import { palettes } from "./palettes";
import { users } from "./users";
import { colors } from "./colors";
import { gradients } from "./gradients";
import { cors } from "hono/cors";

const app = new Hono().basePath("api/v1");

app.use("/*", async (c, next) => {
  const handler = cors({
    origin: [c.env?.CLIENT_URI as string, c.env?.DEV_CLIENT_URI as string],
  });

  return await handler(c, next);
});

app.route("/auth", auth);
app.route("/users", users);
app.route("/palettes", palettes);
app.route("/colors", colors);
app.route("/gradients", gradients);

export default app;
