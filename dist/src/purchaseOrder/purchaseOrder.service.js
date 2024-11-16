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
let PurchaseOrderService = class PurchaseOrderService {
    constructor(db) {
        this.db = db;
    }
    async createPurchaseOrderByCreatorId(creatorId, createPurchaseOrderDto) {
        return await this.db.insert(purchaseOrder_schema_1.PurchaseOrderTable).values({
            creatorId: creatorId,
            description: createPurchaseOrderDto.description,
            initPrice: createPurchaseOrderDto.initPrice,
            startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.startCordLongitude}, ${createPurchaseOrderDto.startCordLatitude}),
        4326
      )`,
            endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.endCordLongitude}, ${createPurchaseOrderDto.endCordLatitude}),
        4326
      )`,
            startAddress: createPurchaseOrderDto.startAddress,
            endAddress: createPurchaseOrderDto.endAddress,
            startAfter: new Date(createPurchaseOrderDto.startAfter || new Date()),
            isUrgent: createPurchaseOrderDto.isUrgent,
        }).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async getPurchaseOrdersByCreatorId(creatorId, limit, offset) {
        return await this.db.query.PurchaseOrderTable.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId)),
            columns: {
                id: true,
                initPrice: true,
                startCord: true,
                endCord: true,
                startAddress: true,
                endAddress: true,
                createdAt: true,
                updatedAt: true,
                startAfter: true,
                isUrgent: true,
                status: true,
            },
            orderBy: (0, drizzle_orm_1.desc)(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt),
            limit: limit,
            offset: offset,
        });
    }
    async getPurchaseOrderById(id) {
        return await this.db.query.PurchaseOrderTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id)),
            columns: {
                id: true,
                initPrice: true,
                description: true,
                startCord: true,
                endCord: true,
                startAddress: true,
                endAddress: true,
                createdAt: true,
                updatedAt: true,
                startAfter: true,
                isUrgent: true,
                status: true,
            },
            with: {
                creator: {
                    columns: {
                        userName: true,
                    },
                    with: {
                        info: {
                            columns: {
                                isOnline: true,
                                avatorUrl: true,
                            }
                        }
                    }
                }
            }
        });
    }
    async searchPaginationPurchaseOrders(creatorName = undefined, limit, offset) {
        const query = this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.desc)(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentPurchaseOrders(creatorName = undefined, limit, offset, getAdjacentPurchaseOrdersDto) {
        const query = this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
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
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentPurchaseOrders(creatorName = undefined, limit, offset, getAdjacentPurchaseOrdersDto) {
        const query = this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
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
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
            ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRoutePurchaseOrders(creatorName = undefined, limit, offset, getSimilarRoutePurchaseOrdersDto) {
        const query = this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
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
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
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
        return await query;
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
            startAddress: updatePurchaseOrderDto.startAddress,
            endAddress: updatePurchaseOrderDto.endAddress,
            updatedAt: new Date(),
            startAfter: new Date(updatePurchaseOrderDto.startAfter || new Date()),
            isUrgent: updatePurchaseOrderDto.isUrgent,
            status: updatePurchaseOrderDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async deletePurchaseOrderById(id, creatorId) {
        return await this.db.delete(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
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