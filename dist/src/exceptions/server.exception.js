"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerUnknownException = exports.ServerAllowedPhoneNumberException = void 0;
const common_1 = require("@nestjs/common");
exports.ServerAllowedPhoneNumberException = new common_1.InternalServerErrorException({
    case: "E-S-001",
    messaage: "Specifying not allowed phone number on IsPhoneNumberString decorator",
});
exports.ServerUnknownException = new common_1.InternalServerErrorException({
    case: "E-S-999",
    message: "Internal Server Error",
});
//# sourceMappingURL=server.exception.js.map