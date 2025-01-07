"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUnknownException = exports.ApiMissingUserRoleInHeaderWhileConnectingToSocketException = exports.ApiSendEmailForValidationException = exports.ApiGenerateAuthCodeException = exports.ApiGeneratingBearerTokenException = exports.ApiNonPositiveAmountDetectedException = exports.ApiPaymentIntentNotFinishedException = exports.ApiStripeWebhookUnhandleExcpetion = exports.ApiEndpointEnvVarNotFoundException = exports.ApiWrongWebhookSignatureException = exports.ApiISOStringFormException = exports.ApiPrevOrderIdFormException = exports.ApiSearchingLimitLessThanZeroException = exports.ApiSearchingLimitTooLargeException = exports.ApiWrongSearchPriorityTypeException = exports.ApiMissingBodyOrWrongDtoException = exports.ApiMissingParameterException = void 0;
const common_1 = require("@nestjs/common");
exports.ApiMissingParameterException = new common_1.BadRequestException({
    case: "E-A-001",
    message: "Require parameters",
});
exports.ApiMissingBodyOrWrongDtoException = new common_1.BadRequestException({
    case: "E-A-002",
    message: "Require body and customized dto of current route",
});
exports.ApiWrongSearchPriorityTypeException = new common_1.BadRequestException({
    case: "E-A-003",
    message: "searchPriorities should be any combination of 'T', 'R', 'U', 'S', 'D', see more on the note",
});
const ApiSearchingLimitTooLargeException = (maxLimit) => {
    return new common_1.NotAcceptableException({
        case: "E-A-100",
        message: `Cannot search with the limit greater than ${maxLimit}`
    });
};
exports.ApiSearchingLimitTooLargeException = ApiSearchingLimitTooLargeException;
const ApiSearchingLimitLessThanZeroException = (minLimit) => {
    return new common_1.NotAcceptableException({
        case: "E-A-011",
        message: `Cannot search with the limit less than ${minLimit}`
    });
};
exports.ApiSearchingLimitLessThanZeroException = ApiSearchingLimitLessThanZeroException;
exports.ApiPrevOrderIdFormException = new common_1.NotAcceptableException({
    case: "E-A-100",
    message: "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2",
});
exports.ApiISOStringFormException = new common_1.NotAcceptableException({
    case: "E-A-101",
    message: "Wrong form of ISO date string when converting it to time only string",
});
exports.ApiWrongWebhookSignatureException = new common_1.NotAcceptableException({
    case: "E-A-200",
    message: "Wrong webhook signature detected, please provide a valid signature",
});
exports.ApiEndpointEnvVarNotFoundException = new common_1.NotFoundException({
    case: "E-A-201",
    message: "Cannot find some necessary environment variables for sepecifying endpoint for Stripe webhooks",
});
exports.ApiStripeWebhookUnhandleExcpetion = new common_1.ForbiddenException({
    case: "E-A-202",
    message: "This request is unhandled due to it is undefined in stripe",
});
exports.ApiPaymentIntentNotFinishedException = new common_1.ForbiddenException({
    case: "E-A-400",
    message: "The transaction is not finished, please try again",
});
exports.ApiNonPositiveAmountDetectedException = new common_1.ForbiddenException({
    case: "E-A-401",
    message: "Detected non-positive amount",
});
exports.ApiGeneratingBearerTokenException = new common_1.InternalServerErrorException({
    case: "E-A-900",
    message: "Failed to generate a bearer token for current user",
});
exports.ApiGenerateAuthCodeException = new common_1.InternalServerErrorException({
    case: "E-A-901",
    message: "Failed to generate auth code for current user",
});
exports.ApiSendEmailForValidationException = new common_1.InternalServerErrorException({
    case: "E-A-902",
    message: "Failed to send a email for validation",
});
exports.ApiMissingUserRoleInHeaderWhileConnectingToSocketException = new common_1.InternalServerErrorException({
    case: "E-S-950",
    message: "Missing userrole field in header while connecting to socket",
});
exports.ApiUnknownException = new common_1.InternalServerErrorException({
    case: "E-A-099",
    message: "Unknown error occurred",
});
//# sourceMappingURL=api.exception.js.map