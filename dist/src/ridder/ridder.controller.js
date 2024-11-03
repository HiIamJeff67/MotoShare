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
const jwt_1 = require("@nestjs/jwt");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const update_ridder_dto_1 = require("./dto/update-ridder.dto");
const update_info_dto_1 = require("./dto/update-info.dto");
let RidderController = class RidderController {
    constructor(ridderService) {
        this.ridderService = ridderService;
    }
    async getMe(ridder, response) {
        try {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(ridder);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async getRidderWithInfoByUserName(ridder, userName, response) {
        try {
            const res = await this.ridderService.getRidderWithInfoByUserName(userName);
            if (!res)
                throw new common_1.NotFoundException("Cannot find the ridder with the given userName");
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async getMyInfo(ridder, response) {
        try {
            const res = await this.ridderService.getRidderWithInfoByUserId(ridder.id);
            if (!res)
                throw new common_1.NotFoundException("Cannot find the ridder with the given id");
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async getMyCollection(ridder, response) {
        try {
            const res = await this.ridderService.getRidderWithCollectionByUserId(ridder.id);
            if (!res)
                throw new common_1.NotFoundException("Cannot find the ridder with the given id");
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async searchRiddersByUserName(userName, limit = "10", offset = "0", response) {
        try {
            const res = await this.ridderService.searchRiddersByUserName(userName, +limit, +offset);
            if (!res || res.length == 0) {
                throw new common_1.NotFoundException("Cannot find any ridders");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof common_1.NotFoundException
                ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async searchPaginationRidders(limit, offset, response) {
        try {
            const res = await this.ridderService.searchPaginationRidders(+limit, +offset);
            if (!res || res.length == 0) {
                throw new common_1.NotFoundException("Cannot find any ridders");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error instanceof common_1.NotFoundException
                ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520).send({
                message: error.message,
            });
        }
    }
    async updateMe(ridder, updateRidderDto, response) {
        try {
            const res = await this.ridderService.updateRidderById(ridder.id, updateRidderDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the ridder with the given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : (error instanceof common_1.ConflictException
                        ? HttpStatusCode_enum_1.HttpStatusCode.Conflict
                        : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520))).send({
                message: error.message,
            });
        }
    }
    async updateMyInfo(ridder, updateRidderInfoDto, response) {
        try {
            const res = await this.ridderService.updateRidderInfoByUserId(ridder.id, updateRidderInfoDto);
            if (!res) {
                throw new common_1.NotFoundException("Cannot find the ridder with the given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({});
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async deleteMe(ridder, response) {
        try {
            const res = await this.ridderService.deleteRiddderById(ridder.id);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the ridder with the given id to update");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.NotFoundException
                    ? HttpStatusCode_enum_1.HttpStatusCode.NotFound
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
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
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getRidderWithInfoByUserName'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('userName')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderWithInfoByUserName", null);
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
    (0, common_1.Get)('searchRiddersByUserName'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "searchRiddersByUserName", null);
__decorate([
    (0, common_1.Get)('searchPaginationRidders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
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
    (0, common_1.Patch)('updateMyInfo'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType,
        update_info_dto_1.UpdateRidderInfoDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "updateMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMe'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object]),
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