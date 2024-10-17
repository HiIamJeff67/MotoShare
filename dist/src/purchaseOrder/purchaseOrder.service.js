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
exports.PurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(db) {
        this.db = db;
    }
    async createPurchaseOrder(createPurchaseOrderDto) {
        return await this.db.insert(purchaseOrder_schema_1.PurchaseOrderTable).values({
            creatorId: createPurchaseOrderDto.creatorId,
            description: createPurchaseOrderDto.description ?? undefined,
            initPrice: createPurchaseOrderDto.initPrice,
            startCord: {
                x: createPurchaseOrderDto.startCordLongitude,
                y: createPurchaseOrderDto.startCordLatitude,
            },
            endCord: {
                x: createPurchaseOrderDto.endCordLongitude,
                y: createPurchaseOrderDto.endCordLatitude,
            },
            createdAt: createPurchaseOrderDto.createdAt ?? undefined,
            updatedAt: createPurchaseOrderDto.updatedAt ?? undefined,
            startAfter: createPurchaseOrderDto.startAfter ?? undefined,
            isUrgent: createPurchaseOrderDto.isUrgent ?? undefined,
            status: createPurchaseOrderDto.status ?? undefined,
        }).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
        });
    }
    async getPurchaseOrderById(id) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id));
    }
    async getPurchaseOrderByCreatorId(creatorId) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId));
    }
    async getAllPurchaseOrders() {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable);
    }
    update(id, updatePurchaseOrderDto) {
        return `This action updates a #${id} purchaseOrder`;
    }
    remove(id) {
        return `This action removes a #${id} purchaseOrder`;
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PurchaseOrderService);
//# sourceMappingURL=purchaseOrder.service.js.map