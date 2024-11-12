import { ConflictException, ForbiddenException, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";

/* ============================== Error about authorized ============================== */

// E-C-001
export const ClientInvalidTokenOrTokenExpiredException = new UnauthorizedException({
    case: "E-C-001",
    message: "Invalid user, or token expired"
});

// this exception is usually covered by JwtGuard
// E-C-002
export const ClientMissingTokenException = new UnauthorizedException({
    case: "E-C-002",
    message: "Unauthorized",
});

// E-C-003
export const ClientUserHasNoAccessException = new UnauthorizedException({
    case: "E-C-003",
    message: "The current user has no access to this method",
});

/* ============================== Error about authorized ============================== */


/* ============================== Error about select operation ============================== */

// E-C-100
export const ClientPassengerNotFoundException = new NotFoundException({
    case: "E-C-100", 
    message: "Cannot find any passengers",
});

// E-C-101
export const ClientRidderNotFoundException = new NotFoundException({
    case: "E-C-101",
    message: "Cannot find any ridders",
})

// E-C-102
export const ClientInviteNotFoundException = new NotFoundException({
    case: "E-C-102", 
    message: "Cannot find any invites",
});

// E-C-103
export const ClientPurchaseOrderNotFoundException = new NotFoundException({
    case: "E-C-103",
    message: "Cannot find any purchaseOrders",
});

// E-C-104
export const ClientSupplyOrderNotFoundException = new NotFoundException({
    case: "E-C-104",
    message: "Cannot find any supplyOrders"
});

// E-C-105
export const ClientOrderNotFoundException = new NotFoundException({
    case: "E-C-105",
    message: "Cannot find any orders",
});

// E-C-106
export const ClientCollectionNotFoundException = new NotFoundException({
    case: "E-C-106",
    message: "Cannot find any collections",
});

/* ============================== Error about select operation ============================== */


/* ============================== Error about create operation ============================== */

// E-C-200
export const ClientSignInPassengerException = new ForbiddenException({
    case: "E-C-200", 
    message: "Failed to sign in as a passenger",
});

// E-C-201
export const ClientSignInRidderException = new ForbiddenException({
    case: "E-C-201",
    message: "Failed to sign in as a ridder",
});

// E-C-202
export const ClientSignUpPassengerException = new ForbiddenException({
    case: "E-C-202",
    message: "Failed to sign up as a passenger",
});

// E-C-203
export const ClientSignUpRidderException = new ForbiddenException({
    case: "E-C-203", 
    message: "Failed to sign up as a ridder",
});

// E-C-204
export const ClientDuplicateFieldDetectedException = (errorMessage: string | undefined) => { 
    return new ConflictException(errorMessage ?? { 
        case: "E-C-204", message: "Duplicate fields detected"
    });
};

// E-C-205
export const ClientCreatePurchaseOrderException = new ForbiddenException({
    case: "E-C-205", 
    message: "Failed to create a purchaseOrder",
});

// E-C-206
export const ClientCreateSupplyOrderException = new ForbiddenException({
    case: "E-C-206",
    message: "Failed to create a suplyOrder",
});

// E-C-207
export const ClientCreatePassengerInviteException = new ForbiddenException({
    case: "E-C-207", 
    message: "Failed to create a passengerInvite",
});

// E-C-208
export const ClientCreateRidderInviteException = new ForbiddenException({
    case: "E-C-208", 
    message: "Faield to create a ridderInvite",
});

// E-C-209
export const ClientCreateOrderException = new ForbiddenException({
    case: "E-C-209", 
    message: "Failed to create an order",
});

/* ============================== Error about create operation ============================== */


/* ============================== Error about update operation ============================== */

// E-C-300
export const ClientNoChangeOnUserNameException = new ConflictException({
    case: "E-C-300",
    message: "There's no changes on userName",
});

// E-C-301
export const ClientNoChangeOnEmailException = new ConflictException({
    case: "E-C-301",
    message: "There's no changes on email",
});

// E-C-302
export const ClientNoChangeOnPasswordException = new ConflictException({
    case: "E-C-302",
    message: "There's no changes on password",
});

/* ============================== Error about update operation ============================== */

// E-C-999
export const ClientUnknownException = new InternalServerErrorException({
    case: "E-C-999", 
    message: "Unknown error occurred",
});
