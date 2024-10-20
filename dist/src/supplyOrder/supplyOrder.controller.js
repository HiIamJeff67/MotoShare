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
exports.SupplyOrderController = void 0;
const common_1 = require("@nestjs/common");
const supplyOrder_service_1 = require("./supplyOrder.service");
const create_supplyOrder_dto_1 = require("./dto/create-supplyOrder.dto");
const update_supplyOrder_dto_1 = require("./dto/update-supplyOrder.dto");
const get_supplyOrder_dto_1 = require("./dto/get-supplyOrder.dto");
let SupplyOrderController = class SupplyOrderController {
    constructor(supplyOrderService) {
        this.supplyOrderService = supplyOrderService;
    }
    create(id, createSupplyOrderDto) {
        return this.supplyOrderService.createSupplyOrderByCreatorId(id, createSupplyOrderDto);
    }
    getSupplyOrderById(id) {
        return this.supplyOrderService.getSupplyOrderById(id);
    }
    getSupplyOrdersByCreatorId(id, limit = "10", offset = "0") {
        return this.supplyOrderService.getSupplyOrdersByCreatorId(id, +limit, +offset);
    }
    getSupplyOrders(limit = "10", offset = "0") {
        return this.supplyOrderService.getSupplyOrders(+limit, +offset);
    }
    getCurAdjacentSupplyOrders(limit = "10", offset = "0", getCurAdjacentSupplyOrderDto) {
        return this.supplyOrderService.getCurAdjacentSupplyOrders(+limit, +offset, getCurAdjacentSupplyOrderDto);
    }
    updateSupplyOrderById(id, updateSupplyOrderDto) {
        return this.supplyOrderService.updateSupplyOrderById(id, updateSupplyOrderDto);
    }
    deleteSupplyOrderById(id) {
        return this.supplyOrderService.deleteSupplyOrderById(id);
    }
};
exports.SupplyOrderController = SupplyOrderController;
__decorate([
    (0, common_1.Post)('createSupplyOrderByCreatorId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_supplyOrder_dto_1.CreateSupplyOrderDto]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('getSupplyOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "getSupplyOrderById", null);
__decorate([
    (0, common_1.Get)('getSupplyOrdersByCreatorId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "getSupplyOrdersByCreatorId", null);
__decorate([
    (0, common_1.Get)('getSupplyOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "getSupplyOrders", null);
__decorate([
    (0, common_1.Get)('getCurAdjacentSupplyOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, get_supplyOrder_dto_1.GetCurAdjacentSupplyOrderDto]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "getCurAdjacentSupplyOrders", null);
__decorate([
    (0, common_1.Patch)('updateSupplyOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplyOrder_dto_1.UpdateSupplyOrderDto]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "updateSupplyOrderById", null);
__decorate([
    (0, common_1.Delete)('deleteSupplyOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplyOrderController.prototype, "deleteSupplyOrderById", null);
exports.SupplyOrderController = SupplyOrderController = __decorate([
    (0, common_1.Controller)('supplyOrder'),
    __metadata("design:paramtypes", [supplyOrder_service_1.SupplyOrderService])
], SupplyOrderController);
//# sourceMappingURL=supplyOrder.controller.js.map