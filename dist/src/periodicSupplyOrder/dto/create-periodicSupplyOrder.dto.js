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
exports.CreatePeriodicSupplyOrderDto = void 0;
const class_validator_1 = require("class-validator");
const types_1 = require("../../types");
const validator_1 = require("../../validator");
const constants_1 = require("../../constants");
class CreatePeriodicSupplyOrderDto {
}
exports.CreatePeriodicSupplyOrderDto = CreatePeriodicSupplyOrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(types_1.DaysOfWeekTypes, { message: "The scheduled day should be either Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday" }),
    __metadata("design:type", String)
], CreatePeriodicSupplyOrderDto.prototype, "scheduledDay", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsIntString)(),
    (0, validator_1.MaxNumberString)(constants_1.MAX_INIT_PRICE),
    (0, validator_1.MinNumberString)(constants_1.MIN_INIT_PRICE),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "initPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "startCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "startCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "endCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "endCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeriodicSupplyOrderDto.prototype, "startAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeriodicSupplyOrderDto.prototype, "endAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsStartBeforeEnd)('endedAt'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    (0, validator_1.IsPeriodicDateString)(),
    __metadata("design:type", String)
], CreatePeriodicSupplyOrderDto.prototype, "startAfter", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsEndAfterStart)('startAfter'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    (0, validator_1.IsPeriodicDateString)(),
    __metadata("design:type", String)
], CreatePeriodicSupplyOrderDto.prototype, "endedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, validator_1.MinNumberString)(constants_1.MIN_TOLERABLE_RDV),
    (0, validator_1.MaxNumberString)(constants_1.MAX_TOLERABLE_RDV),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreatePeriodicSupplyOrderDto.prototype, "tolerableRDV", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Boolean)
], CreatePeriodicSupplyOrderDto.prototype, "autoAccept", void 0);
//# sourceMappingURL=create-periodicSupplyOrder.dto.js.map