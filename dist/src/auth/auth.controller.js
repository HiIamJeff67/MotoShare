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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signUp_dto_1 = require("./dto/signUp.dto");
const axios_1 = require("axios");
const signIn_dto_1 = require("./dto/signIn.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUpPassengerWithEmailAndPassword(signUpDto, response) {
        try {
            if (signUpDto.userName && signUpDto.userName.length > 20) {
                throw {
                    name: "userNameTooLong",
                    message: "User name cannot be longer than 20 characters"
                };
            }
            const passengerResponse = await this.authService.signUpPassengerWithEmailAndPassword(signUpDto);
            response.status(axios_1.HttpStatusCode.Created).send({
                ...passengerResponse,
            });
        }
        catch (error) {
            response.status(axios_1.HttpStatusCode.BadRequest).send({
                message: error.message,
            });
            const duplicateField = error.constraint.split("_")[1];
            response.status(axios_1.HttpStatusCode.Conflict).send({
                message: `Duplicate ${duplicateField} detected`,
            });
        }
    }
    async signInPassengerWithAccountAndPassword(signInDto, response) {
        try {
            if (signInDto.userName && signInDto.userName.length > 20) {
                throw {
                    name: "userNameTooLong",
                    message: "User name cannot be longer than 20 characters"
                };
            }
            const passengerRespose = await this.authService.signInPassengerEmailAndPassword(signInDto);
            response.status(axios_1.HttpStatusCode.Ok).send({
                ...passengerRespose,
            });
        }
        catch (error) {
            response.status(axios_1.HttpStatusCode.BadRequest).send({
                message: error.message,
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signUpPassenger'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUp_dto_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpPassengerWithEmailAndPassword", null);
__decorate([
    (0, common_1.Post)('signInPassenger'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInPassengerWithAccountAndPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map