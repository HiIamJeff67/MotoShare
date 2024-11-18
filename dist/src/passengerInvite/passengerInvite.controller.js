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
exports.PassengerInviteController = void 0;
const common_1 = require("@nestjs/common");
const passengerInvite_service_1 = require("./passengerInvite.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const auth_interface_1 = require("../interfaces/auth.interface");
const create_passengerInvite_dto_1 = require("./dto/create-passengerInvite.dto");
const update_passengerInvite_dto_1 = require("./dto/update-passengerInvite.dto");
let PassengerInviteController = class PassengerInviteController {
    constructor(passengerInviteService) {
        this.passengerInviteService = passengerInviteService;
    }
    async createPassengerInviteByOrderId(passenger, orderId, createPassengerInviteDto, response) {
        try {
            if (!orderId) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.createPassengerInviteByOrderId(passenger.id, orderId, createPassengerInviteDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreatePassengerInviteException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send({
                createdAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                message: error.message,
            });
        }
    }
    async getPassengerInviteForPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.getPassengerInviteById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response
            });
        }
    }
    async getPassengerInviteForRidderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.getPassengerInviteById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchPaginationPassengerInvitesByInviterId(passenger, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchPaginationPassengerInvitesByInviterId(passenger.id, receiverName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchCurAdjacentPassengerInvitesByInviterId(passenger, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchCurAdjacentPassengerInvitesByInviterId(passenger.id, receiverName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchDestAdjacentPassengerInvitesByInviterId(passenger, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchDestAdjacentPassengerInvitesByInviterId(passenger.id, receiverName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchSimilarRoutePassengerInvitesByInviterId(passenger, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchSimilarRoutePassengerInvitesByInviterId(passenger.id, receiverName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchPaginationPasssengerInvitesByReceiverId(ridder, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchPaginationPasssengerInvitesByReceiverId(ridder.id, inviterName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchCurAdjacentPassengerInvitesByReceiverId(ridder, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchCurAdjacentPassengerInvitesByReceiverId(ridder.id, inviterName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchDestAdjacentPassengerInvitesByReceiverId(ridder, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchDestAdjacentPassengerInvitesByReceiverId(ridder.id, inviterName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async searchMySimilarRoutePassengerInvitesByReceverId(ridder, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            const res = await this.passengerInviteService.searchSimilarRoutePassengerInvitesByReceverId(ridder.id, inviterName, +limit, +offset);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async updateMyPassengerInviteById(passenger, id, updatePassengerInviteDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.updatePassengerInviteById(id, passenger.id, updatePassengerInviteDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async decidePassengerInviteById(ridder, id, decidePassengerInviteDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.decidePassengerInviteById(id, ridder.id, decidePassengerInviteDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
    async deleteMyPassengerInviteById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerInviteService.deletePassengerInviteById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
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
exports.PassengerInviteController = PassengerInviteController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('passenger/createPassengerInviteByOrderId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('orderId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, create_passengerInvite_dto_1.CreatePassengerInviteDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "createPassengerInviteByOrderId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/getMyPassengerInviteById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "getPassengerInviteForPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('/ridder/getMyPassengerInviteById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "getPassengerInviteForRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyPaginationPassengerInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchPaginationPassengerInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyCurAdjacentPassengerInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchCurAdjacentPassengerInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyDestAdjacentPassengerInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchDestAdjacentPassengerInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMySimilarRoutePassengerInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchSimilarRoutePassengerInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyPaginationPasssengerInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchPaginationPasssengerInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyCurAdjacentPassengerInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchCurAdjacentPassengerInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyDestAdjacentPassengerInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchDestAdjacentPassengerInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMySimilarRoutePassengerInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "searchMySimilarRoutePassengerInvitesByReceverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('passenger/updateMyPassengerInviteById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, update_passengerInvite_dto_1.UpdatePassengerInviteDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "updateMyPassengerInviteById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('ridder/decidePassengerInviteById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, update_passengerInvite_dto_1.DecidePassengerInviteDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "decidePassengerInviteById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('passenger/deleteMyPassengerInviteById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerInviteController.prototype, "deleteMyPassengerInviteById", null);
exports.PassengerInviteController = PassengerInviteController = __decorate([
    (0, common_1.Controller)('passengerInvite'),
    __metadata("design:paramtypes", [passengerInvite_service_1.PassengerInviteService])
], PassengerInviteController);
//# sourceMappingURL=passengerInvite.controller.js.map