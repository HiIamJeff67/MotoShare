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
exports.CreateSupplyOrderDto = void 0;
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../decorators");
const price_constant_1 = require("../../constants/price.constant");
const algorithm_constant_1 = require("../../constants/algorithm.constant");
const context_constant_1 = require("../../constants/context.constant");
class CreateSupplyOrderDto {
}
exports.CreateSupplyOrderDto = CreateSupplyOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(context_constant_1.MIN_DESCRIPTION_LENGTH),
    (0, class_validator_1.MaxLength)(context_constant_1.MAX_DESCRIPTION_LENGTH),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplyOrderDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, decorators_1.MinNumberString)(price_constant_1.MIN_INIT_PRICE),
    (0, decorators_1.MaxNumberString)(price_constant_1.MAX_INIT_PRICE),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "initPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "startCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "startCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "endCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "endCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplyOrderDto.prototype, "startAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplyOrderDto.prototype, "endAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSupplyOrderDto.prototype, "startAfter", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSupplyOrderDto.prototype, "endedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.MinNumberString)(algorithm_constant_1.MIN_TOLERABLE_RDV),
    (0, decorators_1.MaxNumberString)(algorithm_constant_1.MAX_TOLERABLE_RDV),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateSupplyOrderDto.prototype, "tolerableRDV", void 0);
//# sourceMappingURL=create-supplyOrder.dto.js.map