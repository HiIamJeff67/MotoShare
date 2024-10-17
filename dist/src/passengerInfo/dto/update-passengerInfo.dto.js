"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePassengerInfoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_passengerInfo_dto_1 = require("./create-passengerInfo.dto");
class UpdatePassengerInfoDto extends (0, mapped_types_1.PartialType)(create_passengerInfo_dto_1.CreatePassengerInfoDto) {
}
exports.UpdatePassengerInfoDto = UpdatePassengerInfoDto;
//# sourceMappingURL=update-passengerInfo.dto.js.map