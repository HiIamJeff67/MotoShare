import { InternalServerErrorException } from "@nestjs/common"

// E-S-001
export const ServerAllowedPhoneNumberException = new InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});

// E-S-800
export const ServerNeonConnectionException = new InternalServerErrorException({
    case: "E-S-800",
    message: "Missing connection to Neon server(powered by postgreSQL database)",
});

// E-S-801
export const ServerNeonEnvVarNotFoundException = new InternalServerErrorException({
    case: "E-S-801",
    message: "Cannot find some necessary environment variables for connecting to Neon server",
});

// E-S-810
export const ServerNeonAutoUpdateExpiredPurchaseOrderException = new InternalServerErrorException({
    case: "E-S-810",
    message: "Failed to update expired purchaseOrders before user get them",
});

// E-S-811
export const ServerNeonAutoUpdateExpiredSupplyOrderException = new InternalServerErrorException({
    case: "E-S-811",
    message: "Failed to update expired supplyOrders before user get them",
});

// E-S-812
export const ServerNeonAutoUpdateExpiredOrderException = new InternalServerErrorException({
    case: "E-S-812",
    message: "Failed to update start status of orders before user get them",
});

// E-S-850
export const ServerSupabaseConnectionException = new InternalServerErrorException({
    case: "E-S-850",
    message: "Missing connection to Supabase server(powered by postgreSQL database)",
});

// E-S-851
export const ServerSupabaseEnvVarNotFoundException = new InternalServerErrorException({
    case: "E-S-851",
    message: "Cannot find some necessary environment variables for connecting to Supabase server",
})

// E-S-852
export const ServerSupabaseUploadFileParaNotFoundException = new InternalServerErrorException({
    case: "E-S-852",
    message: "Missing parameters while uploading file to Supabase server",
});

// E-S-853
export const ServerSupabaseUploadFileException = new InternalServerErrorException({
    case: "E-S-853",
    message: "Failed to upload file to Supabase storage",
})

// E-S-999
export const ServerUnknownException = new InternalServerErrorException({
    case: "E-S-999", 
    message: "Internal Server Error",
});

