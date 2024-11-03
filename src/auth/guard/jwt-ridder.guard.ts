import { AuthGuard } from "@nestjs/passport";

export class JwtRidderGuard extends AuthGuard('jwt-ridder') {
    constructor() {
        super();
    }
}