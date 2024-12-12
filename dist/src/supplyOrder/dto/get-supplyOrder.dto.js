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
exports.GetBetterSupplyOrderDto = exports.GetSimilarRouteSupplyOrdersDto = exports.GetAdjacentSupplyOrdersDto = exports.GetSimilarTimeSupplyOrderDto = void 0;
const class_validator_1 = require("class-validator");
const validator_1 = require("../../validator");
class GetSimilarTimeSupplyOrderDto {
}
exports.GetSimilarTimeSupplyOrderDto = GetSimilarTimeSupplyOrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsStartBeforeEnd)('endedAt'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetSimilarTimeSupplyOrderDto.prototype, "startAfter", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsEndAfterStart)('startAfter'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetSimilarTimeSupplyOrderDto.prototype, "endedAt", void 0);
class GetAdjacentSupplyOrdersDto {
}
exports.GetAdjacentSupplyOrdersDto = GetAdjacentSupplyOrdersDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], GetAdjacentSupplyOrdersDto.prototype, "cordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], GetAdjacentSupplyOrdersDto.prototype, "cordLatitude", void 0);
class GetSimilarRouteSupplyOrdersDto {
}
exports.GetSimilarRouteSupplyOrdersDto = GetSimilarRouteSupplyOrdersDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], GetSimilarRouteSupplyOrdersDto.prototype, "startCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], GetSimilarRouteSupplyOrdersDto.prototype, "startCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], GetSimilarRouteSupplyOrdersDto.prototype, "endCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], GetSimilarRouteSupplyOrdersDto.prototype, "endCordLatitude", void 0);
class GetBetterSupplyOrderDto {
    get _validateWholeObject() {
        return this;
    }
}
exports.GetBetterSupplyOrderDto = GetBetterSupplyOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.endedAt),
    (0, validator_1.IsStartBeforeEnd)('endedAt'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetBetterSupplyOrderDto.prototype, "startAfter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.startAfter),
    (0, validator_1.IsEndAfterStart)('startAfter'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetBetterSupplyOrderDto.prototype, "endedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], GetBetterSupplyOrderDto.prototype, "startCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], GetBetterSupplyOrderDto.prototype, "startCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], GetBetterSupplyOrderDto.prototype, "endCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], GetBetterSupplyOrderDto.prototype, "endCordLatitude", void 0);
__decorate([
    (0, class_validator_1.Validate)(validator_1.BetterFirstSearchFieldsValidation),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], GetBetterSupplyOrderDto.prototype, "_validateWholeObject", null);
//# sourceMappingURL=get-supplyOrder.dto.js.map