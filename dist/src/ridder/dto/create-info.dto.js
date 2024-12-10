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
exports.CreateRidderInfoDto = void 0;
const class_validator_1 = require("class-validator");
const validator_1 = require("../../validator");
const info_constant_1 = require("../../constants/info.constant");
const context_constant_1 = require("../../constants/context.constant");
const IsPhoneNumberString_validator_1 = require("../../validator/IsPhoneNumberString.validator");
const types_1 = require("../../types");
class CreateRidderInfoDto {
}
exports.CreateRidderInfoDto = CreateRidderInfoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Boolean)
], CreateRidderInfoDto.prototype, "isOnline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, validator_1.IsIntString)(),
    (0, validator_1.MinNumberString)(info_constant_1.MIN_AGE),
    (0, validator_1.MaxNumberString)(info_constant_1.MAX_AGE),
    __metadata("design:type", Number)
], CreateRidderInfoDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, IsPhoneNumberString_validator_1.IsPhoneNumberString)("+886", types_1.AllowedPhoneNumberTypes),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CreateRidderInfoDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, IsPhoneNumberString_validator_1.IsPhoneNumberString)("+886", types_1.AllowedPhoneNumberTypes),
    (0, validator_1.IsNotEqualTo)("phoneNumber"),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CreateRidderInfoDto.prototype, "emergencyPhoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(context_constant_1.MIN_SELF_INTRODUCTION_LENGTH),
    (0, class_validator_1.MaxLength)(context_constant_1.MAX_SELF_INTRODUCTION_LENGTH),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRidderInfoDto.prototype, "selfIntroduction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, validator_1.IsLooseTWLicenseString)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRidderInfoDto.prototype, "motocycleLicense", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRidderInfoDto.prototype, "motocycleType", void 0);
//# sourceMappingURL=create-info.dto.js.map