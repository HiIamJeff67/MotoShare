"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUnknownException = exports.ServerExtractJwtSecretEnvVariableException = exports.ServerSupabaseUploadFileException = exports.ServerSupabaseUploadFileParaNotFoundException = exports.ServerSupabaseEnvVarNotFoundException = exports.ServerSupabaseConnectionException = exports.ServerNeonAutoUpdateExpiredOrderException = exports.ServerNeonautoUpdateExpiredRidderInviteException = exports.ServerNeonAutoUpdateExpiredPassengerInviteException = exports.ServerNeonAutoUpdateExpiredSupplyOrderException = exports.ServerNeonAutoUpdateExpiredPurchaseOrderException = exports.ServerNeonEnvVarNotFoundException = exports.ServerNeonConnectionException = exports.ServerUserNotFoundInSocketMapException = exports.ServerTranslateBearerTokenToPayloadException = exports.ServerAllowedPhoneNumberException = void 0;
const common_1 = require("@nestjs/common");
exports.ServerAllowedPhoneNumberException = new common_1.InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});
exports.ServerTranslateBearerTokenToPayloadException = new common_1.InternalServerErrorException({
    case: "E-S-700",
    message: "Failed to translate bearer token to payload",
});
exports.ServerUserNotFoundInSocketMapException = new common_1.NotFoundException({
    case: "E-S-701",
    message: "Cannot find any user(included Passengers and Ridders) in socket map",
});
exports.ServerNeonConnectionException = new common_1.InternalServerErrorException({
    case: "E-S-800",
    message: "Missing connection to Neon server(powered by postgreSQL database)",
});
exports.ServerNeonEnvVarNotFoundException = new common_1.InternalServerErrorException({
    case: "E-S-801",
    message: "Cannot find some necessary environment variables for connecting to Neon server",
});
exports.ServerNeonAutoUpdateExpiredPurchaseOrderException = new common_1.InternalServerErrorException({
    case: "E-S-810",
    message: "Failed to update expired purchaseOrders before user get them",
});
exports.ServerNeonAutoUpdateExpiredSupplyOrderException = new common_1.InternalServerErrorException({
    case: "E-S-811",
    message: "Failed to update expired supplyOrders before user get them",
});
exports.ServerNeonAutoUpdateExpiredPassengerInviteException = new common_1.InternalServerErrorException({
    case: "E-S-812",
    message: "Faild to update expired passengerInvites before user get them",
});
exports.ServerNeonautoUpdateExpiredRidderInviteException = new common_1.InternalServerErrorException({
    case: "E-S-813",
    message: "Failed to update expired ridderInvites before user get them",
});
exports.ServerNeonAutoUpdateExpiredOrderException = new common_1.InternalServerErrorException({
    case: "E-S-814",
    message: "Failed to update start status of orders before user get them",
});
exports.ServerSupabaseConnectionException = new common_1.InternalServerErrorException({
    case: "E-S-850",
    message: "Missing connection to Supabase server(powered by postgreSQL database)",
});
exports.ServerSupabaseEnvVarNotFoundException = new common_1.InternalServerErrorException({
    case: "E-S-851",
    message: "Cannot find some necessary environment variables for connecting to Supabase server",
});
exports.ServerSupabaseUploadFileParaNotFoundException = new common_1.InternalServerErrorException({
    case: "E-S-852",
    message: "Missing parameters while uploading file to Supabase server",
});
const ServerSupabaseUploadFileException = (message) => {
    return new common_1.InternalServerErrorException({
        case: "E-S-853",
        message: `Failed to upload file to Supabase storage${message ? `: ${message}` : ""}`,
    });
};
exports.ServerSupabaseUploadFileException = ServerSupabaseUploadFileException;
exports.ServerExtractJwtSecretEnvVariableException = new common_1.InternalServerErrorException({
    case: "E-S-900",
    message: "Failed to extract the required environment variable JWT_SECRET",
});
exports.ServerUnknownException = new common_1.InternalServerErrorException({
    case: "E-S-999",
    message: "Internal Server Error",
});
//# sourceMappingURL=server.exception.js.map