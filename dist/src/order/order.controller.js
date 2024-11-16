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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const guard_1 = require("../auth/guard");
const auth_interface_1 = require("../interfaces/auth.interface");
const decorator_1 = require("../auth/decorator");
const exceptions_1 = require("../exceptions");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getOrderForPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.getOrderById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
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
    async getOrderForRidderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.getOrderById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
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
    async searchPaginationOrdersByPassengerId(passenger, ridderName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.orderService.searchPaginationOrderByPassengerId(passenger.id, ridderName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
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
    async searchPaginationOrdersByRidderId(ridder, passengerName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.orderService.searchPaginationOrderByRidderId(ridder.id, passengerName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
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
    async toStartedPassengerStatusById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toStartedPassengerStatusById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
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
    async toUnpaidPassengerStatusById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toUnpaidPassengerStatusById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
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
    async toFinishedPassengerStatusById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toFinishedPassengerStatusById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.NotAcceptableException
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
    async toStartedRidderStatusById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toStartedRidderStatusById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                updateAt: new Date(),
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
    async toUnpaidRidderStatusById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toUnpaidRidderStatusById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
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
    async toFinishedRidderStatusById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.toFinishedRidderStatusById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                prevOrderDeletedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.NotAcceptableException
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
    async cancelAndDeleteOrderForPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.orderService.cancelAndDeleteOrderById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientOrderNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                prevOrderDeletedAt: new Date(),
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
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/getOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderForPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/getOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderForRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchPaginationOrders'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('ridderName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "searchPaginationOrdersByPassengerId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchPaginationOrders'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('passengerName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "searchPaginationOrdersByRidderId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('passenger/toStartedStatusById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toStartedPassengerStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('passenger/toUnpaidStatusById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toUnpaidPassengerStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('passenger/toFinishedStatusById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toFinishedPassengerStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('ridder/toStartedStatusById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toStartedRidderStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('ridder/toUnpaidStatusById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toUnpaidRidderStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('ridder/toFinishedStatusById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "toFinishedRidderStatusById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('passenger/cancelAndDeleteOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelAndDeleteOrderForPassengerById", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map