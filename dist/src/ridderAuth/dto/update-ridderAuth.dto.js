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
exports.BindRidderGoogleAuthDto = exports.BindRidderDefaultAuthDto = exports.UpdateRidderEmailPasswordDto = exports.ResetRidderPasswordDto = exports.ValidateRidderInfoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ridderAuth_dto_1 = require("./create-ridderAuth.dto");
const class_validator_1 = require("class-validator");
class ValidateRidderInfoDto {
}
exports.ValidateRidderInfoDto = ValidateRidderInfoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateRidderInfoDto.prototype, "authCode", void 0);
class ResetRidderPasswordDto {
}
exports.ResetRidderPasswordDto = ResetRidderPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetRidderPasswordDto.prototype, "authCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)(undefined, { message: "E-C-007" }),
    __metadata("design:type", String)
], ResetRidderPasswordDto.prototype, "password", void 0);
class UpdateRidderEmailPasswordDto extends (0, mapped_types_1.PartialType)(create_ridderAuth_dto_1.CreateRidderEmailPasswordDto) {
}
exports.UpdateRidderEmailPasswordDto = UpdateRidderEmailPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRidderEmailPasswordDto.prototype, "authCode", void 0);
class BindRidderDefaultAuthDto {
}
exports.BindRidderDefaultAuthDto = BindRidderDefaultAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(undefined, { message: "E-C-006" }),
    __metadata("design:type", String)
], BindRidderDefaultAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)(undefined, { message: "E-C-007" }),
    __metadata("design:type", String)
], BindRidderDefaultAuthDto.prototype, "password", void 0);
class BindRidderGoogleAuthDto {
}
exports.BindRidderGoogleAuthDto = BindRidderGoogleAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BindRidderGoogleAuthDto.prototype, "idToken", void 0);
//# sourceMappingURL=update-ridderAuth.dto.js.map