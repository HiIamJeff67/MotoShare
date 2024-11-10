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
const jwt_1 = require("@nestjs/jwt");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const create_purchaseOrder_dto_1 = require("./dto/create-purchaseOrder.dto");
const update_purchaseOrder_dto_1 = require("./dto/update-purchaseOrder.dto");
const get_purchaseOrder_dto_1 = require("./dto/get-purchaseOrder.dto");
let PurchaseOrderController = class PurchaseOrderController {
    constructor(purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }
    async createPurchaseOrder(passenger, createPurchaseOrderDto, response) {
        try {
            const res = await this.purchaseOrderService.createPurchaseOrderByCreatorId(passenger.id, createPurchaseOrderDto);
            if (!res || res.length === 0) {
                throw new common_1.BadRequestException("Cannot create purchase order by the current passenger");
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status((error instanceof common_1.UnauthorizedException || error instanceof jwt_1.TokenExpiredError)
                ? HttpStatusCode_enum_1.HttpStatusCode.Unauthorized
                : (error instanceof common_1.BadRequestException
                    ? HttpStatusCode_enum_1.HttpStatusCode.BadRequest
                    : HttpStatusCode_enum_1.HttpStatusCode.UnknownError ?? 520)).send({
                message: error.message,
            });
        }
    }
    async getMyPurchaseOrders(passenger, limit = "10", offset = "0", response) {
        try {
            const res = await this.purchaseOrderService.getPurchaseOrdersByCreatorId(passenger.id, +limit, +offset);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the purchase orders of the current passenger");
            }
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
    async getPurchaseOrderById(passenger, id, response) {
        try {
            const res = await this.purchaseOrderService.getPurchaseOrderById(id);
            if (!res) {
                throw new common_1.NotFoundException(`Cannot find the purchase order with the given orderId: ${id}`);
            }
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
    async searchPaginationPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.purchaseOrderService.searchPaginationPurchaseOrders(creatorName, +limit, +offset);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any purchase orders");
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
    async searchCurAdjacentPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentPurchaseOrdersDto, response) {
        try {
            const res = await this.purchaseOrderService.searchCurAdjacentPurchaseOrders(creatorName, +limit, +offset, getAdjacentPurchaseOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any purchase orders");
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
    async searchDestAdjacentPurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentPurchaseOrdersDto, response) {
        try {
            const res = await this.purchaseOrderService.searchDestAdjacentPurchaseOrders(creatorName, +limit, +offset, getAdjacentPurchaseOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any purchase orders");
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
    async searchSimilarRoutePurchaseOrders(creatorName = undefined, limit = "10", offset = "0", getSimilarRoutePurchaseOrdersDto, response) {
        try {
            const res = await this.purchaseOrderService.searchSimilarRoutePurchaseOrders(creatorName, +limit, +offset, getSimilarRoutePurchaseOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any purchase orders");
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
    async updateMyPurchaseOrderById(passenger, id, updatePurchaseOrderDto, response) {
        try {
            const res = await this.purchaseOrderService.updatePurchaseOrderById(id, passenger.id, updatePurchaseOrderDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException(`
          Cannot find any purchase orders with the given orderId: ${id}, 
          or the current passenger cannot update the order which is not created by himself/herself
        `);
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
    async deleteMyPurchaseOrderById(passenger, id, response) {
        try {
            const res = await this.purchaseOrderService.deletePurchaseOrderById(id, passenger.id);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException(`
          Cannot find any purchase orders with the given orderId: ${id}, 
          or the current passenger cannot delete the order which is not created by himself/herself
        `);
            }
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                deletedAt: new Date(),
                ...res[0],
            });
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
    getAllPurchaseOrders() {
        return this.purchaseOrderService.getAllPurchaseOrders();
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
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getPurchaseOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
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
    (0, common_1.Patch)('updateMyPurchaseOrderById'),
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
exports.PurchaseOrderController = PurchaseOrderController = __decorate([
    (0, common_1.Controller)('purchaseOrder'),
    __metadata("design:paramtypes", [purchaseOrder_service_1.PurchaseOrderService])
], PurchaseOrderController);
//# sourceMappingURL=purchaseOrder.controller.js.map