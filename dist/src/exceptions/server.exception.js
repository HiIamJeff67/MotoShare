"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUnknownException = exports.ServerSupabaseEnvVarNotFoundException = exports.ServerSupabaseConnectionException = exports.ServerNeonEnvVarNotFoundException = exports.ServerNeonConnectionException = exports.ServerAllowedPhoneNumberException = void 0;
const common_1 = require("@nestjs/common");
exports.ServerAllowedPhoneNumberException = new common_1.InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});
exports.ServerNeonConnectionException = new common_1.InternalServerErrorException({
    case: "E-S-800",
    message: "Missing connection to Neon server(powered by postgreSQL database)",
});
exports.ServerNeonEnvVarNotFoundException = new common_1.InternalServerErrorException({
    case: "E-S-801",
    message: "Cannot find some necessary environment variables for connecting to Neon server",
});
exports.ServerSupabaseConnectionException = new common_1.InternalServerErrorException({
    case: "E-S-850",
    message: "Missing connection to Supabase server(powered by postgreSQL database)",
});
exports.ServerSupabaseEnvVarNotFoundException = new common_1.InternalServerErrorException({
    case: "E-S-851",
    message: "Cannot find some necessary environment variables for connecting to Supabase server",
});
exports.ServerUnknownException = new common_1.InternalServerErrorException({
    case: "E-S-999",
    message: "Internal Server Error",
});
//# sourceMappingURL=server.exception.js.map