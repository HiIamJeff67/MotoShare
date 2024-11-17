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

// E-S-999
export const ServerUnknownException = new InternalServerErrorException({
    case: "E-S-999", 
    message: "Internal Server Error",
});

