"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePassengerAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_passengerAuth_dto_1 = require("./create-passengerAuth.dto");
class UpdatePassengerAuthDto extends (0, mapped_types_1.PartialType)(create_passengerAuth_dto_1.CreatePassengerAuthDto) {
}
exports.UpdatePassengerAuthDto = UpdatePassengerAuthDto;
//# sourceMappingURL=update-passengerAuth.dto.js.map