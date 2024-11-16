"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUnknownError = void 0;
const common_1 = require("@nestjs/common");
exports.ServerUnknownError = new common_1.InternalServerErrorException({
    case: "E-S-099",
    message: "Internal Server Error",
});
//# sourceMappingURL=server.exception.js.map