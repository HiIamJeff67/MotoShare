import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

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

// E-A-099
export const ApiUnknownException = new InternalServerErrorException({
    name: "E-A-099", 
    message: "Unknown error occurred",
});


