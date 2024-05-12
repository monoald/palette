import { Hono } from "hono";
import { auth } from "./auth";
import { palettes } from "./palettes";
import { users } from "./users";
import { colors } from "./colors";
import { gradients } from "./gradients";
import { fonticons } from "./fonticons";
import { icons } from "./icons";
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
app.route("/fonticons", fonticons);
app.route("/icons", icons);

export default app;
