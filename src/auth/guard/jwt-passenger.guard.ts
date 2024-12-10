import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtPassengerGuard extends AuthGuard('jwt-passenger') {
    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
          await super.canActivate(context);
          return true;
        } catch (error) {
          return false;
        }
    }
}