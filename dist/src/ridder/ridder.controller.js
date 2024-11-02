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
exports.RidderController = void 0;
const common_1 = require("@nestjs/common");
const ridder_service_1 = require("./ridder.service");
const HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
const create_ridder_dto_1 = require("./dto/create-ridder.dto");
const update_ridder_dto_1 = require("./dto/update-ridder.dto");
const update_info_dto_1 = require("../passenger/dto/update-info.dto");
let RidderController = class RidderController {
    constructor(ridderService) {
        this.ridderService = ridderService;
    }
    async createRidderWithInfoAndCollection(createRidderDto, response) {
        try {
            if (createRidderDto.userName.length > 20) {
                throw {
                    name: "userNameTooLong",
                    message: "User name cannot be longer than 20 characters"
                };
            }
            const ridderReponse = await this.ridderService.createRidder(createRidderDto);
            const infoResponse = await this.ridderService.createRidderInfoByUserId(ridderReponse[0].id);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send({
                ridderId: ridderReponse[0].id,
                ridderName: ridderReponse[1].id,
                infoId: infoResponse[0].id,
            });
        }
        catch (error) {
            if (!error.constraint) {
                response.status(HttpStatusCode_enum_1.HttpStatusCode.BadRequest).send({
                    message: "Unknown error",
                });
            }
            const duplicateField = error.constraint.split("_")[1];
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Conflict).send({
                message: `Duplicate ${duplicateField} detected`,
            });
        }
    }
    async getRidderById(id, response) {
        try {
            const res = await this.ridderService.getRidderById(id);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id",
            });
        }
    }
    async getRidderWithInfoByUserId(id, response) {
        try {
            const res = await this.ridderService.getRidderWithInfoByUserId(id);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id",
            });
        }
    }
    async getRidderWithCollectionByUserId(id, response) {
        try {
            const res = await this.ridderService.getRidderWithCollectionByUserId(id);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id",
            });
        }
    }
    async getPaginationRidders(limit, offset, response) {
        try {
            const res = await this.ridderService.getPaginationRidders(+limit, +offset);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find any ridders",
            });
        }
    }
    async getAllRidders(response) {
        try {
            const res = await this.ridderService.getAllRidders();
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send({
                alert: "This route is currently only for debugging",
                ...res
            });
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find any ridders",
            });
        }
    }
    async updateRidderById(id, updateRidderDto, response) {
        try {
            const res = await this.ridderService.updateRidderById(id, updateRidderDto);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id to update",
            });
        }
    }
    async updateRidderInfoByUserId(id, updatePassengerInfoDto, response) {
        try {
            const res = await this.ridderService.updateRidderInfoByUserId(id, updatePassengerInfoDto);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id to update",
            });
        }
    }
    async deleteRidderById(id, response) {
        try {
            const res = await this.ridderService.deleteRiddderById(id);
            response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(HttpStatusCode_enum_1.HttpStatusCode.NotFound).send({
                message: "Cannot find the ridder with given id to delete",
            });
        }
    }
};
exports.RidderController = RidderController;
__decorate([
    (0, common_1.Post)('createRidderWithInfoAndCollection'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ridder_dto_1.CreateRidderDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "createRidderWithInfoAndCollection", null);
__decorate([
    (0, common_1.Get)('getRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderById", null);
__decorate([
    (0, common_1.Get)('getRidderWithInfoByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderWithInfoByUserId", null);
__decorate([
    (0, common_1.Get)('getRidderWithCollectionByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getRidderWithCollectionByUserId", null);
__decorate([
    (0, common_1.Get)('getPaginationRidders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getPaginationRidders", null);
__decorate([
    (0, common_1.Get)('getAllRidders'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "getAllRidders", null);
__decorate([
    (0, common_1.Patch)('updateRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ridder_dto_1.UpdateRidderDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "updateRidderById", null);
__decorate([
    (0, common_1.Patch)('updateRidderInfoByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_info_dto_1.UpdatePassengerInfoDto, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "updateRidderInfoByUserId", null);
__decorate([
    (0, common_1.Delete)('deleteRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "deleteRidderById", null);
exports.RidderController = RidderController = __decorate([
    (0, common_1.Controller)('ridder'),
    __metadata("design:paramtypes", [ridder_service_1.RidderService])
], RidderController);
//# sourceMappingURL=ridder.controller.js.map