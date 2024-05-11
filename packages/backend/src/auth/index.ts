import { Hono } from "hono";
import { googleAuth, GoogleUser } from "@hono/oauth-providers/google";
import { githubAuth, GitHubUser } from "@hono/oauth-providers/github";
import { signUser } from "./controller";

export const auth = new Hono<{
  Variables: { "user-google": GoogleUser, "user-github": GitHubUser };
  Bindings: { CLIENT_URI: string };
}>();

auth.get(
  "/google",
  googleAuth({
    scope: ["openid", "email", "profile"],
  }),
  async (c) => {
    const googleUser = c.get("user-google")!;

    const signinKey = await signUser(
      googleUser.email,
      {
        email: googleUser.email!,
        name: googleUser.name!,
        username: googleUser.given_name!,
        avatar: googleUser.picture!,
        provider: "google",
      }
    )

    return c.redirect(`${c.env?.CLIENT_URI}/auth?key=${signinKey}`);
  }
);

auth.get(
  "/github",
  githubAuth({
    scope: ['read:user', 'user', 'user:email'],
    oauthApp: true,
  }),
  async (c) => {
    const githubUser = c.get("user-github")!;
    
    const signinKey = await signUser(
      githubUser.email!,
      {
        email: githubUser.email!,
        name: githubUser.name!,
        username: githubUser.login!,
        avatar: githubUser.avatar_url!,
        provider: "github",
      }
    );
    
    return c.redirect(`${c.env?.CLIENT_URI}/auth?key=${signinKey}`);
  }
);
