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
exports.PeriodicPurchaseOrderController = void 0;
const common_1 = require("@nestjs/common");
const periodicPurchaseOrder_service_1 = require("./periodicPurchaseOrder.service");
const create_periodicPurchaseOrder_dto_1 = require("./dto/create-periodicPurchaseOrder.dto");
const update_periodicPurchaseOrder_dto_1 = require("./dto/update-periodicPurchaseOrder.dto");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
let PeriodicPurchaseOrderController = class PeriodicPurchaseOrderController {
    constructor(periodicPurchaseOrderService) {
        this.periodicPurchaseOrderService = periodicPurchaseOrderService;
    }
    async createMyPeriodicPurchaseOrder(passenger, createPeriodicPurchaseOrderDto, response) {
        try {
            const res = await this.periodicPurchaseOrderService.createPeriodicPurchaseOrderByCreatorId(passenger.id, createPeriodicPurchaseOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreatePeriodicPurchaseOrderException;
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
    async getMyPeriodicPurchaseOrderById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicPurchaseOrderService.getPeriodicPurchaseOrderById(id, passenger.id);
            if (!res)
                throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
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
    async searchMyPaginationPeriodicPurchaseOrders(passenger, scheduledDay = undefined, limit = "10", offset = "0", isAutoAccept = "false", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.periodicPurchaseOrderService.searchPaginationPeriodicPurchaseOrders(passenger.id, scheduledDay, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true), (0, utils_1.toBoolean)(isAutoAccept));
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
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
    async updateMyPeriodicPurchaseOrderById(passenger, id, updatePeriodicPurchaseOrderDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicPurchaseOrderService.updatePeriodicPurchaseOrderById(id, passenger.id, updatePeriodicPurchaseOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
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
    async deleteMyPeriodicPurchaseOrderById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.periodicPurchaseOrderService.deletePeriodicPurchaseOrderById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
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
exports.PeriodicPurchaseOrderController = PeriodicPurchaseOrderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('createMyPeriodicPurchaseOrder'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        create_periodicPurchaseOrder_dto_1.CreatePeriodicPurchaseOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PeriodicPurchaseOrderController.prototype, "createMyPeriodicPurchaseOrder", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyPeriodicPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicPurchaseOrderController.prototype, "getMyPeriodicPurchaseOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('searchMyPaginationPeriodicPurchaseOrders'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('scheduledDay')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('isAutoAccept')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicPurchaseOrderController.prototype, "searchMyPaginationPeriodicPurchaseOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateMyPeriodicPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, update_periodicPurchaseOrder_dto_1.UpdatePeriodicPurchaseOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PeriodicPurchaseOrderController.prototype, "updateMyPeriodicPurchaseOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('deleteMyPeriodicPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PeriodicPurchaseOrderController.prototype, "deleteMyPeriodicPurchaseOrderById", null);
exports.PeriodicPurchaseOrderController = PeriodicPurchaseOrderController = __decorate([
    (0, common_1.Controller)('periodicPurchaseOrder'),
    __metadata("design:paramtypes", [periodicPurchaseOrder_service_1.PeriodicPurchaseOrderService])
], PeriodicPurchaseOrderController);
//# sourceMappingURL=periodicPurchaseOrder.controller.js.map