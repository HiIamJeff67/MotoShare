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
exports.PassengerNotificationController = void 0;
const common_1 = require("@nestjs/common");
const passenerNotification_service_1 = require("./passenerNotification.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
let PassengerNotificationController = class PassengerNotificationController {
    constructor(passengerNotificationService) {
        this.passengerNotificationService = passengerNotificationService;
    }
    async getMyPassengerNotificationById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerNotificationService.getPassengerNotificationById(id, passenger.id);
            if (!res || res.length === 0)
                exceptions_1.ClientPassengerNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
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
    async searchMyPaginationPassengerNotifications(passenger, limit = "10", offset = "0", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.passengerNotificationService.searchPaginationPassengerNotifications(passenger.id, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true));
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotificationNotFoundException;
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
    async updateMyPassengerNotificationToReadStatus(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerNotificationService.updatePassengerNotificationToReadStatus(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
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
    async deleteMyPassengerNotifications(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.passengerNotificationService.deletePassengerNotification(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerNotificationNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
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
exports.PassengerNotificationController = PassengerNotificationController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getMyPassengerNotificationById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerNotificationController.prototype, "getMyPassengerNotificationById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('searchMyPaginationPassengerNotifications'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerNotificationController.prototype, "searchMyPaginationPassengerNotifications", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateMyPassengerNotificationToReadStatus'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerNotificationController.prototype, "updateMyPassengerNotificationToReadStatus", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('deleteMyPassengerNotification'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], PassengerNotificationController.prototype, "deleteMyPassengerNotifications", null);
exports.PassengerNotificationController = PassengerNotificationController = __decorate([
    (0, common_1.Controller)('passengerNotification'),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService])
], PassengerNotificationController);
//# sourceMappingURL=passengerNotification.controller.js.map