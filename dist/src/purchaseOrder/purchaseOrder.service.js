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
const exceptions_1 = require("../exceptions");
const ridderInvite_schema_1 = require("../drizzle/schema/ridderInvite.schema");
const order_schema_1 = require("../drizzle/schema/order.schema");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
const notificationTemplate_1 = require("../notification/notificationTemplate");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async updateExpiredPurchaseOrders() {
        const response = await this.db.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
            status: "EXPIRED",
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.lt)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date()))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
        });
        if (!response) {
            throw exceptions_1.ServerNeonAutoUpdateExpiredPurchaseOrderException;
        }
        return response.length;
    }
    async createPurchaseOrderByCreatorId(creatorId, createPurchaseOrderDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConflictPurchaseOrders = await tx.select({
                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(createPurchaseOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(createPurchaseOrderDto.endedAt)))));
            const responseOfCreatingPurchaseOrder = await tx.insert(purchaseOrder_schema_1.PurchaseOrderTable).values({
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
                startAfter: new Date(createPurchaseOrderDto.startAfter),
                endedAt: new Date(createPurchaseOrderDto.endedAt),
                isUrgent: createPurchaseOrderDto.isUrgent,
                autoAccept: createPurchaseOrderDto.autoAccept,
            }).returning({
                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0),
                    ...responseOfCreatingPurchaseOrder[0],
                }];
        });
    }
    async getPurchaseOrderById(id) {
        return await this.db.query.PurchaseOrderTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id)),
            columns: {
                id: true,
                initPrice: true,
                description: true,
                startCord: true,
                endCord: true,
                startAddress: true,
                endAddress: true,
                startAfter: true,
                endedAt: true,
                isUrgent: true,
                status: true,
                autoAccept: true,
                createdAt: true,
                updatedAt: true,
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
    async searchPurchaseOrdersByCreatorId(creatorId, limit, offset, isAutoAccept) {
        return await this.db.select({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined))).orderBy((0, drizzle_orm_1.desc)(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchPaginationPurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept) {
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.desc)(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchAboutToStartPurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept) {
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.asc)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter))
            .limit(limit)
            .offset(offset);
    }
    async searchSimliarTimePurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept, getSimilarTimePurchaseOrderDto) {
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${purchaseOrder_schema_1.PurchaseOrderTable.startAfter} - ${getSimilarTimePurchaseOrderDto.startAfter}))) +
              ABS(EXTRACT(EPOCH FROM (${purchaseOrder_schema_1.PurchaseOrderTable.endedAt} - ${getSimilarTimePurchaseOrderDto.endedAt}))) ASC`).limit(limit)
            .offset(offset);
    }
    async searchCurAdjacentPurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto) {
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
        )`)
            .limit(limit)
            .offset(offset);
    }
    async searchDestAdjacentPurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto) {
        await this.updateExpiredPurchaseOrders();
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
        )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRoutePurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept, getSimilarRoutePurchaseOrdersDto) {
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
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
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
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
    async searchBetterFirstPurchaseOrders(creatorName = undefined, limit, offset, isAutoAccept, getBetterPurchaseOrderDto, searchPriorities) {
        let timeQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined, aboutToStartQuery = undefined;
        let spaceResponseField = {};
        if (getBetterPurchaseOrderDto.startAfter || getBetterPurchaseOrderDto.endedAt) {
            timeQuery = (0, drizzle_orm_1.sql) `(
            ${getBetterPurchaseOrderDto.startAfter ?
                (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${purchaseOrder_schema_1.PurchaseOrderTable.startAfter} - ${getBetterPurchaseOrderDto.startAfter})))` :
                (0, drizzle_orm_1.sql) ``}
            ${getBetterPurchaseOrderDto.startAfter && getBetterPurchaseOrderDto.endedAt ? (0, drizzle_orm_1.sql) ` + ` : (0, drizzle_orm_1.sql) ``}
            ${getBetterPurchaseOrderDto.endedAt ?
                (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${purchaseOrder_schema_1.PurchaseOrderTable.endedAt} - ${getBetterPurchaseOrderDto.endedAt})))` :
                (0, drizzle_orm_1.sql) ``}
          ) ASC`;
        }
        if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude
            && getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude) {
            routeQuery = (0, drizzle_orm_1.sql) `(
            ST_Distance(
                ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326)
            ) 
          + ST_Distance(
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326),
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326)
            ) 
          + ST_Distance(
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326),
                ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
            ) 
          - ST_Distance(
                ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
                ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
            )
          ) ASC`;
            spaceResponseField = { RDV: routeQuery };
        }
        if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude) {
            startQuery = (0, drizzle_orm_1.sql) `(
            ST_Distance(
                ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326)
            )
          ) ASC`;
            spaceResponseField = { ...spaceResponseField, startManhattanDistance: startQuery };
        }
        if (getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude) {
            destQuery = (0, drizzle_orm_1.sql) `(
            ST_Distance(
                ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326)
            )
          ) ASC`;
            spaceResponseField = { ...spaceResponseField, destManhattanDistance: destQuery };
        }
        updatedAtQuery = (0, drizzle_orm_1.sql) `${purchaseOrder_schema_1.PurchaseOrderTable.updatedAt} DESC`;
        aboutToStartQuery = (0, drizzle_orm_1.sql) `${purchaseOrder_schema_1.PurchaseOrderTable.startAfter} ASC`;
        const sortMap = {
            'T': timeQuery,
            'R': routeQuery,
            'S': startQuery,
            'D': destQuery,
            'U': updatedAtQuery,
        };
        const searchQueries = searchPriorities.split('')
            .map(symbol => sortMap[symbol])
            .filter(query => query !== undefined);
        searchQueries.push(aboutToStartQuery);
        await this.updateExpiredPurchaseOrders();
        return await this.db.select({
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            ...spaceResponseField,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined)))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
    }
    async updatePurchaseOrderById(id, creatorId, updatePurchaseOrderDto) {
        return await this.db.transaction(async (tx) => {
            const newStartCord = (updatePurchaseOrderDto.startCordLongitude !== undefined
                && updatePurchaseOrderDto.startCordLatitude !== undefined)
                ? { x: updatePurchaseOrderDto.startCordLongitude, y: updatePurchaseOrderDto.startCordLatitude, }
                : undefined;
            const newEndCord = (updatePurchaseOrderDto.endCordLongitude !== undefined
                && updatePurchaseOrderDto.endCordLatitude !== undefined)
                ? { x: updatePurchaseOrderDto.endCordLongitude, y: updatePurchaseOrderDto.endCordLatitude }
                : undefined;
            let responseOfSelectingConflictPurchaseOrders = undefined;
            if (updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt) {
                const [startAfter, endedAt] = [new Date(updatePurchaseOrderDto.startAfter), new Date(updatePurchaseOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPurchaseOrders = await tx.select({
                    id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt)))));
            }
            else if (updatePurchaseOrderDto.startAfter && !updatePurchaseOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED")));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(updatePurchaseOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPurchaseOrders = await tx.select({
                    id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter)))));
            }
            else if (!updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED")));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updatePurchaseOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPurchaseOrders = await tx.select({
                    id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt)))));
            }
            const responseOfUpdatingPurchaseOrder = await tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                description: updatePurchaseOrderDto.description,
                initPrice: updatePurchaseOrderDto.initPrice,
                ...(newStartCord
                    ? { startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)` }
                    : {}),
                ...(newEndCord
                    ? { endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)` }
                    : {}),
                startAddress: updatePurchaseOrderDto.startAddress,
                endAddress: updatePurchaseOrderDto.endAddress,
                ...(updatePurchaseOrderDto.startAfter
                    ? { startAfter: new Date(updatePurchaseOrderDto.startAfter) }
                    : {}),
                ...(updatePurchaseOrderDto.endedAt
                    ? { endedAt: new Date(updatePurchaseOrderDto.endedAt) }
                    : {}),
                isUrgent: updatePurchaseOrderDto.isUrgent,
                autoAccept: updatePurchaseOrderDto.autoAccept,
                status: updatePurchaseOrderDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (updatePurchaseOrderDto.startAfter || updatePurchaseOrderDto.endedAt
                ? undefined
                : (0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "EXPIRED")), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0),
                    ...responseOfUpdatingPurchaseOrder[0],
                }];
        });
    }
    async startPurchaseOrderWithoutInvite(id, userId, userName, acceptAutoAcceptPurchaseOrderDto) {
        return await this.db.transaction(async (tx) => {
            const purchaseOrder = await tx.select({
                passengerName: passenger_schema_1.PassengerTable.userName,
            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
            if (!purchaseOrder || purchaseOrder.length === 0) {
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            }
            const responseOfRejectingOtherRidderInvites = await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                status: "REJECTED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                id: ridderInvite_schema_1.RidderInviteTable.id,
                userId: ridderInvite_schema_1.RidderInviteTable.userId,
            });
            if (responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0) {
                const responseOfCreatingNotificationToRejectOters = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfRejectingOtherRidderInvites.map((content) => {
                    return (0, notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite)(purchaseOrder[0].passengerName, `${purchaseOrder[0].passengerName}'s order purchase order has started directly by some other ridder`, content.userId, content.id);
                }));
                if (!responseOfCreatingNotificationToRejectOters
                    || responseOfCreatingNotificationToRejectOters.length !== responseOfRejectingOtherRidderInvites.length) {
                    throw exceptions_1.ClientCreateRidderNotificationException;
                }
            }
            const responseOfDeletingPurchaseOrder = await tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                status: "RESERVED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true))).returning();
            if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            }
            const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                ridderId: userId,
                passengerId: responseOfDeletingPurchaseOrder[0].creatorId,
                prevOrderId: "PurchaseOrder" + " " + responseOfDeletingPurchaseOrder[0].id,
                finalPrice: responseOfDeletingPurchaseOrder[0].initPrice,
                passengerDescription: responseOfDeletingPurchaseOrder[0].description,
                ridderDescription: acceptAutoAcceptPurchaseOrderDto.description,
                finalStartCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDeletingPurchaseOrder[0].startCord.x}, ${responseOfDeletingPurchaseOrder[0].startCord.y}), 4326)`,
                finalEndCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDeletingPurchaseOrder[0].endCord.x}, ${responseOfDeletingPurchaseOrder[0].endCord.y}), 4326)`,
                finalStartAddress: responseOfDeletingPurchaseOrder[0].startAddress,
                finalEndAddress: responseOfDeletingPurchaseOrder[0].endAddress,
                startAfter: responseOfDeletingPurchaseOrder[0].startAfter,
                endedAt: responseOfDeletingPurchaseOrder[0].endedAt,
            }).returning({
                id: order_schema_1.OrderTable.id,
                finalPrice: order_schema_1.OrderTable.finalPrice,
                finalStartCord: order_schema_1.OrderTable.finalStartCord,
                finalEndCord: order_schema_1.OrderTable.finalEndCord,
                finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                startAfter: order_schema_1.OrderTable.startAfter,
                endedAt: order_schema_1.OrderTable.endedAt,
                status: order_schema_1.OrderTable.passengerStatus,
            });
            if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
                throw exceptions_1.ClientCreateOrderException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfDirectlyStartOrder)(userName, responseOfDeletingPurchaseOrder[0].creatorId, responseOfCreatingOrder[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            return [{
                    orderId: responseOfCreatingOrder[0].id,
                    price: responseOfCreatingOrder[0].finalPrice,
                    finalStartCord: responseOfCreatingOrder[0].finalStartCord,
                    finalEndCord: responseOfCreatingOrder[0].finalEndCord,
                    finalStartAddress: responseOfCreatingOrder[0].finalStartAddress,
                    finalEndAddress: responseOfCreatingOrder[0].finalEndAddress,
                    startAfter: responseOfCreatingOrder[0].startAfter,
                    endedAt: responseOfCreatingOrder[0].endedAt,
                    orderStatus: responseOfCreatingOrder[0].status,
                }];
        });
    }
    async cancelPurchaseOrderById(id, creatorId, creatorName) {
        return await this.db.transaction(async (tx) => {
            const responseOfCancelingPurchaseOrder = await tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                status: "CANCEL",
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"))).returning({
                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                stauts: purchaseOrder_schema_1.PurchaseOrderTable.status,
            });
            if (!responseOfCancelingPurchaseOrder || responseOfCancelingPurchaseOrder.length === 0) {
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            }
            const responseOfCancelingRidderInvite = await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                status: "CANCEL",
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                id: ridderInvite_schema_1.RidderInviteTable.id,
                ridderId: ridderInvite_schema_1.RidderInviteTable.userId,
            });
            if (!responseOfCancelingRidderInvite || responseOfCancelingRidderInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfCancelingRidderInvite.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfCancelingPurchaseOrder)(creatorName, content.ridderId, responseOfCancelingPurchaseOrder[0].id);
            }));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
            return responseOfCancelingPurchaseOrder;
        });
    }
    async deletePurchaseOrderById(id, creatorId) {
        return await this.db.delete(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        });
    }
    async getAllPurchaseOrders() {
        return await this.db.select().from(purchaseOrder_schema_1.PurchaseOrderTable);
    }
    async searchPaginationPurchaseOrdersWithUpdateExpired(updateExpiredData, userName = undefined, limit, offset) {
        if (updateExpiredData) {
            const responseOfUpdatingExpiredPurchaseOrder = await this.db.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                status: "EXPIRED",
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.gte)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date()))).returning({
                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            });
            if (!responseOfUpdatingExpiredPurchaseOrder) {
                throw { message: "test" };
            }
        }
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
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
        if (userName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, userName + "%")));
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
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], PurchaseOrderService);
//# sourceMappingURL=purchaseOrder.service.js.map