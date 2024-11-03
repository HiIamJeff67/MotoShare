"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRidderGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtRidderGuard extends (0, passport_1.AuthGuard)('jwt-ridder') {
    constructor() {
        super();
    }
}
exports.JwtRidderGuard = JwtRidderGuard;
//# sourceMappingURL=jwt-ridder.guard.js.map