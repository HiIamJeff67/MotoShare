"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ridder = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
exports.Ridder = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx
        .switchToHttp()
        .getRequest();
    if (!request || !request.user) {
        throw new jwt_1.TokenExpiredError('The access token has expired, please try to login again', new Date());
    }
    return request.user;
});
//# sourceMappingURL=ridder.decorator.js.map