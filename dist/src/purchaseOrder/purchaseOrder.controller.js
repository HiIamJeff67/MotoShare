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
exports.PurchaseOrderController = void 0;
const common_1 = require("@nestjs/common");
const purchaseOrder_service_1 = require("./purchaseOrder.service");
const create_purchaseOrder_dto_1 = require("./dto/create-purchaseOrder.dto");
const update_purchaseOrder_dto_1 = require("./dto/update-purchaseOrder.dto");
const get_purchaseOrder_dto_1 = require("./dto/get-purchaseOrder.dto");
let PurchaseOrderController = class PurchaseOrderController {
    constructor(purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }
    createPurchaseOrderByCreatorId(id, createPurchaseOrderDto) {
        return this.purchaseOrderService.createPurchaseOrderByCreatorId(id, createPurchaseOrderDto);
    }
    getPurchaseOrderById(id) {
        return this.purchaseOrderService.getPurchaseOrderById(id);
    }
    getPurchaseOrdersByCreatorId(id, limit = "10", offset = "0") {
        return this.purchaseOrderService.getPurchaseOrdersByCreatorId(id, +limit, +offset);
    }
    getPurchaseOrders(limit = "10", offset = "0") {
        return this.purchaseOrderService.getPurchaseOrders(+limit, +offset);
    }
    getCurAdjacentPurchaseOrders(limit = "10", offset = "0", getAdjacentPurchaseOrdersDto) {
        return this.purchaseOrderService.getCurAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);
    }
    getDestAdjacentPurchaseOrders(limit = "10", offset = "0", getAdjacentPurchaseOrdersDto) {
        return this.purchaseOrderService.getDestAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);
    }
    getSimilarRoutePurchaseOrders(limit = "10", offset = "0", getSimilarRoutePurchaseOrdersDto) {
        return this.purchaseOrderService.getSimilarRoutePurchaseOrders(+limit, +offset, getSimilarRoutePurchaseOrdersDto);
    }
    updatePurchaseOrderById(id, updatePurchaseOrderDto) {
        return this.purchaseOrderService.updatePurchaseOrderById(id, updatePurchaseOrderDto);
    }
    deletePurchaseOrderById(id) {
        return this.purchaseOrderService.deletePurchaseOrderById(id);
    }
    getAllPurchaseOrders() {
        return this.purchaseOrderService.getAllPurchaseOrders();
    }
};
exports.PurchaseOrderController = PurchaseOrderController;
__decorate([
    (0, common_1.Post)('createPurchaseOrderByCreatorId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_purchaseOrder_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "createPurchaseOrderByCreatorId", null);
__decorate([
    (0, common_1.Get)('getPurchaseOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getPurchaseOrderById", null);
__decorate([
    (0, common_1.Get)('getPurchaseOrdersByCreatorId'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getPurchaseOrdersByCreatorId", null);
__decorate([
    (0, common_1.Get)('getPurchaseOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('getCurAdjacentPurchaseOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, get_purchaseOrder_dto_1.GetAdjacentPurchaseOrdersDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getCurAdjacentPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('getDestAdjacentPurchaseOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, get_purchaseOrder_dto_1.GetAdjacentPurchaseOrdersDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getDestAdjacentPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('getSimilarRoutePurchaseOrders'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, get_purchaseOrder_dto_1.GetSimilarRoutePurchaseOrdersDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getSimilarRoutePurchaseOrders", null);
__decorate([
    (0, common_1.Patch)('updatePurchaseOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchaseOrder_dto_1.UpdatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "updatePurchaseOrderById", null);
__decorate([
    (0, common_1.Delete)('deletePurchaseOrderById'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "deletePurchaseOrderById", null);
__decorate([
    (0, common_1.Get)('getAllPurchaseOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getAllPurchaseOrders", null);
exports.PurchaseOrderController = PurchaseOrderController = __decorate([
    (0, common_1.Controller)('purchaseOrder'),
    __metadata("design:paramtypes", [purchaseOrder_service_1.PurchaseOrderService])
], PurchaseOrderController);
//# sourceMappingURL=purchaseOrder.controller.js.map