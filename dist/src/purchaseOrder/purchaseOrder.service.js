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
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const purchaseOrder_schema_1 = require("../../src/drizzle/schema/purchaseOrder.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(db) {
        this.db = db;
    }
    async createPurchaseOrderByCreatorId(creatorId, createPurchaseOrderDto) {
        return await this.db.insert(purchaseOrder_schema_1.PurchaseOrderTable).values({
            creatorId: creatorId,
            description: createPurchaseOrderDto.description ?? undefined,
            initPrice: createPurchaseOrderDto.initPrice,
            startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.startCordLongitude}, ${createPurchaseOrderDto.startCordLatitude}),
        4326
      )`,
            endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.endCordLongitude}, ${createPurchaseOrderDto.endCordLatitude}),
        4326
      )`,
            startAfter: createPurchaseOrderDto.startAfter ?? undefined,
            isUrgent: createPurchaseOrderDto.isUrgent ?? undefined,
        }).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async getPurchaseOrdersByCreatorId(creatorId, limit, offset) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))
            .orderBy((0, drizzle_orm_1.desc)(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async getPurchaseOrderById(id) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .limit(1);
    }
    async searchPurchaseOrderByCreatorName(creatorName, limit, offset) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, creatorName))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt)
            .limit(limit)
            .offset(offset);
    }
    async searchPaginationPurchaseOrders(limit, offset) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .limit(limit)
            .offset(offset);
    }
    async searchCurAdjacentPurchaseOrders(limit, offset, getAdjacentPurchaseOrdersDto) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchDestAdjacentPurchaseOrders(limit, offset, getAdjacentPurchaseOrdersDto) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchSimilarRoutePurchaseOrders(limit, offset, getSimilarRoutePurchaseOrdersDto) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            RDV: (0, drizzle_orm_1.sql) `
          ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326),
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
          ) 
        - ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
          )
      `,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `
          ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326),
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
          ) 
        - ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
          )
      `)
            .limit(limit)
            .offset(offset);
    }
    async updatePurchaseOrderById(id, creatorId, updatePurchaseOrderDto) {
        const newStartCord = (updatePurchaseOrderDto.startCordLongitude !== undefined
            && updatePurchaseOrderDto.startCordLatitude !== undefined)
            ? { x: updatePurchaseOrderDto.startCordLongitude, y: updatePurchaseOrderDto.startCordLatitude, }
            : undefined;
        const newEndCord = (updatePurchaseOrderDto.endCordLongitude !== undefined
            && updatePurchaseOrderDto.endCordLatitude !== undefined)
            ? { x: updatePurchaseOrderDto.endCordLongitude, y: updatePurchaseOrderDto.endCordLatitude }
            : undefined;
        return await this.db.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
            description: updatePurchaseOrderDto.description,
            initPrice: updatePurchaseOrderDto.initPrice,
            startCord: newStartCord,
            endCord: newEndCord,
            updatedAt: new Date(),
            startAfter: updatePurchaseOrderDto.startAfter,
            isUrgent: updatePurchaseOrderDto.isUrgent,
            status: updatePurchaseOrderDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId)))
            .returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async deletePurchaseOrderById(id, creatorId) {
        return await this.db.delete(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId)))
            .returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            deletedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async getAllPurchaseOrders() {
        return await this.db.select().from(purchaseOrder_schema_1.PurchaseOrderTable);
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PurchaseOrderService);
//# sourceMappingURL=purchaseOrder.service.js.map