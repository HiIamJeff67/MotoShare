"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPassengerGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtPassengerGuard extends (0, passport_1.AuthGuard)('jwt-passenger') {
    constructor() {
        super();
    }
    async canActivate(context) {
        try {
            const result = await super.canActivate(context);
            if (!result)
                return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.JwtPassengerGuard = JwtPassengerGuard;
//# sourceMappingURL=jwt-passenger.guard.js.map