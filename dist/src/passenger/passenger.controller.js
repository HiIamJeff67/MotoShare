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
exports.PassengerController = void 0;
const common_1 = require("@nestjs/common");
const passenger_service_1 = require("./passenger.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const jwt_passenger_guard_1 = require("../../src/auth/guard/jwt-passenger.guard");
const auth_interface_1 = require("../../src/interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const update_info_dto_1 = require("./dto/update-info.dto");
const update_passenger_dto_1 = require("./dto/update-passenger.dto");
const platform_express_1 = require("@nestjs/platform-express");
const delete_passenger_dto_1 = require("./dto/delete-passenger.dto");
const stringParser_1 = require("../utils/stringParser");
const constants_1 = require("../constants");
const guard_1 = require("../auth/guard");
const types_1 = require("../types");
let PassengerController = class PassengerController {
    constructor(passengerService) {
        this.passengerService = passengerService;
    }
    getMe(passenger, response) {
        try {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(passenger);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response
            });
        }
    }
    async getPassengerWithInfoByUserName(userName, response) {
        try {
            if (!userName) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerService.getPassengerWithInfoByUserName(userName);
            if (!res)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getPassengerWithInfoByPhoneNumber(phoneNumber, response) {
        try {
            if (!phoneNumber) {
                throw exceptions_1.ApiMissingParameterException;
            }
            for (const allowedPhoneNumber of types_1.AllowedPhoneNumberTypes) {
                if (types_1.PhoneNumberRegex[allowedPhoneNumber].test(phoneNumber))
                    break;
                throw exceptions_1.ServerAllowedPhoneNumberException;
            }
            const res = await this.passengerService.getPassengerWithInfoByPhoneNumber(phoneNumber);
            if (!res)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getMyInfo(passenger, response) {
        try {
            const res = await this.passengerService.getPassengerWithInfoByUserId(passenger.id);
            if (!res)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async getMyCollection(passenger, response) {
        try {
            const res = await this.passengerService.getPassengerWithCollectionByUserId(passenger.id);
            if (!res)
                throw exceptions_1.ClientCollectionNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async searchPaginationPassengers(userName = undefined, limit = "10", offset = "0", response) {
        if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
            throw exceptions_1.ApiSearchingLimitTooLargeException;
        }
        if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
            throw exceptions_1.ApiSearchingLimitLessThanZeroException;
        }
        try {
            const res = await this.passengerService.searchPaginationPassengers(userName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true));
            if (!res || res.length == 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async updateMe(passenger, updatePassengerDto, response) {
        try {
            const res = await this.passengerService.updatePassengerById(passenger.id, updatePassengerDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.ConflictException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async updateMyInfo(passenger, updatePassengerInfoDto, avatorFile = undefined, response) {
        try {
            const res = await this.passengerService.updatePassengerInfoByUserId(passenger.id, updatePassengerInfoDto, avatorFile);
            if (!res)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.InternalServerErrorException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async deleteMe(passenger, deletePassengerDto, response) {
        try {
            const res = await this.passengerService.deletePassengerById(passenger.id, deletePassengerDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                deletedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    getTest(response) {
        console.log("test");
        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
            alert: "This route is currently only for debugging",
            message: "test",
        });
    }
    async getAllPassengers(response) {
        try {
            const res = await this.passengerService.getAllPassengers();
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                alert: "This route is currently only for debugging",
                ...res
            });
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                alert: "This route is currently only for debugging",
                message: "Cannot find any passengers",
            });
        }
    }
};
exports.PassengerController = PassengerController;
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMe'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([guard_1.JwtRidderGuard, jwt_passenger_guard_1.JwtPassengerGuard])),
    (0, common_1.Get)('getPassengerWithInfoByUserName'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerWithInfoByUserName", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([jwt_passenger_guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
    (0, common_1.Get)('getPassengerWithInfoByPhoneNumber'),
    __param(0, (0, common_1.Query)('phoneNumber')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getPassengerWithInfoByPhoneNumber", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyInfo'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyCollection'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getMyCollection", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([jwt_passenger_guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
    (0, common_1.Get)('searchPaginationPassengers'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "searchPaginationPassengers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateMe'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType,
        update_passenger_dto_1.UpdatePassengerDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "updateMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatorFile')),
    (0, common_1.Patch)('updateMyInfo'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType,
        update_info_dto_1.UpdatePassengerInfoDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "updateMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_passenger_guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('deleteMe'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType,
        delete_passenger_dto_1.DeletePassengerDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "deleteMe", null);
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('getAllPassengers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PassengerController.prototype, "getAllPassengers", null);
exports.PassengerController = PassengerController = __decorate([
    (0, common_1.Controller)('passenger'),
    __metadata("design:paramtypes", [passenger_service_1.PassengerService])
], PassengerController);
//# sourceMappingURL=passenger.controller.js.map