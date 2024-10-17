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
exports.PassengerInfoController = void 0;
const common_1 = require("@nestjs/common");
const passengerInfo_service_1 = require("./passengerInfo.service");
const create_passengerInfo_dto_1 = require("./dto/create-passengerInfo.dto");
const update_passengerInfo_dto_1 = require("./dto/update-passengerInfo.dto");
let PassengerInfoController = class PassengerInfoController {
    constructor(passengerInfoService) {
        this.passengerInfoService = passengerInfoService;
    }
    create(createPassengerInfoDto) {
        return this.passengerInfoService.createPassengerInfo(createPassengerInfoDto);
    }
    findAll() {
        return this.passengerInfoService.findAll();
    }
    findOne(id) {
        return this.passengerInfoService.findOne(+id);
    }
    updatePassengerInfoyById(id, updatePassengerInfoDto) {
        return this.passengerInfoService.updatePassengerInfoById(id, updatePassengerInfoDto);
    }
    updatePassengerInfoByUserId(id, updatePassengerInfoDto) {
        return this.passengerInfoService.updatePassengerInfoByUserId(id, updatePassengerInfoDto);
    }
    remove(id) {
        return this.passengerInfoService.remove(+id);
    }
};
exports.PassengerInfoController = PassengerInfoController;
__decorate([
    (0, common_1.Post)('createPassengerInfoById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_passengerInfo_dto_1.CreatePassengerInfoDto]),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('updatePassengerInfoById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_passengerInfo_dto_1.UpdatePassengerInfoDto]),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "updatePassengerInfoyById", null);
__decorate([
    (0, common_1.Patch)('updatePassengerInfoByUserId/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_passengerInfo_dto_1.UpdatePassengerInfoDto]),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "updatePassengerInfoByUserId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengerInfoController.prototype, "remove", null);
exports.PassengerInfoController = PassengerInfoController = __decorate([
    (0, common_1.Controller)('passenger-info'),
    __metadata("design:paramtypes", [passengerInfo_service_1.PassengerInfoService])
], PassengerInfoController);
//# sourceMappingURL=passengerInfo.controller.js.map