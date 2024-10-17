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
exports.PassengerController = void 0;
const common_1 = require("@nestjs/common");
const passenger_service_1 = require("./passenger.service");
const create_passenger_dto_1 = require("./dto/create-passenger.dto");
const update_passenger_dto_1 = require("./dto/update-passenger.dto");
let PassengerController = class PassengerController {
    constructor(passengerService) {
        this.passengerService = passengerService;
    }
    createPassenger(createPassengerDto) {
        return this.passengerService.createPassenger(createPassengerDto);
    }
    getPassengerById(id) {
        return this.passengerService.getPassengerById(id);
    }
    getAllPassengers() {
        return this.passengerService.getAllPassengers();
    }
    updatePassengerById(id, updatePassengerDto) {
        return this.passengerService.updatePassengerById(id, updatePassengerDto);
    }
    deletePassengerById(id) {
        return this.passengerService.deletePassengerById(id);
    }
};
exports.PassengerController = PassengerController;
__decorate([
    (0, common_1.Post)('createPassenger'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_passenger_dto_1.CreatePassengerDto]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "createPassenger", null);
__decorate([
    (0, common_1.Get)('getPassengerById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getPassengerById", null);
__decorate([
    (0, common_1.Get)('getAllPassengers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "getAllPassengers", null);
__decorate([
    (0, common_1.Patch)('updatePassengerById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_passenger_dto_1.UpdatePassengerDto]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "updatePassengerById", null);
__decorate([
    (0, common_1.Delete)('deletePassengerById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengerController.prototype, "deletePassengerById", null);
exports.PassengerController = PassengerController = __decorate([
    (0, common_1.Controller)('passenger'),
    __metadata("design:paramtypes", [passenger_service_1.PassengerService])
], PassengerController);
//# sourceMappingURL=passenger.controller.js.map