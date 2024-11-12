"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Passenger = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../exceptions");
exports.Passenger = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx
        .switchToHttp()
        .getRequest();
    if (!request || !request.user) {
        throw exceptions_1.ClientInvalidTokenOrTokenExpiredException;
    }
    return request.user;
});
//# sourceMappingURL=passenger.decorator.js.map