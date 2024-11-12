"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUnknownException = exports.ClientNoChangeOnPasswordException = exports.ClientNoChangeOnEmailException = exports.ClientNoChangeOnUserNameException = exports.ClientCreateOrderException = exports.ClientCreateRidderInviteException = exports.ClientCreatePassengerInviteException = exports.ClientCreateSupplyOrderException = exports.ClientCreatePurchaseOrderException = exports.ClientDuplicateFieldDetectedException = exports.ClientSignUpRidderException = exports.ClientSignUpPassengerException = exports.ClientSignInRidderException = exports.ClientSignInPassengerException = exports.ClientCollectionNotFoundException = exports.ClientOrderNotFoundException = exports.ClientSupplyOrderNotFoundException = exports.ClientPurchaseOrderNotFoundException = exports.ClientInviteNotFoundException = exports.ClientRidderNotFoundException = exports.ClientPassengerNotFoundException = exports.ClientUserHasNoAccessException = exports.ClientMissingTokenException = exports.ClientInvalidTokenOrTokenExpiredException = void 0;
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
exports.ClientSignInPassengerException = new common_1.ForbiddenException({
    case: "E-C-200",
    message: "Failed to sign in as a passenger",
});
exports.ClientSignInRidderException = new common_1.ForbiddenException({
    case: "E-C-201",
    message: "Failed to sign in as a ridder",
});
exports.ClientSignUpPassengerException = new common_1.ForbiddenException({
    case: "E-C-202",
    message: "Failed to sign up as a passenger",
});
exports.ClientSignUpRidderException = new common_1.ForbiddenException({
    case: "E-C-203",
    message: "Failed to sign up as a ridder",
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