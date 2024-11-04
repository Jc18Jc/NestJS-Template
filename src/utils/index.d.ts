import { UserDto } from "src/auth/dto/user.dto";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto;
      headers: { authorization: string };
    }
  }
}
