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
exports.CreatePeriodicPurchaseOrderDto = void 0;
const class_validator_1 = require("class-validator");
const validator_1 = require("../../validator");
const constants_1 = require("../../constants");
const types_1 = require("../../types");
class CreatePeriodicPurchaseOrderDto {
}
exports.CreatePeriodicPurchaseOrderDto = CreatePeriodicPurchaseOrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(types_1.DaysOfWeekTypes, { message: "The scheduled day should be either Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday" }),
    __metadata("design:type", String)
], CreatePeriodicPurchaseOrderDto.prototype, "scheduledDay", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsIntString)(),
    (0, validator_1.MaxNumberString)(constants_1.MAX_INIT_PRICE),
    (0, validator_1.MinNumberString)(constants_1.MIN_INIT_PRICE),
    __metadata("design:type", Number)
], CreatePeriodicPurchaseOrderDto.prototype, "initPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreatePeriodicPurchaseOrderDto.prototype, "startCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreatePeriodicPurchaseOrderDto.prototype, "startCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreatePeriodicPurchaseOrderDto.prototype, "endCordLongitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreatePeriodicPurchaseOrderDto.prototype, "endCordLatitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeriodicPurchaseOrderDto.prototype, "startAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeriodicPurchaseOrderDto.prototype, "endAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsStartBeforeEnd)('endedAt'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    (0, validator_1.IsPeriodicDateString)(),
    __metadata("design:type", String)
], CreatePeriodicPurchaseOrderDto.prototype, "startAfter", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, validator_1.IsEndAfterStart)('startAfter'),
    (0, validator_1.IsAfterNow)(),
    (0, class_validator_1.IsDateString)(),
    (0, validator_1.IsPeriodicDateString)(),
    __metadata("design:type", String)
], CreatePeriodicPurchaseOrderDto.prototype, "endedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Boolean)
], CreatePeriodicPurchaseOrderDto.prototype, "isUrgent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Boolean)
], CreatePeriodicPurchaseOrderDto.prototype, "autoAccept", void 0);
//# sourceMappingURL=create-periodicPurchaseOrder.dto.js.map