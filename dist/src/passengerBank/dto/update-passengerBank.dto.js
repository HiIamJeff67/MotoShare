"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePassengerBankDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_passengerBank_dto_1 = require("./create-passengerBank.dto");
class UpdatePassengerBankDto extends (0, mapped_types_1.PartialType)(create_passengerBank_dto_1.CreatePassengerBankDto) {
}
exports.UpdatePassengerBankDto = UpdatePassengerBankDto;
//# sourceMappingURL=update-passengerBank.dto.js.map