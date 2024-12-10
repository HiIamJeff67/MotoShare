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
exports.RidderController = void 0;
const common_1 = require("@nestjs/common");
const ridder_service_1 = require("./ridder.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const update_ridder_dto_1 = require("./dto/update-ridder.dto");
const update_info_dto_1 = require("./dto/update-info.dto");
const platform_express_1 = require("@nestjs/platform-express");
const delete_ridder_dto_1 = require("./dto/delete-ridder.dto");
const stringParser_1 = require("../utils/stringParser");
const constants_1 = require("../constants");
const types_1 = require("../types");
let RidderController = class RidderController {
    constructor(ridderService) {
        this.ridderService = ridderService;
    }
    async getMe(ridder, response) {
        try {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(ridder);
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
    async getRidderWithInfoByUserName(phoneNumber, response) {
        try {
            if (!phoneNumber) {
                throw exceptions_1.ApiMissingParameterException;
            }
            for (const allowedPhoneNumber of types_1.AllowedPhoneNumberTypes) {
                if (types_1.PhoneNumberRegex[allowedPhoneNumber].test(phoneNumber))
                    break;
                throw exceptions_1.ServerAllowedPhoneNumberException;
            }
            const res = await this.ridderService.getRidderWithInfoByPhoneNumber(phoneNumber);
            if (!res)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async getRidderWithInfoByPhoneNumber(userName, response) {
        try {
            if (!userName) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderService.getRidderWithInfoByUserName(userName);
            if (!res)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async getMyInfo(ridder, response) {
        try {
            const res = await this.ridderService.getRidderWithInfoByUserId(ridder.id);
            if (!res)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async getMyCollection(ridder, response) {
        try {
            const res = await this.ridderService.getRidderWithCollectionByUserId(ridder.id);
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
    async searchPaginationRidders(userName = undefined, limit = "10", offset = "0", response) {
        if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
            throw exceptions_1.ApiSearchingLimitTooLargeException;
        }
        if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
            throw exceptions_1.ApiSearchingLimitLessThanZeroException;
        }
        try {
            const res = await this.ridderService.searchPaginationRidders(userName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true));
            if (!res || res.length == 0)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async updateMe(ridder, updateRidderDto, response) {
        try {
            const res = await this.ridderService.updateRidderById(ridder.id, updateRidderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async updateMyInfo(ridder, updateRidderInfoDto, files, response) {
        try {
            const res = await this.ridderService.updateRidderInfoByUserId(ridder.id, updateRidderInfoDto, (files.avatorFile ? files.avatorFile[0] : undefined), (files.motocyclePhotoFile ? files.motocyclePhotoFile[0] : undefined));
            if (!res)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async deleteMe(ridder, deleteRidderDto, response) {
        try {
            const res = await this.ridderService.deleteRiddderById(ridder.id, deleteRidderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
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
    async getAllRidders(response) {
        try {
            const res = await this.ridderService.getAllRidders();
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                alert: "This route is currently only for debugging",
                ...res
            });
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                alert: "This route is currently only for debugging",
                message: "Cannot find any ridders",
            });
        }
    }
};
exports.RidderController = RidderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMe'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
    (0, common_1.Get)('getRidderWithInfoByUserName'),
    __param(0, (0, common_1.Query)('phoneNumber')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderWithInfoByUserName", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
    (0, common_1.Get)('getRidderWithInfoByPhoneNumber'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderWithInfoByPhoneNumber", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMyInfo'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMyCollection'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getMyCollection", null);
__decorate([
    (0, common_1.UseGuards)(new guard_1.AnyGuard([guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
    (0, common_1.Get)('searchPaginationRidders'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "searchPaginationRidders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('updateMe'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType,
        update_ridder_dto_1.UpdateRidderDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "updateMe", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'avatorFile', maxCount: 1 },
        { name: 'motocyclePhotoFile', maxCount: 1 },
    ])),
    (0, common_1.Patch)('updateMyInfo'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType,
        update_info_dto_1.UpdateRidderInfoDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "updateMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMe'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType,
        delete_ridder_dto_1.DeleteRidderDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "deleteMe", null);
__decorate([
    (0, common_1.Get)('getAllRidders'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getAllRidders", null);
exports.RidderController = RidderController = __decorate([
    (0, common_1.Controller)('ridder'),
    __metadata("design:paramtypes", [ridder_service_1.RidderService])
], RidderController);
//# sourceMappingURL=ridder.controller.js.map