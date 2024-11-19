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
exports.PurchaseOrderController = void 0;
const common_1 = require("@nestjs/common");
const purchaseOrder_service_1 = require("./purchaseOrder.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const create_purchaseOrder_dto_1 = require("./dto/create-purchaseOrder.dto");
const update_purchaseOrder_dto_1 = require("./dto/update-purchaseOrder.dto");
const get_purchaseOrder_dto_1 = require("./dto/get-purchaseOrder.dto");
const constants_1 = require("../constants");
let PurchaseOrderController = class PurchaseOrderController {
    constructor(purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }
    async createPurchaseOrder(passenger, createPurchaseOrderDto, response) {
        try {
            const res = await this.purchaseOrderService.createPurchaseOrderByCreatorId(passenger.id, createPurchaseOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreatePurchaseOrderException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                createdAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.ForbiddenException
                || error instanceof common_1.UnauthorizedException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getMyPurchaseOrders(passenger, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.getPurchaseOrdersByCreatorId(passenger.id, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
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
    async getPurchaseOrderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.purchaseOrderService.getPurchaseOrderById(id);
            if (!res)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
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
    async searchPaginationPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchPaginationPurchaseOrders(creatorName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchCurAdjacentPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentPurchaseOrdersDto, response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchCurAdjacentPurchaseOrders(creatorName, +limit, +offset, getAdjacentPurchaseOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchDestAdjacentPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentPurchaseOrdersDto, response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchDestAdjacentPurchaseOrders(creatorName, +limit, +offset, getAdjacentPurchaseOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchSimilarRoutePurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getSimilarRoutePurchaseOrdersDto, response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchSimilarRoutePurchaseOrders(creatorName, +limit, +offset, getSimilarRoutePurchaseOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async updateMyPurchaseOrderById(passenger, id, updatePurchaseOrderDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.purchaseOrderService.updatePurchaseOrderById(id, passenger.id, updatePurchaseOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
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
    async deleteMyPurchaseOrderById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.purchaseOrderService.deletePurchaseOrderById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
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
    getAllPurchaseOrders() {
        return this.purchaseOrderService.getAllPurchaseOrders();
    }
    async testWithExpired(creatorName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchPaginationPurchaseOrdersWithUpdateExpired(true, creatorName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async testWithoutExpired(creatorName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.purchaseOrderService.searchPaginationPurchaseOrdersWithUpdateExpired(false, creatorName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
};
exports.PurchaseOrderController = PurchaseOrderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('createPurchaseOrder'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType,
        create_purchaseOrder_dto_1.CreatePurchaseOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "createPurchaseOrder", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyPurchaseOrders'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "getMyPurchaseOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getPurchaseOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "getPurchaseOrderById", null);
__decorate([
    (0, common_1.Get)('searchPaginationPurchaseOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "searchPaginationPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('searchCurAdjacentPurchaseOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_purchaseOrder_dto_1.GetAdjacentPurchaseOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "searchCurAdjacentPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('searchDestAdjacentPurchaseOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_purchaseOrder_dto_1.GetAdjacentPurchaseOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "searchDestAdjacentPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('searchSimilarRoutePurchaseOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_purchaseOrder_dto_1.GetSimilarRoutePurchaseOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "searchSimilarRoutePurchaseOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('updateMyPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, update_purchaseOrder_dto_1.UpdatePurchaseOrderDto, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "updateMyPurchaseOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('deleteMyPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "deleteMyPurchaseOrderById", null);
__decorate([
    (0, common_1.Get)('getAllPurchaseOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getAllPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('testWithExpired'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "testWithExpired", null);
__decorate([
    (0, common_1.Get)('testWithoutExpired'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrderController.prototype, "testWithoutExpired", null);
exports.PurchaseOrderController = PurchaseOrderController = __decorate([
    (0, common_1.Controller)('purchaseOrder'),
    __metadata("design:paramtypes", [purchaseOrder_service_1.PurchaseOrderService])
], PurchaseOrderController);
//# sourceMappingURL=purchaseOrder.controller.js.map