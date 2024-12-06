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
exports.RidderNotificationController = void 0;
const common_1 = require("@nestjs/common");
const ridderNotification_service_1 = require("./ridderNotification.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
let RidderNotificationController = class RidderNotificationController {
    constructor(ridderNotificationService) {
        this.ridderNotificationService = ridderNotificationService;
    }
    async getMyNotifications(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderNotificationService.getRidderNotificationById(id, ridder.id);
            if (!res || res.length === 0)
                exceptions_1.ClientRidderNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
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
    async searchMyPaginationRidderNotifications(ridder, limit = "10", offset = "0", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.ridderNotificationService.searchPaginationRidderNotifications(ridder.id, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true));
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async updateMyRidderNotificationToReadStatus(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderNotificationService.updateRidderNotificationToReadStatus(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
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
    async deleteMyRidderNotifications(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderNotificationService.deleteRidderNotification(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
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
};
exports.RidderNotificationController = RidderNotificationController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMyNotifications'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderNotificationController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('searchMyPaginationRidderNotifications'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RidderNotificationController.prototype, "searchMyPaginationRidderNotifications", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('updateMyRidderNotificationToReadStatus'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderNotificationController.prototype, "updateMyRidderNotificationToReadStatus", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMyRidderNotification'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderNotificationController.prototype, "deleteMyRidderNotifications", null);
exports.RidderNotificationController = RidderNotificationController = __decorate([
    (0, common_1.Controller)('ridderNotification'),
    __metadata("design:paramtypes", [ridderNotification_service_1.RidderNotificationService])
], RidderNotificationController);
//# sourceMappingURL=ridderNotification.controller.js.map