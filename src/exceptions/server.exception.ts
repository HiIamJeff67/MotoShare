import { InternalServerErrorException } from "@nestjs/common"

// E-S-099
export const ServerUnknownError = new InternalServerErrorException({
    case: "E-S-099", 
    message: "Internal Server Error",
})

