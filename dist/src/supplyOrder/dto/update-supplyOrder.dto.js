"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupplyOrderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const create_supplyOrder_dto_1 = require("./create-supplyOrder.dto");
const status_interface_1 = require("../../../src/interfaces/status.interface");
class UpdateSupplyOrderDto extends (0, mapped_types_1.PartialType)(create_supplyOrder_dto_1.CreateSupplyOrderDto) {
}
exports.UpdateSupplyOrderDto = UpdateSupplyOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(status_interface_1.PostedStatusTypes, { message: "The status of SupplyOrder must be either POSTED, EXPIRED, or CANCEL" }),
    __metadata("design:type", String)
], UpdateSupplyOrderDto.prototype, "status", void 0);
//# sourceMappingURL=update-supplyOrder.dto.js.map