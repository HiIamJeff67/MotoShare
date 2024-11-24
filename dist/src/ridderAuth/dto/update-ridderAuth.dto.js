"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRidderAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ridderAuth_dto_1 = require("./create-ridderAuth.dto");
class UpdateRidderAuthDto extends (0, mapped_types_1.PartialType)(create_ridderAuth_dto_1.CreateRidderAuthDto) {
}
exports.UpdateRidderAuthDto = UpdateRidderAuthDto;
//# sourceMappingURL=update-ridderAuth.dto.js.map