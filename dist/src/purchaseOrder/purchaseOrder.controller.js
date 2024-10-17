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
let PurchaseOrderController = class PurchaseOrderController {
    constructor(purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }
    createPurchaseOrder(createPurchaseOrderDto) {
        return this.purchaseOrderService.createPurchaseOrder(createPurchaseOrderDto);
    }
    getPurchaseOrderById(id) {
        return this.purchaseOrderService.getPurchaseOrderById(id);
    }
    getPurchaseOrderByCreatorId(creatorId) {
        return this.purchaseOrderService.getPurchaseOrderByCreatorId(creatorId);
    }
    getAllPurchaseOrders() {
        return this.purchaseOrderService.getAllPurchaseOrders();
    }
    update(id, updatePurchaseOrderDto) {
        return this.purchaseOrderService.update(+id, updatePurchaseOrderDto);
    }
    remove(id) {
        return this.purchaseOrderService.remove(+id);
    }
};
exports.PurchaseOrderController = PurchaseOrderController;
__decorate([
    (0, common_1.Post)('createPurchaseOrder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchaseOrder_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "createPurchaseOrder", null);
__decorate([
    (0, common_1.Get)('getPurchaseOrderById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getPurchaseOrderById", null);
__decorate([
    (0, common_1.Get)('getPurchaseOrderByCreatorId/:creatorId'),
    __param(0, (0, common_1.Param)('creatorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getPurchaseOrderByCreatorId", null);
__decorate([
    (0, common_1.Get)('getAllPurchaseOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getAllPurchaseOrders", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchaseOrder_dto_1.UpdatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "remove", null);
exports.PurchaseOrderController = PurchaseOrderController = __decorate([
    (0, common_1.Controller)('purchaseOrder'),
    __metadata("design:paramtypes", [purchaseOrder_service_1.PurchaseOrderService])
], PurchaseOrderController);
//# sourceMappingURL=purchaseOrder.controller.js.map