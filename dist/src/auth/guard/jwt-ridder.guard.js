"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRidderGuard = void 0;
const passport_1 = require("@nestjs/passport");
const exceptions_1 = require("../../exceptions");
class JwtRidderGuard extends (0, passport_1.AuthGuard)('jwt-ridder') {
    constructor() {
        super();
    }
    async canActivate(context) {
        try {
            await super.canActivate(context);
            return true;
        }
        catch (error) {
            throw exceptions_1.ClientInvalidTokenException;
            return false;
        }
    }
}
exports.JwtRidderGuard = JwtRidderGuard;
//# sourceMappingURL=jwt-ridder.guard.js.map