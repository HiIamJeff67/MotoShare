import { InternalServerErrorException } from "@nestjs/common"

// E-S-099
export const ServerUnknownError = new InternalServerErrorException({
    name: "E-S-099", 
    message: "Internal Server Error",
})

