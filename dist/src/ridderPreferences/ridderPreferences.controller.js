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
exports.RidderPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const ridderPreferences_service_1 = require("./ridderPreferences.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const axios_1 = require("axios");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
let RidderPreferencesController = class RidderPreferencesController {
    constructor(ridderPreferencesService) {
        this.ridderPreferencesService = ridderPreferencesService;
    }
    async createMyPreferenceByUserName(ridder, preferenceUserName, response) {
        try {
            if (!preferenceUserName) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderPreferencesService.createRidderPreferenceByPreferenceUserName(ridder.id, preferenceUserName);
            if (!res || res.length === 0)
                throw exceptions_1.ClientCreateRidderPreferenceException;
            response.status(axios_1.HttpStatusCode.Ok).send({
                createdAt: new Date(),
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.BadRequestException
                || error instanceof common_1.ForbiddenException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async searchMyPaginationPreferences(ridder, preferenceUserName = undefined, limit = "10", offset = "0", response) {
        try {
            if ((0, utils_1.toNumber)(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitTooLargeException)(constants_1.MAX_SEARCH_LIMIT);
            }
            if ((0, utils_1.toNumber)(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                throw (0, exceptions_1.ApiSearchingLimitLessThanZeroException)(constants_1.MIN_SEARCH_LIMIT);
            }
            const res = await this.ridderPreferencesService.searchPaginationRidderPreferences(ridder.id, preferenceUserName, (0, utils_1.toNumber)(limit, true), (0, utils_1.toNumber)(offset, true));
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderPreferenceNotFoundException;
            response.status(axios_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.NotAcceptableException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async deleteMyPreferenceByUserName(ridder, preferenceUserName, response) {
        try {
            if (!preferenceUserName) {
                throw exceptions_1.ApiMissingParameterException;
            }
            const res = await this.ridderPreferencesService.deleteRidderPreferenceByUserIdAndPreferenceUserId(ridder.id, preferenceUserName);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderPreferenceNotFoundException;
            response.status(axios_1.HttpStatusCode.Ok).send({
                deletedAt: new Date(),
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.BadRequestException
                || error instanceof common_1.NotFoundException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
};
exports.RidderPreferencesController = RidderPreferencesController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('createMyPreferenceByUserName'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('preferenceUserName')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderPreferencesController.prototype, "createMyPreferenceByUserName", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('searchMyPaginationPreferences'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('preferenceUserName')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderPreferencesController.prototype, "searchMyPaginationPreferences", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Delete)('deleteMyPreferenceByUserName'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Query)('preferenceUserName')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, String, Object]),
    __metadata("design:returntype", Promise)
], RidderPreferencesController.prototype, "deleteMyPreferenceByUserName", null);
exports.RidderPreferencesController = RidderPreferencesController = __decorate([
    (0, common_1.Controller)('ridderPreferences'),
    __metadata("design:paramtypes", [ridderPreferences_service_1.RidderPreferencesService])
], RidderPreferencesController);
//# sourceMappingURL=ridderPreferences.controller.js.map