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
exports.BindPassengerGoogleAuthDto = exports.BindPassengerDefaultAuthDto = exports.UpdatePassengerEmailPasswordDto = exports.ResetPassengerPasswordDto = exports.ValidatePassengerInfoDto = void 0;
const class_validator_1 = require("class-validator");
const create_passengerAuth_dto_1 = require("./create-passengerAuth.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class ValidatePassengerInfoDto {
}
exports.ValidatePassengerInfoDto = ValidatePassengerInfoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePassengerInfoDto.prototype, "authCode", void 0);
class ResetPassengerPasswordDto {
}
exports.ResetPassengerPasswordDto = ResetPassengerPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResetPassengerPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPassengerPasswordDto.prototype, "authCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)(undefined, { message: "E-C-007" }),
    __metadata("design:type", String)
], ResetPassengerPasswordDto.prototype, "password", void 0);
class UpdatePassengerEmailPasswordDto extends (0, mapped_types_1.PartialType)(create_passengerAuth_dto_1.CreatePassengerEmailPasswordDto) {
}
exports.UpdatePassengerEmailPasswordDto = UpdatePassengerEmailPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePassengerEmailPasswordDto.prototype, "authCode", void 0);
class BindPassengerDefaultAuthDto {
}
exports.BindPassengerDefaultAuthDto = BindPassengerDefaultAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(undefined, { message: "E-C-006" }),
    __metadata("design:type", String)
], BindPassengerDefaultAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)(undefined, { message: "E-C-007" }),
    __metadata("design:type", String)
], BindPassengerDefaultAuthDto.prototype, "password", void 0);
class BindPassengerGoogleAuthDto {
}
exports.BindPassengerGoogleAuthDto = BindPassengerGoogleAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BindPassengerGoogleAuthDto.prototype, "idToken", void 0);
//# sourceMappingURL=update-passengerAuth.dto.js.map