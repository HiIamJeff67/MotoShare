import { BadRequestException, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";

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


