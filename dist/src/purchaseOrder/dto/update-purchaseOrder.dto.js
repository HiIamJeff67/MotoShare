"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePurchaseOrderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_purchaseOrder_dto_1 = require("./create-purchaseOrder.dto");
class UpdatePurchaseOrderDto extends (0, mapped_types_1.PartialType)(create_purchaseOrder_dto_1.CreatePurchaseOrderDto) {
}
exports.UpdatePurchaseOrderDto = UpdatePurchaseOrderDto;
//# sourceMappingURL=update-purchaseOrder.dto.js.map