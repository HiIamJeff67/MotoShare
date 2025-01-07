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
exports.RidderAuthController = void 0;
const common_1 = require("@nestjs/common");
const ridderAuth_service_1 = require("./ridderAuth.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const update_ridderAuth_dto_1 = require("./dto/update-ridderAuth.dto");
const create_ridderAuth_dto_1 = require("./dto/create-ridderAuth.dto");
let RidderAuthController = class RidderAuthController {
    constructor(ridderAuthService) {
        this.ridderAuthService = ridderAuthService;
    }
    async sendAuthCodeForEmail(ridder, response) {
        try {
            const res = await this.ridderAuthService.sendAuthenticationCodeById(ridder.id, "Vaildate Your Email");
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.InternalServerErrorException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async sendAuthCodeToResetForgottenPassword(sendAuthCodeByEmailDto, response) {
        try {
            const res = await this.ridderAuthService.sendAuthenticationCodeByEmail(sendAuthCodeByEmailDto.email, "Reset Your Password");
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.InternalServerErrorException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async sendAuthCodeToResetEmailOrPassword(ridder, response) {
        try {
            const res = await this.ridderAuthService.sendAuthenticationCodeById(ridder.id, "Reset Your Email or Password");
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.InternalServerErrorException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getMyAuth(ridder, response) {
        try {
            const res = await this.ridderAuthService.getRidderAuthByUserId(ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderAuthNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async validateAuthCodeForEmail(ridder, validateRidderInfoDto, response) {
        try {
            const res = await this.ridderAuthService.validateAuthCodeForEmail(ridder.id, validateRidderInfoDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.InternalServerErrorException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async validateAuthCodeToResetForgottenPassword(resetRidderPasswordDto, response) {
        try {
            const res = await this.ridderAuthService.validateAuthCodeToResetForgottenPassword(resetRidderPasswordDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.ConflictException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async validateAuthCodeToResetEmailOrPassword(ridder, updateRidderEmailPasswordDto, response) {
        try {
            const res = await this.ridderAuthService.validateAuthCodeToResetEmailOrPassword(ridder.id, updateRidderEmailPasswordDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.ConflictException
                || error instanceof common_1.BadRequestException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async bindDefaultAuth(ridder, bindRidderDefaultAuthDto, response) {
        try {
            const res = await this.ridderAuthService.bindDefaultAuth(ridder.id, bindRidderDefaultAuthDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.ConflictException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async bindGoogleAuth(ridder, bindRidderGoogleAuthDto, response) {
        try {
            const res = await this.ridderAuthService.bindGoogleAuth(ridder.id, bindRidderGoogleAuthDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.ConflictException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
};
exports.RidderAuthController = RidderAuthController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('sendAuthCodeForEmail'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "sendAuthCodeForEmail", null);
__decorate([
    (0, common_1.Post)('sendAuthCodeToResetForgottenPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ridderAuth_dto_1.SendAuthCodeByEmailDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "sendAuthCodeToResetForgottenPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('sendAuthCodeToResetEmailOrPassword'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "sendAuthCodeToResetEmailOrPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMyAuth'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "getMyAuth", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('validateAuthCodeForEmail'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        update_ridderAuth_dto_1.ValidateRidderInfoDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "validateAuthCodeForEmail", null);
__decorate([
    (0, common_1.Post)('validateAuthCodeToResetForgottenPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_ridderAuth_dto_1.ResetRidderPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "validateAuthCodeToResetForgottenPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('validateAuthCodeToResetEmailOrPassword'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        update_ridderAuth_dto_1.UpdateRidderEmailPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "validateAuthCodeToResetEmailOrPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Put)('bindDefaultAuth'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        update_ridderAuth_dto_1.BindRidderDefaultAuthDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "bindDefaultAuth", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Put)('bindGoogleAuth'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        update_ridderAuth_dto_1.BindRidderGoogleAuthDto, Object]),
    __metadata("design:returntype", Promise)
], RidderAuthController.prototype, "bindGoogleAuth", null);
exports.RidderAuthController = RidderAuthController = __decorate([
    (0, common_1.Controller)('ridderAuth'),
    __metadata("design:paramtypes", [ridderAuth_service_1.RidderAuthService])
], RidderAuthController);
//# sourceMappingURL=ridderAuth.controller.js.map