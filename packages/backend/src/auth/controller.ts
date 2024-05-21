import { HTTPException } from "hono/http-exception";
import { UserService } from "../users/service";
import { LibSQLDatabase } from "drizzle-orm/libsql";

const service = new UserService();

export async function signUser(
  db: LibSQLDatabase<any>,
  email: string,
  providerUser: User
) {
  const user = await service.findOneByEmail(db, email);

  if (user === null) {
    service.create(db, providerUser);
  } else if (user.provider !== providerUser.provider) {
    throw new HTTPException(409, {
      message: `Email already registered via ${user.provider}`,
    });
  }

  const signinKey = await service.addKey(db, email!);

  return signinKey;
}
