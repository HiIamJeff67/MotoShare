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
exports.GoogleSignInDto = exports.SignInDto = void 0;
const class_validator_1 = require("class-validator");
const validator_1 = require("../../validator");
class SignInDto {
}
exports.SignInDto = SignInDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Validate)(validator_1.CustomTextLength, [3, 20], { message: "E-C-004" }),
    (0, class_validator_1.IsAlphanumeric)(undefined, { message: "E-C-005" }),
    __metadata("design:type", String)
], SignInDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.userName),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(undefined, { message: "E-C-006" }),
    __metadata("design:type", String)
], SignInDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)(undefined, { message: "E-C-007" }),
    __metadata("design:type", String)
], SignInDto.prototype, "password", void 0);
class GoogleSignInDto {
}
exports.GoogleSignInDto = GoogleSignInDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleSignInDto.prototype, "idToken", void 0);
//# sourceMappingURL=signIn.dto.js.map