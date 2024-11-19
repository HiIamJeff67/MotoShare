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
exports.RidderInviteController = void 0;
const common_1 = require("@nestjs/common");
const ridderInvite_service_1 = require("./ridderInvite.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const exceptions_1 = require("../exceptions");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const auth_interface_1 = require("../interfaces/auth.interface");
const create_ridderInvite_dto_1 = require("./dto/create-ridderInvite.dto");
const update_ridderInvite_dto_1 = require("./dto/update-ridderInvite.dto");
const constants_1 = require("../constants");
let RidderInviteController = class RidderInviteController {
    constructor(ridderInviteService) {
        this.ridderInviteService = ridderInviteService;
    }
    async createRidderInviteByOrderId(ridder, orderId, createRidderInviteDto, response) {
        try {
            if (!orderId) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.createRidderInviteByOrderId(ridder.id, orderId, createRidderInviteDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreateRidderInviteException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getRidderInviteOfRidderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.getRidderInviteById(id, ridder.id);
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
    async getRidderInviteOfPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.getRidderInviteById(id, passenger.id);
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
    async searchPaginationRidderInvitesByInviterId(ridder, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchPaginationRidderInvitesByInviterId(ridder.id, receiverName, +limit, +offset);
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
    async searchCurAdjacentRidderInvitesByInviterId(ridder, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchCurAdjacentRidderInvitesByInviterId(ridder.id, receiverName, +limit, +offset);
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
    async searchDestAdjacentRidderInvitesByInviterId(ridder, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchDestAdjacentRidderInvitesByInviterId(ridder.id, receiverName, +limit, +offset);
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
    async searchSimilarRouteRidderInvitesByInviterId(ridder, receiverName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchSimilarRouteRidderInvitesByInviterId(ridder.id, receiverName, +limit, +offset);
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
    async searchPaginationRidderInvitesByReceiverId(passenger, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchPaginationRidderInvitesByReceiverId(passenger.id, inviterName, +limit, +offset);
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
    async searchCurAdjacentRidderInvitesByReceiverId(passenger, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchCurAdjacentRidderInvitesByReceiverId(passenger.id, inviterName, +limit, +offset);
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
    async searchDestAdjacentRidderInvitesByReceiverId(passenger, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchDestAdjacentRidderInvitesByReceiverId(passenger.id, inviterName, +limit, +offset);
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
    async searchMySimilarRouteRidderInvitesByReceverId(passenger, inviterName = undefined, limit = "10", offset = "0", response) {
        try {
            if (+limit > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLarge)(constants_1.MAX_SEARCH_LIMIT);
            }
            const res = await this.ridderInviteService.searchSimilarRouteRidderInvitesByReceverId(passenger.id, inviterName, +limit, +offset);
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
    async updateMyRidderInviteById(ridder, id, updateRidderInviteDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.updateRidderInviteById(id, ridder.id, updateRidderInviteDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            if (!(error instanceof common_1.BadRequestException
                || error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.ConflictException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async decidePassengerInviteById(passenger, id, decideRidderInviteDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.decideRidderInviteById(id, passenger.id, decideRidderInviteDto);
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
    async deleteMyRidderInviteById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderInviteService.deleteRidderInviteById(id, ridder.id);
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
exports.RidderInviteController = RidderInviteController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('ridder/createRidderInviteByOrderId'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('orderId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, create_ridderInvite_dto_1.CreateRidderInviteDto, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "createRidderInviteByOrderId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/getMyRidderInviteById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "getRidderInviteOfRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/getMyRidderInviteById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "getRidderInviteOfPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyPaginationRidderInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchPaginationRidderInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyCurAdjacentRidderInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchCurAdjacentRidderInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMyDestAdjacentRidderInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchDestAdjacentRidderInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchMySimilarRouteRidderInvites'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('receiverName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchSimilarRouteRidderInvitesByInviterId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyPaginationRidderInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchPaginationRidderInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyCurAdjacentRidderInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchCurAdjacentRidderInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMyDestAdjacentRidderInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchDestAdjacentRidderInvitesByReceiverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchMySimilarRouteRidderInvites'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('inviterName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "searchMySimilarRouteRidderInvitesByReceverId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('ridder/updateMyRidderInviteById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, update_ridderInvite_dto_1.UpdateRidderInviteDto, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "updateMyRidderInviteById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('passenger/decideRidderInviteById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.PassengerType, String, update_ridderInvite_dto_1.DecideRidderInviteDto, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "decidePassengerInviteById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('ridder/deleteMyRidderInviteById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_interface_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderInviteController.prototype, "deleteMyRidderInviteById", null);
exports.RidderInviteController = RidderInviteController = __decorate([
    (0, common_1.Controller)('ridderInvite'),
    __metadata("design:paramtypes", [ridderInvite_service_1.RidderInviteService])
], RidderInviteController);
//# sourceMappingURL=ridderInvite.controller.js.map