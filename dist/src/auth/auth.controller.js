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
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const index_1 = require("./dto/index");
const exceptions_1 = require("../exceptions");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUpPassengerWithEmailAndPassword(signUpDto, response) {
        try {
            const res = await this.authService.signUpPassengerWithEmailAndPassword(signUpDto);
            if (!res)
                throw exceptions_1.ClientSignUpUserException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send(res);
        }
        catch (error) {
            if (error.status === undefined) {
                error = (0, exceptions_1.ClientDuplicateFieldDetectedException)(error.message);
            }
            else if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async signUpRidderWithEmailAndPassword(signUpDto, response) {
        try {
            const res = await this.authService.signUpRidderWithEmailAndPassword(signUpDto);
            if (!res)
                throw exceptions_1.ClientSignUpUserException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send(res);
        }
        catch (error) {
            if (error instanceof common_1.InternalServerErrorException) {
                error = (0, exceptions_1.ClientDuplicateFieldDetectedException)(error.message);
            }
            else if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async signInPassengerWithAccountAndPassword(signInDto, response) {
        try {
            const res = await this.authService.signInPassengerEmailAndPassword(signInDto);
            if (!res)
                throw exceptions_1.ClientSignInUserException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.ForbiddenException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async signInRidderWithAccountAndPassword(signInDto, response) {
        try {
            const res = await this.authService.signInRidderByEmailAndPassword(signInDto);
            if (!res)
                throw exceptions_1.ClientSignInUserException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.ForbiddenException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
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
    __metadata("design:paramtypes", [index_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpPassengerWithEmailAndPassword", null);
__decorate([
    (0, common_1.Post)('signUpRidder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpRidderWithEmailAndPassword", null);
__decorate([
    (0, common_1.Post)('signInPassenger'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInPassengerWithAccountAndPassword", null);
__decorate([
    (0, common_1.Post)('signInRidder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInRidderWithAccountAndPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map