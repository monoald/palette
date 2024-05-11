import { HTTPException } from "hono/http-exception";
import { UserService } from "../users/service";

const service = new UserService();


export async function signUser(email: string, providerUser: User) {
  const user = await service.findOneByEmail(email);

  if (user === null) {
    service.create(providerUser)
  } else if (user.provider !== providerUser.provider) {
    throw new HTTPException(409, { message: `Email already registered via ${user.provider}` })
  }

  const signinKey = await service.addKey(email!);

  return signinKey
}
