import { BadRequestException, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";

// E-A-001
export const ApiMissingParameterException = new BadRequestException({
    name: "E-A-001",
    message: "Require parameters",
});

// E-A-002
export const ApiMissingBodyOrWrongDtoException = new BadRequestException({
    name: "E-A-002", 
    message: "Require body and customized dto of current route",
});

// E-A-100
export const ApiPrevOrderIdFormException = new NotAcceptableException({
    name: "E-A-100",
    message: "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2",
});



// E-A-900
export const ApiGeneratingBearerTokenException = new InternalServerErrorException({
    name: "E-A-900",
    message: "Failed to generate a bearer token for current user",
})

// E-A-099
export const ApiUnknownException = new InternalServerErrorException({
    name: "E-A-099", 
    message: "Unknown error occurred",
});


