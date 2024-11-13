"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUnknownException = exports.ApiGeneratingBearerTokenException = exports.ApiMissingBodyOrWrongDtoException = exports.ApiMissingParameterException = void 0;
const common_1 = require("@nestjs/common");
exports.ApiMissingParameterException = new common_1.BadRequestException({
    name: "E-A-001",
    message: "Require parameters",
});
exports.ApiMissingBodyOrWrongDtoException = new common_1.BadRequestException({
    name: "E-A-002",
    message: "Require body and customized dto of current route",
});
exports.ApiGeneratingBearerTokenException = new common_1.InternalServerErrorException({
    name: "E-A-900",
    message: "Failed to generate a bearer token for current user",
});
exports.ApiUnknownException = new common_1.InternalServerErrorException({
    name: "E-A-099",
    message: "Unknown error occurred",
});
//# sourceMappingURL=api.exception.js.map