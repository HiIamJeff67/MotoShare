import { InternalServerErrorException } from "@nestjs/common"

// E-S-001
export const ServerAllowedPhoneNumberException = new InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});

// E-S-999
export const ServerUnknownException = new InternalServerErrorException({
    case: "E-S-999", 
    message: "Internal Server Error",
});

