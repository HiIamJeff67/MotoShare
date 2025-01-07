import { BadRequestException, ForbiddenException, InternalServerErrorException, NotAcceptableException, NotFoundException } from "@nestjs/common";

// E-A-001
export const ApiMissingParameterException = new BadRequestException({
    case: "E-A-001",
    message: "Require parameters",
});

// E-A-002
export const ApiMissingBodyOrWrongDtoException = new BadRequestException({
    case: "E-A-002", 
    message: "Require body and customized dto of current route",
});

// E-A-003
export const ApiWrongSearchPriorityTypeException = new BadRequestException({
    case: "E-A-003", 
    message: "searchPriorities should be any combination of 'T', 'R', 'U', 'S', 'D', see more on the note", 
});

// E-A-010
export const ApiSearchingLimitTooLargeException = (maxLimit: number) => {
    return new NotAcceptableException({
        case: "E-A-100",
        message: `Cannot search with the limit greater than ${maxLimit}`
    });
}

// E-A-011
export const ApiSearchingLimitLessThanZeroException = (minLimit: number) => {
    return new NotAcceptableException({
        case: "E-A-011", 
        message: `Cannot search with the limit less than ${minLimit}`
    });
}

// E-A-100
export const ApiPrevOrderIdFormException = new NotAcceptableException({
    case: "E-A-100",
    message: "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2",
});

// E-A-101
export const ApiISOStringFormException = new NotAcceptableException({
    case: "E-A-101", 
    message: "Wrong form of ISO date string when converting it to time only string", 
});

/* ================================= Webhook exception ================================= */
// E-A-200
export const ApiWrongWebhookSignatureException = new NotAcceptableException({
    case: "E-A-200", 
    message: "Wrong webhook signature detected, please provide a valid signature", 
});

// E-A-201
export const ApiEndpointEnvVarNotFoundException = new NotFoundException({
    case: "E-A-201", 
    message: "Cannot find some necessary environment variables for sepecifying endpoint for Stripe webhooks", 
});

// E-A-202
export const ApiStripeWebhookUnhandleExcpetion = new ForbiddenException({
    case: "E-A-202", 
    message: "This request is unhandled due to it is undefined in stripe", 
});
/* ================================= Webhook exception ================================= */


/* ================================= payment exception ================================= */
// E-A-400
export const ApiPaymentIntentNotFinishedException = new ForbiddenException({
    case: "E-A-400", 
    message: "The transaction is not finished, please try again", 
});

// E-A-401
export const ApiNonPositiveAmountDetectedException = new ForbiddenException({
    case: "E-A-401", 
    message: "Detected non-positive amount", 
})
/* ================================= payment exception ================================= */


// E-A-900
export const ApiGeneratingBearerTokenException = new InternalServerErrorException({
    case: "E-A-900",
    message: "Failed to generate a bearer token for current user",
});

// E-A-901
export const ApiGenerateAuthCodeException = new InternalServerErrorException({
    case: "E-A-901", 
    message: "Failed to generate auth code for current user", 
});

// E-A-902
export const ApiSendEmailForValidationException = new InternalServerErrorException({
    case: "E-A-902", 
    message: "Failed to send a email for validation", 
});

// E-A-950
export const ApiMissingUserRoleInHeaderWhileConnectingToSocketException = new InternalServerErrorException({
    case: "E-S-950", 
    message: "Missing userrole field in header while connecting to socket", 
});

// E-A-099
export const ApiUnknownException = new InternalServerErrorException({
    case: "E-A-099", 
    message: "Unknown error occurred",
});


