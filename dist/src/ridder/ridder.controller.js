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
const create_ridder_dto_1 = require("./dto/create-ridder.dto");
const update_ridder_dto_1 = require("./dto/update-ridder.dto");
const update_info_dto_1 = require("../passenger/dto/update-info.dto");
const signIn_ridder_dto_1 = require("./dto/signIn-ridder.dto");
let RidderController = class RidderController {
    constructor(ridderService) {
        this.ridderService = ridderService;
    }
    async createRidderWithInfoAndCollection(createRidderDto) {
        const ridderReponse = await this.ridderService.createRidder(createRidderDto);
        const infoResponse = await this.ridderService.createRidderInfoByUserId(ridderReponse[0].id);
        const collectionResponse = await this.ridderService.createRidderCollectionByUserId(ridderReponse[0].id);
        return {
            ridderId: ridderReponse[0].id,
            infoId: infoResponse[0].id,
            collectionId: collectionResponse[0].id,
        };
    }
    signInRidderByEamilAndPassword(signInRidderDto) {
        return this.ridderService.signInRidderByEamilAndPassword(signInRidderDto);
    }
    getRidderById(id) {
        return this.ridderService.getRidderById(id);
    }
    getRidderWithInfoByUserId(id) {
        return this.ridderService.getRidderWithInfoByUserId(id);
    }
    getRidderWithCollectionByUserId(id) {
        return this.ridderService.getRidderWithCollectionByUserId(id);
    }
    getPaginationRidders(limit, offset) {
        return this.ridderService.getPaginationRidders(+limit, +offset);
    }
    getAllRidders() {
        return this.ridderService.getAllRidders();
    }
    updateRidderById(id, updateRidderDto) {
        return this.ridderService.updateRidderById(id, updateRidderDto);
    }
    updateRidderInfoByUserId(id, updatePassengerInfoDto) {
        return this.ridderService.updateRidderInfoByUserId(id, updatePassengerInfoDto);
    }
    deleteRidderById(id) {
        return this.ridderService.deleteRiddderById(id);
    }
};
exports.RidderController = RidderController;
__decorate([
    (0, common_1.Post)('createRidderWithInfoAndCollection'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ridder_dto_1.CreateRidderDto]),
    __metadata("design:returntype", Promise)
], RidderController.prototype, "createRidderWithInfoAndCollection", null);
__decorate([
    (0, common_1.Get)('signInRidderByEamilAndPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_ridder_dto_1.SignInRidderDto]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "signInRidderByEamilAndPassword", null);
__decorate([
    (0, common_1.Get)('getRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "getRidderById", null);
__decorate([
    (0, common_1.Get)('getRidderWithInfoByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "getRidderWithInfoByUserId", null);
__decorate([
    (0, common_1.Get)('getRidderWithCollectionByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "getRidderWithCollectionByUserId", null);
__decorate([
    (0, common_1.Get)('getPaginationRidders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "getPaginationRidders", null);
__decorate([
    (0, common_1.Get)('getAllRidders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "getAllRidders", null);
__decorate([
    (0, common_1.Patch)('updateRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ridder_dto_1.UpdateRidderDto]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "updateRidderById", null);
__decorate([
    (0, common_1.Patch)('updateRidderInfoByUserId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_info_dto_1.UpdatePassengerInfoDto]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "updateRidderInfoByUserId", null);
__decorate([
    (0, common_1.Delete)('deleteRidderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidderController.prototype, "deleteRidderById", null);
exports.RidderController = RidderController = __decorate([
    (0, common_1.Controller)('ridder'),
    __metadata("design:paramtypes", [ridder_service_1.RidderService])
], RidderController);
//# sourceMappingURL=ridder.controller.js.map