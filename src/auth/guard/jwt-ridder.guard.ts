import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtRidderGuard extends AuthGuard('jwt-ridder') {
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