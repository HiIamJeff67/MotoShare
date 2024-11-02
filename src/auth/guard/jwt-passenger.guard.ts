import { AuthGuard } from "@nestjs/passport";

export class JwtPassengerGuard extends AuthGuard('jwt-passenger') {
    constructor() {
        super();
    }
}