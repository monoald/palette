import { jwt } from "hono/jwt";
import { MiddlewareHandler } from "hono";

export function jwtWithSecret(): MiddlewareHandler {
  return async (c, next) => {
    const jwtMiddleware = jwt({
      secret: c.env.JWT_SECRET
    });

    return jwtMiddleware(c, next);
  }
}
