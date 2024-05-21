import { Hono } from "hono";
import { auth } from "./auth";
import { palettes } from "./palettes";
import { users } from "./users";
import { colors } from "./colors";
import { gradients } from "./gradients";
import { cors } from "hono/cors";

const app = new Hono().basePath("api/v1");

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("it works");
});

app.route("/auth", auth);
app.route("/users", users);
app.route("/palettes", palettes);
app.route("/colors", colors);
app.route("/gradients", gradients);

export default app;
