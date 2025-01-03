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
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const history_service_1 = require("./history.service");
const update_history_dto_1 = require("./dto/update-history.dto");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
let HistoryController = class HistoryController {
    constructor(historyService) {
        this.historyService = historyService;
    }
    async getHistoryForPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.getHistoryById(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            console.log(error);
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
    async getHistoryForRidderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.getHistoryById(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
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
    async searchPaginationHistoriesByPassengerId(passenger, limit = "10", offset = "0", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.historyService.searchPaginationHistoryByPassengerId(passenger.id, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true));
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchPaginationHistoriesByRidderId(ridder, limit = "10", offset = "0", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.historyService.searchPaginationHistoryByRidderId(ridder.id, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true));
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotFoundException
                || error instanceof common_1.NotAcceptableException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async rateAndCommentHistoryForPassengerById(passenger, id, rateAndCommentHistoryDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.rateAndCommentHistoryForPassengerById(id, passenger.id, passenger.userName, rateAndCommentHistoryDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
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
    async rateAndCommentHistoryForRidderById(ridder, id, rateAndCommentHistoryDto, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.rateAndCommentHistoryForRidderById(id, ridder.id, ridder.userName, rateAndCommentHistoryDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
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
    async delinkHistoryForPassengerById(passenger, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.delinkHistoryByPassengerId(id, passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
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
    async delinkHistoryForRidderById(ridder, id, response) {
        try {
            if (!id) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.historyService.delinkHistoryByRidderId(id, ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientHistoryNotFoundException;
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
    async updateAverageStarRatingByPassengerId(passenger, response) {
        try {
            const res = await this.historyService._updateAverageStarRatingByPassengerId(passenger.id);
            if (!res)
                throw exceptions_1.ClientCalculatePassengerAverageStarRatingException;
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/getHistoryById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistoryForPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/getHistoryById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistoryForRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('passenger/searchPaginationHistories'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "searchPaginationHistoriesByPassengerId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('ridder/searchPaginationHistories'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "searchPaginationHistoriesByRidderId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('passenger/rateAndCommentHistoryById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, update_history_dto_1.RateAndCommentHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "rateAndCommentHistoryForPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Patch)('ridder/rateAndCommentHistoryById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, update_history_dto_1.RateAndCommentHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "rateAndCommentHistoryForRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Delete)('passenger/delinkHistoryById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "delinkHistoryForPassengerById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('ridder/delinkHistoryById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "delinkHistoryForRidderById", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Patch)('updateAverageStarRatingByPassengerId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "updateAverageStarRatingByPassengerId", null);
exports.HistoryController = HistoryController = __decorate([
    (0, common_1.Controller)('history'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
//# sourceMappingURL=history.controller.js.map