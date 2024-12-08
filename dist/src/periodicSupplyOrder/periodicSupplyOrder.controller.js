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
exports.PeriodicSupplyOrderController = void 0;
const common_1 = require("@nestjs/common");
const periodicSupplyOrder_service_1 = require("./periodicSupplyOrder.service");
const create_periodicSupplyOrder_dto_1 = require("./dto/create-periodicSupplyOrder.dto");
const update_periodicSupplyOrder_dto_1 = require("./dto/update-periodicSupplyOrder.dto");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
let PeriodicSupplyOrderController = class PeriodicSupplyOrderController {
    constructor(periodicSupplyOrderService) {
        this.periodicSupplyOrderService = periodicSupplyOrderService;
    }
    async createMyPeriodicSupplyOrder(ridder, createPeriodicSupplyOrderDto, response) {
        try {
            const res = await this.periodicSupplyOrderService.createPeriodicSupplyOrderByCreatorId(ridder.id, createPeriodicSupplyOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreatePeriodicSupplyOrderException;
            response.status(enums_1.HttpStatusCode.Ok).send({
                createdAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.ForbiddenException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getMyPeriodicSupplyOrderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicSupplyOrderService.getPeriodicSupplyOrderById(id, ridder.id);
            if (!res)
                throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
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
    async searchMyPaginationPeriodicSupplyOrders(ridder, scheduledDay = undefined, limit = "10", offset = "0", isAutoAccept = "false", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.periodicSupplyOrderService.searchPaginationPeriodicSupplyOrders(ridder.id, scheduledDay, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true), (0, utils_1.toBoolean)(isAutoAccept));
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async updateMyPeriodicSupplyOrderById(ridder, id, updatePeriodicSupplyOrderDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicSupplyOrderService.updatePeriodicSupplyOrderById(id, ridder.id, updatePeriodicSupplyOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async deleteMyPeriodicSupplyOrderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicSupplyOrderService.deletePeriodicSupplyOrderById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send({
                deletedAt: new Date(),
                ...res[0],
            });
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
exports.PeriodicSupplyOrderController = PeriodicSupplyOrderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('createMyPeriodicSupplyOrder'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        create_periodicSupplyOrder_dto_1.CreatePeriodicSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PeriodicSupplyOrderController.prototype, "createMyPeriodicSupplyOrder", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMyPeriodicSupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicSupplyOrderController.prototype, "getMyPeriodicSupplyOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('searchMyPaginationPeriodicSupplyOrders'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('scheduledDay')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('isAutoAccept')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicSupplyOrderController.prototype, "searchMyPaginationPeriodicSupplyOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('updateMyPeriodicSupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, update_periodicSupplyOrder_dto_1.UpdatePeriodicSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PeriodicSupplyOrderController.prototype, "updateMyPeriodicSupplyOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMyPeriodicSupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicSupplyOrderController.prototype, "deleteMyPeriodicSupplyOrderById", null);
exports.PeriodicSupplyOrderController = PeriodicSupplyOrderController = __decorate([
    (0, common_1.Controller)('periodicSupplyOrder'),
    __metadata("design:paramtypes", [periodicSupplyOrder_service_1.PeriodicSupplyOrderService])
], PeriodicSupplyOrderController);
//# sourceMappingURL=periodicSupplyOrder.controller.js.map