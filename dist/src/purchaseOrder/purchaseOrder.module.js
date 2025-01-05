"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderModule = void 0;
const common_1 = require("@nestjs/common");
const purchaseOrder_service_1 = require("./purchaseOrder.service");
const purchaseOrder_controller_1 = require("./purchaseOrder.controller");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const notification_module_1 = require("../notification/notification.module");
let PurchaseOrderModule = class PurchaseOrderModule {
};
exports.PurchaseOrderModule = PurchaseOrderModule;
exports.PurchaseOrderModule = PurchaseOrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [purchaseOrder_controller_1.PurchaseOrderController],
        providers: [purchaseOrder_service_1.PurchaseOrderService],
        imports: [drizzle_module_1.DrizzleModule, notification_module_1.NotificationModule],
    })
], PurchaseOrderModule);
//# sourceMappingURL=purchaseOrder.module.js.map