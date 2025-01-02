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
exports.PassengerAuthController = void 0;
const common_1 = require("@nestjs/common");
const passengerAuth_service_1 = require("./passengerAuth.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const update_passengerAuth_dto_1 = require("./dto/update-passengerAuth.dto");
const create_passengerAuth_dto_1 = require("./dto/create-passengerAuth.dto");
let PassengerAuthController = class PassengerAuthController {
    constructor(passengerAuthService) {
        this.passengerAuthService = passengerAuthService;
    }
    async sendAuthCodeForEmail(passenger, response) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeById(passenger.id, "Vailate Your Email");
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
            const res = await this.passengerAuthService.sendAuthenticationCodeByEmail(sendAuthCodeByEmailDto.email, "Reset Your Password");
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.InternalServerErrorException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async sendAuthCodeToResetEmailOrPassword(passenger, response) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeById(passenger.id, "Reset Your Email or Password");
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
    async getMyAuth(passenger, response) {
        try {
            const res = await this.passengerAuthService.getPassengerAuthByUserId(passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerAuthNotFoundException;
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
    async validateAuthCodeForEmail(passenger, validatePassengerInfoDto, response) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeForEmail(passenger.id, validatePassengerInfoDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
    async validateAuthCodeToResetForgottenPassword(resetPassengerPasswordDto, response) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeToResetForgottenPassword(resetPassengerPasswordDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
    async validateAuthCodeToResetEmailOrPassword(passenger, updatePassengerEmailPasswordDto, response) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeToResetEmailOrPassword(passenger.id, updatePassengerEmailPasswordDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
    async bindDefaultAuth(passenger, bindPassengerDefaultAuthDto, response) {
        try {
            const res = await this.passengerAuthService.bindDefaultAuth(passenger.id, bindPassengerDefaultAuthDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
    async bindGoogleAuth(passenger, bindPassengerGoogleAuthDto, response) {
        try {
            const res = await this.passengerAuthService.bindGoogleAuth(passenger.id, bindPassengerGoogleAuthDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
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
exports.PassengerAuthController = PassengerAuthController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('sendAuthCodeForEmail'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "sendAuthCodeForEmail", null);
__decorate([
    (0, common_1.Post)('sendAuthCodeToResetForgottenPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_passengerAuth_dto_1.SendAuthCodeByEmailDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "sendAuthCodeToResetForgottenPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('sendAuthCodeToResetEmailOrPassword'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "sendAuthCodeToResetEmailOrPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyAuth'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "getMyAuth", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('validateAuthCodeForEmail'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        update_passengerAuth_dto_1.ValidatePassengerInfoDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "validateAuthCodeForEmail", null);
__decorate([
    (0, common_1.Post)('validateAuthCodeToResetForgottenPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_passengerAuth_dto_1.ResetPassengerPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "validateAuthCodeToResetForgottenPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('validateAuthCodeToResetEmailOrPassword'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        update_passengerAuth_dto_1.UpdatePassengerEmailPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "validateAuthCodeToResetEmailOrPassword", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Put)('bindDefaultAuth'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        update_passengerAuth_dto_1.BindPassengerDefaultAuthDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "bindDefaultAuth", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Put)('bindGoogleAuth'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        update_passengerAuth_dto_1.BindPassengerGoogleAuthDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerAuthController.prototype, "bindGoogleAuth", null);
exports.PassengerAuthController = PassengerAuthController = __decorate([
    (0, common_1.Controller)('passengerAuth'),
    __metadata("design:paramtypes", [passengerAuth_service_1.PassengerAuthService])
], PassengerAuthController);
//# sourceMappingURL=passengerAuth.controller.js.map