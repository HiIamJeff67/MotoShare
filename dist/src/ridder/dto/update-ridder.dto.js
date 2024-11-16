"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRidderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ridder_dto_1 = require("./create-ridder.dto");
class UpdateRidderDto extends (0, mapped_types_1.PartialType)(create_ridder_dto_1.CreateRidderDto) {
}
exports.UpdateRidderDto = UpdateRidderDto;
//# sourceMappingURL=update-ridder.dto.js.map