import { Hono } from "hono";
import { googleAuth, GoogleUser } from "@hono/oauth-providers/google";
import { githubAuth, GitHubUser } from "@hono/oauth-providers/github";
import { signUser } from "./controller";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { dbConnection } from "../dbConnection";

export const auth = new Hono<{
  Variables: {
    "user-google": GoogleUser;
    "user-github": GitHubUser;
    db: LibSQLDatabase<any>;
  };
  Bindings: {
    CLIENT_URI: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
  };
}>();

auth.use(dbConnection());

auth.get(
  "/google",
  googleAuth({
    scope: ["openid", "email", "profile"],
  }),
  async (c) => {
    const googleUser = c.get("user-google")!;
    const db = c.get("db");

    const signinKey = await signUser(db, googleUser.email, {
      email: googleUser.email!,
      name: googleUser.name!,
      username: googleUser.given_name!,
      avatar: googleUser.picture!,
      provider: "google",
    });

    return c.redirect(`${c.env?.CLIENT_URI}/auth?key=${signinKey}`);
  }
);

auth.get(
  "/github",
  async (c, next) => {
    const handler = githubAuth({
      scope: ["read:user", "user", "user:email"],
      oauthApp: true,
      client_id: c.env.AUTH_GITHUB_ID!,
      client_secret: c.env.AUTH_GITHUB_SECRET!,
    });
    return await handler(c, next);
  },
  async (c) => {
    const githubUser = c.get("user-github")!;
    const db = c.get("db");

    const signinKey = await signUser(db, githubUser.email!, {
      email: githubUser.email!,
      name: githubUser.name!,
      username: githubUser.login!,
      avatar: githubUser.avatar_url!,
      provider: "github",
    });

    return c.redirect(`${c.env?.CLIENT_URI}/auth?key=${signinKey}`);
  }
);
