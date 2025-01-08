import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ClientInvalidTokenException } from "../../exceptions";

export class JwtPassengerGuard extends AuthGuard('jwt-passenger') {
    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
          const result = await super.canActivate(context);
          if (!result) return false;
          return true; 
      } catch (error) {
          return false; 
      }
  }
}