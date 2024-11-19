"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUnknownException = exports.ApiGeneratingBearerTokenException = exports.ApiPrevOrderIdFormException = exports.ApiSearchingLimitTooLarge = exports.ApiMissingBodyOrWrongDtoException = exports.ApiMissingParameterException = void 0;
const common_1 = require("@nestjs/common");
exports.ApiMissingParameterException = new common_1.BadRequestException({
    case: "E-A-001",
    message: "Require parameters",
});
exports.ApiMissingBodyOrWrongDtoException = new common_1.BadRequestException({
    case: "E-A-002",
    message: "Require body and customized dto of current route",
});
const ApiSearchingLimitTooLarge = (maxLimit) => {
    return new common_1.NotAcceptableException({
        case: "E-A-100",
        message: `Cannot search with the limit greater than ${maxLimit}`
    });
};
exports.ApiSearchingLimitTooLarge = ApiSearchingLimitTooLarge;
exports.ApiPrevOrderIdFormException = new common_1.NotAcceptableException({
    case: "E-A-100",
    message: "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2",
});
exports.ApiGeneratingBearerTokenException = new common_1.InternalServerErrorException({
    case: "E-A-900",
    message: "Failed to generate a bearer token for current user",
});
exports.ApiUnknownException = new common_1.InternalServerErrorException({
    case: "E-A-099",
    message: "Unknown error occurred",
});
//# sourceMappingURL=api.exception.js.map