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
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const create_supplyOrder_dto_1 = require("./dto/create-supplyOrder.dto");
const update_supplyOrder_dto_1 = require("./dto/update-supplyOrder.dto");
const get_supplyOrder_dto_1 = require("./dto/get-supplyOrder.dto");
const constants_1 = require("../constants");
const stringParser_1 = require("../utils/stringParser");
const accept_supplyOrder_dto_1 = require("./dto/accept-supplyOrder.dto");
const types_1 = require("../types");
let SupplyOrderController = class SupplyOrderController {
    constructor(supplyOrderService) {
        this.supplyOrderService = supplyOrderService;
    }
    async createSupplyOrder(ridder, createSupplyOrderDto, response) {
        try {
            const res = await this.supplyOrderService.createSupplyOrderByCreatorId(ridder.id, createSupplyOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreateSupplyOrderException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                createdAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.ForbiddenException
                || error instanceof common_1.UnauthorizedException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getSupplyOrderById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.supplyOrderService.getSupplyOrderById(id);
            if (!res)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
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
    async searchMySupplyOrders(ridder, limit = "10", offset = "0", isAutoAccept = "false", response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchSupplyOrdersByCreatorId(ridder.id, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept));
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
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
    async searchPaginationSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchPaginationSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept));
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async searchAboutToStartSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchAboutToStartSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept));
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async seachSimilarTimeSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", getSimilarTimeSupplyOrderDto, response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchSimilarTimeSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept), getSimilarTimeSupplyOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchCurAdjacentSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", getAdjacentSupplyOrdersDto, response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchCurAdjacentSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept), getAdjacentSupplyOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async searchDestAdjacentSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", getAdjacentSupplyOrdersDto, response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchDestAdjacentSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept), getAdjacentSupplyOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async searchSimilarRouteSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", getSimilarRouteSupplyOrdersDto, response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.supplyOrderService.searchSimilarRouteSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept), getSimilarRouteSupplyOrdersDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    async searchBetterFirstSupplyOrders(creatorName = undefined, limit = "10", offset = "0", isAutoAccept = "false", searchPriorities = "RTSDU", getBetterSupplyOrderDto, response) {
        try {
            if ((0, stringParser_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, stringParser_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            if (!types_1.SearchPriorityTypes.includes(searchPriorities)) {
                throw exceptions_1.ApiWrongSearchPriorityTypeException;
            }
            const res = await this.supplyOrderService.searchBetterFirstSupplyOrders(creatorName, (0, stringParser_1.toNumber)(limit, true), (0, stringParser_1.toNumber)(offset, true), (0, stringParser_1.toBoolean)(isAutoAccept), getBetterSupplyOrderDto, searchPriorities);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async updateMySupplyOrderById(ridder, id, updateSupplyOrderDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.supplyOrderService.updateSupplyOrderById(id, ridder.id, updateSupplyOrderDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
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
    async startSupplyOrderWithoutInvite(passenger, id, acceptAutoAcceptSupplyOrder, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.supplyOrderService.startSupplyOrderWithoutInvite(id, passenger.id, passenger.userName, acceptAutoAcceptSupplyOrder);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreateOrderException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                createdAt: new Date(),
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
    async cancelMySupplyOrderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.supplyOrderService.cancelSupplyOrderById(id, ridder.id, ridder.userName);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                canceled: new Date(),
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
    async deleteMySupplyOrderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.supplyOrderService.deleteSupplyOrderById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientSupplyOrderNotFoundException;
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
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getSupplyOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "getSupplyOrderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('searchMySupplyOrders'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchMySupplyOrders", null);
__decorate([
    (0, common_1.Get)('searchPaginationSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchPaginationSupplyOrders", null);
__decorate([
    (0, common_1.Get)('searchAboutToStartSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchAboutToStartSupplyOrders", null);
__decorate([
    (0, common_1.Post)('searchSimilarTimeSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Body)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, get_supplyOrder_dto_1.GetSimilarTimeSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "seachSimilarTimeSupplyOrders", null);
__decorate([
    (0, common_1.Post)('searchCurAdjacentSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Body)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, get_supplyOrder_dto_1.GetAdjacentSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchCurAdjacentSupplyOrders", null);
__decorate([
    (0, common_1.Post)('searchDestAdjacentSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Body)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, get_supplyOrder_dto_1.GetAdjacentSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchDestAdjacentSupplyOrders", null);
__decorate([
    (0, common_1.Post)('searchSimilarRouteSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Body)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, get_supplyOrder_dto_1.GetSimilarRouteSupplyOrdersDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchSimilarRouteSupplyOrders", null);
__decorate([
    (0, common_1.Post)('searchBetterFirstSupplyOrders'),
    __param(0, (0, common_1.Query)('creatorName')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('isAutoAccept')),
    __param(4, (0, common_1.Query)('searchPriorities')),
    __param(5, (0, common_1.Body)()),
    __param(6, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, get_supplyOrder_dto_1.GetBetterSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "searchBetterFirstSupplyOrders", null);
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
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('startSupplyOrderWithoutInvite'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, accept_supplyOrder_dto_1.AcceptAutoAcceptSupplyOrderDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "startSupplyOrderWithoutInvite", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('cancelMySupplyOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], SupplyOrderController.prototype, "cancelMySupplyOrderById", null);
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