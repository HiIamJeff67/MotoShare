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
exports.SupplyOrderController = void 0;
const common_1 = require("@nestjs/common");
const supplyOrder_service_1 = require("./supplyOrder.service");
const jwt_1 = require("@nestjs/jwt");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const create_supplyOrder_dto_1 = require("./dto/create-supplyOrder.dto");
const update_supplyOrder_dto_1 = require("./dto/update-supplyOrder.dto");
const get_supplyOrder_dto_1 = require("./dto/get-supplyOrder.dto");
let SupplyOrderController = class SupplyOrderController {
    constructor(supplyOrderService) {
        this.supplyOrderService = supplyOrderService;
    }
    async createSupplyOrder(ridder, createSupplyOrderDto, response) {
        try {
            const res = await this.supplyOrderService.createSupplyOrderByCreatorId(ridder.id, createSupplyOrderDto);
            if (!res || res.length === 0) {
                throw new common_1.BadRequestException("Cannot create supply order by the current ridder");
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
    async getMySupplyOrders(ridder, limit = "10", offset = "0", response) {
        try {
            const res = await this.supplyOrderService.getSupplyOrdersByCreatorId(ridder.id, +limit, +offset);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find the supply orders of the current ridder");
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
    async getSupplyOrderById(ridder, id, response) {
        try {
            const res = await this.supplyOrderService.getSupplyOrderById(id);
            if (!res) {
                throw new common_1.NotFoundException(`Cannot find the supply order with the given orderId: ${id}`);
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
    async searchPaginationSupplyOrders(creatorName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.supplyOrderService.searchPaginationSupplyOrders(creatorName, +limit, +offset);
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
    async searchCurAdjacentSupplyOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentSupplyOrdersDto, response) {
        try {
            const res = await this.supplyOrderService.searchCurAdjacentSupplyOrders(creatorName, +limit, +offset, getAdjacentSupplyOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any supply orders");
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
    async searchDestAdjacentSupplyOrders(creatorName = undefined, limit = "10", offset = "0", getAdjacentSupplyOrdersDto, response) {
        try {
            const res = await this.supplyOrderService.searchDestAdjacentSupplyOrders(creatorName, +limit, +offset, getAdjacentSupplyOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any supply orders");
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
    async searchSimilarRouteSupplyOrders(creatorName = undefined, limit = "10", offset = "0", getSimilarRouteSupplyOrdersDto, response) {
        try {
            const res = await this.supplyOrderService.searchSimilarRouteSupplyOrders(creatorName, +limit, +offset, getSimilarRouteSupplyOrdersDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException("Cannot find any supply orders");
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
    async updateMySupplyOrderById(ridder, id, updateSupplyOrderDto, response) {
        try {
            const res = await this.supplyOrderService.updateSupplyOrderById(id, ridder.id, updateSupplyOrderDto);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException(`
          Cannot find any supply orders with the given orderId: ${id}, 
          or the current ridder cannot update the order which is not created by himself/herself
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
    async deleteMySupplyOrderById(ridder, id, response) {
        try {
            const res = await this.supplyOrderService.deleteSupplyOrderById(id, ridder.id);
            if (!res || res.length === 0) {
                throw new common_1.NotFoundException(`
          Cannot find any supply orders with the given orderId: ${id}, 
          or the current ridder cannot delete the order which is not created by himself/herself
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
};
exports.SupplyOrderController = SupplyOrderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('createSupplyOrder'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType,
        create_supplyOrder_dto_1.CreateSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "createSupplyOrder", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getMySupplyOrders'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "getMySupplyOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('getSupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "getSupplyOrderById", null);
__decorate([
    (0, common_1.Get)('searchPaginationSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchPaginationSupplyOrders", null);
__decorate([
    (0, common_1.Get)('searchCurAdjacentSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_supplyOrder_dto_1.GetAdjacentSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchCurAdjacentSupplyOrders", null);
__decorate([
    (0, common_1.Get)('searchDestAdjacentSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_supplyOrder_dto_1.GetAdjacentSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchDestAdjacentSupplyOrders", null);
__decorate([
    (0, common_1.Get)('searchSimilarRouteSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, get_supplyOrder_dto_1.GetSimilarRouteSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchSimilarRouteSupplyOrders", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('updateMySupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, update_supplyOrder_dto_1.UpdateSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "updateMySupplyOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMySupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "deleteMySupplyOrderById", null);
exports.SupplyOrderController = SupplyOrderController = __decorate([
    (0, common_1.Controller)('supplyOrder'),
    __metadata("design:paramtypes", [supplyOrder_service_1.SupplyOrderService])
], SupplyOrderController);
//# sourceMappingURL=supplyOrder.controller.js.map