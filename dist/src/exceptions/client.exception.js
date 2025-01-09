"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCreateRidderAuthException = exports.ClientCreatePassengerAuthException = exports.ClientCreateHistoryException = exports.ClientCreateRidderCollectionException = exports.ClientCreatePassengerCollectionException = exports.ClientCreateRidderInfoException = exports.ClientCreatePassengerInfoException = exports.ClientCreateOrderException = exports.ClientCreateRidderInviteException = exports.ClientCreatePassengerInviteException = exports.ClientCreateSupplyOrderException = exports.ClientCreatePurchaseOrderException = exports.ClientDuplicateFieldDetectedException = exports.ClientSignUpUserException = exports.ClientSignInPasswordNotMatchException = exports.ClientSignInUserException = exports.ClientRidderBankNotFoundException = exports.ClientPassengerBankNotFoundException = exports.ClientRidderAuthNotFoundException = exports.ClientPassengerAuthNotFoundException = exports.ClientRidderRecordNotFoundException = exports.ClientPassengerRecordNotFoundException = exports.ClientPeriodicSupplyOrderNotFoundException = exports.ClientPeriodicPurchaseOrderNotFoundException = exports.ClientRidderPreferenceNotFoundException = exports.ClientPassengerPreferenceNotFoundException = exports.ClientRidderNotificationNotFoundException = exports.ClientPassengerNotificationNotFoundException = exports.ClientHistoryNotFoundException = exports.ClientSignInEmailNotFoundException = exports.ClientSignInUserNameNotFoundException = exports.ClientCollectionNotFoundException = exports.ClientOrderNotFoundException = exports.ClientSupplyOrderNotFoundException = exports.ClientPurchaseOrderNotFoundException = exports.ClientInviteNotFoundException = exports.ClientRidderNotFoundException = exports.ClientPassengerNotFoundException = exports.ClientWithoutGoogleAuthenticatedException = exports.ClientWithoutDefaultAuthenticatedException = exports.ClientInvalidGoogleIdTokenException = exports.ClientUserAuthenticatedMethodNotAllowedException = exports.ClientWithoutAdvanceAuthorizedUserException = exports.ClientDeleteAccountPasswordNotMatchException = exports.ClientOldPasswordNotMatchException = exports.ClientAuthCodeExpiredException = exports.ClientAuthCodeNotPairException = exports.ClientUserHasNoAccessException = exports.ClientTokenExpiredException = exports.ClientInvalidTokenException = void 0;
exports.ClientUnknownException = exports.ClientOrderStatusNotAllowedToPayException = exports.ClientRidderBalanceNotEnoughtException = exports.ClientPassengerBalanceNotEnoughException = exports.ClientUploadFileMimeTypeException = exports.ClientUploadFileExceedException = exports.ClientEndBeforeStartException = exports.ClientUserGoogleAuthAlreadyBoundException = exports.ClientUserDefaultAuthAlreadyBoundException = exports.ClientNoChangeOnPasswordException = exports.ClientNoChangeOnEmailException = exports.ClientNoChangeOnUserNameException = exports.ClientCreateRidderBankException = exports.ClientCreatePassengerBankException = exports.ClientCalculateRidderAverageStarRatingException = exports.ClientCalculatePassengerAverageStarRatingException = exports.ClientMaintainSearchRecordsException = exports.ClientStoreSearchRecordsException = exports.ClientCreateRidderRecordException = exports.ClientCreatePassengerRecordException = exports.ClientCreatePeriodicSupplyOrderException = exports.ClientCreatePeriodicPurchaseOrderException = exports.ClientCreateRidderPreferenceException = exports.ClientCreatePassengerPreferenceException = exports.ClientCreateRidderNotificationException = exports.ClientCreatePassengerNotificationException = void 0;
const common_1 = require("@nestjs/common");
exports.ClientInvalidTokenException = new common_1.UnauthorizedException({
    case: "E-C-001",
    message: "Invalid token detected"
});
exports.ClientTokenExpiredException = new common_1.UnauthorizedException({
    case: "E-C-002",
    message: "Expired token detected",
});
exports.ClientUserHasNoAccessException = new common_1.UnauthorizedException({
    case: "E-C-003",
    message: "The current user has no access to this method",
});
exports.ClientAuthCodeNotPairException = new common_1.NotAcceptableException({
    case: "E-C-010",
    message: "The given authCode is not match",
});
exports.ClientAuthCodeExpiredException = new common_1.NotAcceptableException({
    case: "E-C-011",
    message: "The authCode has expired, please generate another one",
});
exports.ClientOldPasswordNotMatchException = new common_1.NotAcceptableException({
    case: "E-C-012",
    message: "Cannot update new password due to the old password not matching",
});
exports.ClientDeleteAccountPasswordNotMatchException = new common_1.NotAcceptableException({
    case: "E-C-013",
    message: "Cannot delete the account due to the given password not matching",
});
exports.ClientWithoutAdvanceAuthorizedUserException = new common_1.UnauthorizedException({
    case: "E-C-014",
    message: "The user cannot continue the services without email authenticated",
});
exports.ClientUserAuthenticatedMethodNotAllowedException = new common_1.UnauthorizedException({
    case: "E-C-015",
    message: "The user cannot use this method to authenticate",
});
exports.ClientInvalidGoogleIdTokenException = new common_1.UnauthorizedException({
    case: "E-C-016",
    message: "Invalid google id token detected",
});
exports.ClientWithoutDefaultAuthenticatedException = new common_1.UnauthorizedException({
    case: "E-C-017",
    message: "The user cannot continue the services without default authenticated",
});
exports.ClientWithoutGoogleAuthenticatedException = new common_1.UnauthorizedException({
    case: "E-C-018",
    message: "The user cannot continue the services without google authenticated",
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
exports.ClientHistoryNotFoundException = new common_1.NotFoundException({
    case: "E-C-109",
    message: "Failed to find any histories",
});
exports.ClientPassengerNotificationNotFoundException = new common_1.NotFoundException({
    case: "E-C-110",
    message: "Failed to find any passengerNotifications",
});
exports.ClientRidderNotificationNotFoundException = new common_1.NotFoundException({
    case: "E-C-111",
    message: "Failed to find any ridderNotifications",
});
exports.ClientPassengerPreferenceNotFoundException = new common_1.NotFoundException({
    case: "E-C-112",
    message: "Failed to find any passengerPreferences",
});
exports.ClientRidderPreferenceNotFoundException = new common_1.NotFoundException({
    case: "E-C-113",
    message: "Failed to find any ridderPreferences",
});
exports.ClientPeriodicPurchaseOrderNotFoundException = new common_1.NotFoundException({
    case: "E-C-114",
    message: "Failed to find any periodicPurchaseOrders",
});
exports.ClientPeriodicSupplyOrderNotFoundException = new common_1.NotFoundException({
    case: "E-C-115",
    message: "Failed to find any periodicSupplyOrders",
});
exports.ClientPassengerRecordNotFoundException = new common_1.NotFoundException({
    case: "E-C-116",
    message: "Failed to find any passengerRecords",
});
exports.ClientRidderRecordNotFoundException = new common_1.NotFoundException({
    case: "E-C-117",
    message: "Failed to find any ridderRecords",
});
exports.ClientPassengerAuthNotFoundException = new common_1.NotFoundException({
    case: "E-C-118",
    message: "Failed to find any passengerAuths",
});
exports.ClientRidderAuthNotFoundException = new common_1.NotFoundException({
    case: "E-C-119",
    message: "Failed to find any ridderAuths",
});
exports.ClientPassengerBankNotFoundException = new common_1.NotFoundException({
    case: "E-C-120",
    message: "Failed to find any passengerBanks",
});
exports.ClientRidderBankNotFoundException = new common_1.NotFoundException({
    case: "E-C-121",
    message: "Failed to find any ridderBanks",
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
exports.ClientCreateHistoryException = new common_1.ForbiddenException({
    case: "E-C-214",
    message: "Failed to create a history",
});
exports.ClientCreatePassengerAuthException = new common_1.ForbiddenException({
    case: "E-C-215",
    message: "Failed to create a passengerAuth",
});
exports.ClientCreateRidderAuthException = new common_1.ForbiddenException({
    case: "E-C-216",
    message: "Failed to create a ridderAuth",
});
exports.ClientCreatePassengerNotificationException = new common_1.ForbiddenException({
    case: "E-C-217",
    message: "Failed to create a passengerNotification",
});
exports.ClientCreateRidderNotificationException = new common_1.ForbiddenException({
    case: "E-C-218",
    message: "Failed to create a ridderNotification",
});
exports.ClientCreatePassengerPreferenceException = new common_1.ForbiddenException({
    case: "E-C-219",
    message: "Failed to create a passengerPreference",
});
exports.ClientCreateRidderPreferenceException = new common_1.ForbiddenException({
    case: "E-C-220",
    message: "Failed to create a ridderPreference",
});
exports.ClientCreatePeriodicPurchaseOrderException = new common_1.ForbiddenException({
    case: "E-C-221",
    message: "Failed to create a periodicPurchaseOrder",
});
exports.ClientCreatePeriodicSupplyOrderException = new common_1.ForbiddenException({
    case: "E-C-222",
    message: "Failed to create a periodSupplyOrder",
});
exports.ClientCreatePassengerRecordException = new common_1.ForbiddenException({
    case: "E-C-223",
    message: "Failed to create a passengerRecord",
});
exports.ClientCreateRidderRecordException = new common_1.ForbiddenException({
    case: "E-C-224",
    message: "Failed to create a ridderRecord",
});
exports.ClientStoreSearchRecordsException = new common_1.ForbiddenException({
    case: "E-C-225",
    message: "Failed to store searchRecords",
});
exports.ClientMaintainSearchRecordsException = new common_1.ForbiddenException({
    case: "E-C-226",
    message: "Failed to maintain searchRecords",
});
exports.ClientCalculatePassengerAverageStarRatingException = new common_1.ForbiddenException({
    case: "E-C-227",
    message: "Failed to calculate the average starRating of some passenger",
});
exports.ClientCalculateRidderAverageStarRatingException = new common_1.ForbiddenException({
    case: "E-C-228",
    message: "Failed to calculate the average starRating of some ridder",
});
exports.ClientCreatePassengerBankException = new common_1.ForbiddenException({
    case: "E-C-229",
    message: "Failed to create a passengerBank",
});
exports.ClientCreateRidderBankException = new common_1.ForbiddenException({
    case: "E-C-230",
    message: "Failed to create a ridderBank",
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
exports.ClientUserDefaultAuthAlreadyBoundException = new common_1.ConflictException({
    case: "E-C-303",
    message: "The current user has already bound his/her default authentication",
});
exports.ClientUserGoogleAuthAlreadyBoundException = new common_1.ConflictException({
    case: "E-C-304",
    message: "The current user has already bound his/her google authentication",
});
exports.ClientEndBeforeStartException = new common_1.ConflictException({
    case: "E-C-351",
    message: "The end time is earlier than the start time",
});
const ClientUploadFileExceedException = (maxSize, unit) => {
    return new common_1.NotAcceptableException({
        case: "E-C-352",
        message: `The size of uploaded file should be within ${maxSize}${unit}`,
    });
};
exports.ClientUploadFileExceedException = ClientUploadFileExceedException;
const ClientUploadFileMimeTypeException = (validMimeType) => {
    return new common_1.NotAcceptableException({
        case: "E-C-353",
        message: `The (mime)type of uploaded file should be ${validMimeType}`,
    });
};
exports.ClientUploadFileMimeTypeException = ClientUploadFileMimeTypeException;
exports.ClientPassengerBalanceNotEnoughException = new common_1.NotAcceptableException({
    case: "E-C-400",
    message: "Passenger doesn't have enough balance to pay",
});
exports.ClientRidderBalanceNotEnoughtException = new common_1.NotAcceptableException({
    case: "E-C-401",
    message: "Ridder doesn't have enough balance to pay",
});
exports.ClientOrderStatusNotAllowedToPayException = new common_1.NotAcceptableException({
    case: "E-C-402",
    message: "Pay operation in Order not allowed, it is only allowed if the passengerStatus is UNPAID, or the ridderStatus is UNPAID",
});
exports.ClientUnknownException = new common_1.InternalServerErrorException({
    case: "E-C-999",
    message: "Unknown error occurred",
});
//# sourceMappingURL=client.exception.js.map