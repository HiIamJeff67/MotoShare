import { InternalServerErrorException, NotFoundException } from "@nestjs/common"

// private type
type AdminFieldType = 
    "passengerAdmin's userName" | "passengerAdmin's email" | "passengerAdmin's password" | "passengerAdmin's userName or email" |
    "ridderAdmin's userName"    | "ridderAdmin's email"    | "ridderAdmin's password"    | "ridderAdmin's userName or email"    ;

// E-S-001
export const ServerAllowedPhoneNumberException = new InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});

// E-S-700
export const ServerTranslateBearerTokenToPayloadException = new InternalServerErrorException({
    case: "E-S-700", 
    message: "Failed to translate bearer token to payload", 
});

// E-S-701
export const ServerUserNotFoundInSocketMapException = new NotFoundException({
    case: "E-S-701", 
    message: "Cannot find any user(included Passengers and Ridders) in socket map", 
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
export const ServerNeonAutoUpdateExpiredPassengerInviteException = new InternalServerErrorException({
    case: "E-S-812", 
    message: "Faild to update expired passengerInvites before user get them", 
});

// E-S-813
export const ServerNeonautoUpdateExpiredRidderInviteException = new InternalServerErrorException({
    case: "E-S-813", 
    message: "Failed to update expired ridderInvites before user get them", 
});

// E-S-814
export const ServerNeonAutoUpdateExpiredOrderException = new InternalServerErrorException({
    case: "E-S-814",
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
export const ServerSupabaseUploadFileException = (message?: string) => { 
    return new InternalServerErrorException({
        case: "E-S-853",
        message: `Failed to upload file to Supabase storage${message ? `: ${message}` : ""}`,
    })
};

// E-S-900
export const ServerExtractJwtSecretEnvVariableException = new InternalServerErrorException({
    case: "E-S-900", 
    message: "Failed to extract the required environment variable JWT_SECRET", 
});

// E-S-901
export const ServerExtractCronSecretEnvVariableException = new InternalServerErrorException({
    case: "E-S-901", 
    message: "Failed to extract the cron secret environment variable CRON_SECRET", 
});

// E-S-902
export const ServerExtractAdminAccountEnvVariableException = (field: AdminFieldType | undefined = undefined) => { 
    return new InternalServerErrorException({
        case: "E-S-902", 
        message: field === undefined 
            ? `Failed to extract the environment variable ${field}` 
            : "Unknown error while verify admin account", 
    });
}

// E-S-999
export const ServerUnknownException = new InternalServerErrorException({
    case: "E-S-999", 
    message: "Internal Server Error",
});

