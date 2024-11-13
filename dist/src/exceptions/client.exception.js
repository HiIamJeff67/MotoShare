"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUnknownException = exports.ClientNoChangeOnPasswordException = exports.ClientNoChangeOnEmailException = exports.ClientNoChangeOnUserNameException = exports.ClientCreateRidderCollectionException = exports.ClientCreatePassengerCollectionException = exports.ClientCreateRidderInfoException = exports.ClientCreatePassengerInfoException = exports.ClientCreateOrderException = exports.ClientCreateRidderInviteException = exports.ClientCreatePassengerInviteException = exports.ClientCreateSupplyOrderException = exports.ClientCreatePurchaseOrderException = exports.ClientDuplicateFieldDetectedException = exports.ClientSignUpUserException = exports.ClientSignInPasswordNotMatchException = exports.ClientSignInUserException = exports.ClientSignInEmailNotFoundException = exports.ClientSignInUserNameNotFoundException = exports.ClientCollectionNotFoundException = exports.ClientOrderNotFoundException = exports.ClientSupplyOrderNotFoundException = exports.ClientPurchaseOrderNotFoundException = exports.ClientInviteNotFoundException = exports.ClientRidderNotFoundException = exports.ClientPassengerNotFoundException = exports.ClientUserHasNoAccessException = exports.ClientMissingTokenException = exports.ClientInvalidTokenOrTokenExpiredException = void 0;
const common_1 = require("@nestjs/common");
exports.ClientInvalidTokenOrTokenExpiredException = new common_1.UnauthorizedException({
    case: "E-C-001",
    message: "Invalid user, or token expired"
});
exports.ClientMissingTokenException = new common_1.UnauthorizedException({
    case: "E-C-002",
    message: "Unauthorized",
});
exports.ClientUserHasNoAccessException = new common_1.UnauthorizedException({
    case: "E-C-003",
    message: "The current user has no access to this method",
});
exports.ClientPassengerNotFoundException = new common_1.NotFoundException({
    case: "E-C-100",
    message: "Cannot find any passengers",
});
exports.ClientRidderNotFoundException = new common_1.NotFoundException({
    case: "E-C-101",
    message: "Cannot find any ridders",
});
exports.ClientInviteNotFoundException = new common_1.NotFoundException({
    case: "E-C-102",
    message: "Cannot find any invites",
});
exports.ClientPurchaseOrderNotFoundException = new common_1.NotFoundException({
    case: "E-C-103",
    message: "Cannot find any purchaseOrders",
});
exports.ClientSupplyOrderNotFoundException = new common_1.NotFoundException({
    case: "E-C-104",
    message: "Cannot find any supplyOrders"
});
exports.ClientOrderNotFoundException = new common_1.NotFoundException({
    case: "E-C-105",
    message: "Cannot find any orders",
});
exports.ClientCollectionNotFoundException = new common_1.NotFoundException({
    case: "E-C-106",
    message: "Cannot find any collections",
});
exports.ClientSignInUserNameNotFoundException = new common_1.NotFoundException({
    case: "E-C-107",
    message: "Failed to sign in, userName not found",
});
exports.ClientSignInEmailNotFoundException = new common_1.NotFoundException({
    case: "E-C-108",
    message: "Failed to sign in, email not found",
});
exports.ClientSignInUserException = new common_1.ForbiddenException({
    case: "E-C-201",
    message: "Failed to sign in"
});
exports.ClientSignInPasswordNotMatchException = new common_1.ForbiddenException({
    case: "E-C-202",
    message: "Failed to sign in, user with password not match",
});
exports.ClientSignUpUserException = new common_1.ForbiddenException({
    case: "E-C-203",
    message: "Failed to sign up",
});
const ClientDuplicateFieldDetectedException = (errorMessage) => {
    return new common_1.ConflictException(errorMessage ?? {
        case: "E-C-204", message: "Duplicate fields detected"
    });
};
exports.ClientDuplicateFieldDetectedException = ClientDuplicateFieldDetectedException;
exports.ClientCreatePurchaseOrderException = new common_1.ForbiddenException({
    case: "E-C-205",
    message: "Failed to create a purchaseOrder",
});
exports.ClientCreateSupplyOrderException = new common_1.ForbiddenException({
    case: "E-C-206",
    message: "Failed to create a suplyOrder",
});
exports.ClientCreatePassengerInviteException = new common_1.ForbiddenException({
    case: "E-C-207",
    message: "Failed to create a passengerInvite",
});
exports.ClientCreateRidderInviteException = new common_1.ForbiddenException({
    case: "E-C-208",
    message: "Faield to create a ridderInvite",
});
exports.ClientCreateOrderException = new common_1.ForbiddenException({
    case: "E-C-209",
    message: "Failed to create an order",
});
exports.ClientCreatePassengerInfoException = new common_1.ForbiddenException({
    case: "E-C-210",
    message: "Failed to create a passengerInfo",
});
exports.ClientCreateRidderInfoException = new common_1.ForbiddenException({
    case: "E-C-211",
    message: "Failed to create a ridderInfo",
});
exports.ClientCreatePassengerCollectionException = new common_1.ForbiddenException({
    case: "E-C-212",
    message: "Failed to create a passengerCollection",
});
exports.ClientCreateRidderCollectionException = new common_1.ForbiddenException({
    case: "E-C-213",
    message: "Failed to create a ridderCollection",
});
exports.ClientNoChangeOnUserNameException = new common_1.ConflictException({
    case: "E-C-300",
    message: "There's no changes on userName",
});
exports.ClientNoChangeOnEmailException = new common_1.ConflictException({
    case: "E-C-301",
    message: "There's no changes on email",
});
exports.ClientNoChangeOnPasswordException = new common_1.ConflictException({
    case: "E-C-302",
    message: "There's no changes on password",
});
exports.ClientUnknownException = new common_1.InternalServerErrorException({
    case: "E-C-999",
    message: "Unknown error occurred",
});
//# sourceMappingURL=client.exception.js.map