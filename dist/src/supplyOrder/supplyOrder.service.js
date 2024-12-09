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
exports.SupplyOrderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const supplyOrder_schema_1 = require("../../src/drizzle/schema/supplyOrder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const exceptions_1 = require("../exceptions");
const passengerInvite_schema_1 = require("../drizzle/schema/passengerInvite.schema");
const order_schema_1 = require("../drizzle/schema/order.schema");
const notificationTemplate_1 = require("../notification/notificationTemplate");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
let SupplyOrderService = class SupplyOrderService {
    constructor(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async updateExpiredSupplyOrders() {
        const response = await this.db.update(supplyOrder_schema_1.SupplyOrderTable).set({
            status: "EXPIRED",
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.lt)(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date()))).returning({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
        });
        if (!response) {
            throw exceptions_1.ServerNeonAutoUpdateExpiredSupplyOrderException;
        }
        return response.length;
    }
    async createSupplyOrderByCreatorId(creatorId, createSupplyOrderDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConflictSupplyOrders = await tx.select({
                id: supplyOrder_schema_1.SupplyOrderTable.id,
            }).from(supplyOrder_schema_1.SupplyOrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(createSupplyOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(createSupplyOrderDto.endedAt)))));
            const responseOfCreatingSupplyOrder = await tx.insert(supplyOrder_schema_1.SupplyOrderTable).values({
                creatorId: creatorId,
                description: createSupplyOrderDto.description,
                initPrice: createSupplyOrderDto.initPrice,
                startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createSupplyOrderDto.startCordLongitude}, ${createSupplyOrderDto.startCordLatitude}), 
          4326
        )`,
                endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createSupplyOrderDto.endCordLongitude}, ${createSupplyOrderDto.endCordLatitude}), 
          4326
        )`,
                startAddress: createSupplyOrderDto.startAddress,
                endAddress: createSupplyOrderDto.endAddress,
                startAfter: new Date(createSupplyOrderDto.startAfter),
                endedAt: new Date(createSupplyOrderDto.endedAt),
                tolerableRDV: createSupplyOrderDto.tolerableRDV,
                autoAccept: createSupplyOrderDto.autoAccept,
            }).returning({
                id: supplyOrder_schema_1.SupplyOrderTable.id,
                status: supplyOrder_schema_1.SupplyOrderTable.status,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0),
                    ...responseOfCreatingSupplyOrder[0],
                }];
        });
    }
    async getSupplyOrderById(id) {
        return await this.db.query.SupplyOrderTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id)),
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
                endedAt: true,
                tolerableRDV: true,
                autoAccept: true,
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
                                motocycleType: true,
                                motocyclePhotoUrl: true,
                            }
                        }
                    }
                }
            }
        });
    }
    async searchSupplyOrdersByCreatorId(creatorId, limit, offset, isAutoAccept) {
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined))).orderBy((0, drizzle_orm_1.desc)(supplyOrder_schema_1.SupplyOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchPaginationSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(supplyOrder_schema_1.SupplyOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchAboutToStartSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.asc)(supplyOrder_schema_1.SupplyOrderTable.startAfter))
            .limit(limit)
            .offset(offset);
    }
    async searchSimilarTimeSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept, getSimilarTimeSupplyOrderDto) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${supplyOrder_schema_1.SupplyOrderTable.startAfter} - ${getSimilarTimeSupplyOrderDto.startAfter}))) + 
              ABS(EXTRACT(EPOCH FROM (${supplyOrder_schema_1.SupplyOrderTable.endedAt} - ${getSimilarTimeSupplyOrderDto.endedAt})))`).limit(limit)
            .offset(offset);
    }
    async searchCurAdjacentSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept, getAdjacentSupplyOrdersDto) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord}, 
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
            .limit(limit)
            .offset(offset);
    }
    async searchDestAdjacentSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept, getAdjacentSupplyOrdersDto) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
            .limit(limit)
            .offset(offset);
    }
    async searchSimilarRouteSupplyOrders(creatorName = undefined, limit, offset, isAutoAccept, getSimilarRouteSupplyOrdersDto) {
        await this.updateExpiredSupplyOrders();
        return await this.db.select({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            creatorName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
            RDV: (0, drizzle_orm_1.sql) `
          ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326),
            ${supplyOrder_schema_1.SupplyOrderTable.endCord}
          ) 
        - ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord},
            ${supplyOrder_schema_1.SupplyOrderTable.endCord}
          )
      `,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), (creatorName ? (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `
          ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326),
            ${supplyOrder_schema_1.SupplyOrderTable.endCord}
          ) 
        - ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord},
            ${supplyOrder_schema_1.SupplyOrderTable.endCord}
          )
        `)
            .limit(limit)
            .offset(offset);
    }
    async updateSupplyOrderById(id, creatorId, updateSupplyOrderDto) {
        return await this.db.transaction(async (tx) => {
            const newStartCord = (updateSupplyOrderDto.startCordLongitude !== undefined
                && updateSupplyOrderDto.startCordLatitude !== undefined)
                ? { x: updateSupplyOrderDto.startCordLongitude, y: updateSupplyOrderDto.startCordLatitude, }
                : undefined;
            const newEndCord = (updateSupplyOrderDto.endCordLongitude !== undefined
                && updateSupplyOrderDto.endCordLatitude !== undefined)
                ? { x: updateSupplyOrderDto.endCordLongitude, y: updateSupplyOrderDto.endCordLatitude }
                : undefined;
            let responseOfSelectingConflictSupplyOrders = undefined;
            if (updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
                const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(updateSupplyOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictSupplyOrders = await tx.select({
                    id: supplyOrder_schema_1.SupplyOrderTable.id,
                }).from(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt)))));
            }
            else if (updateSupplyOrderDto.startAfter && !updateSupplyOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                }).from(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictSupplyOrders = await tx.select({
                    id: supplyOrder_schema_1.SupplyOrderTable.id,
                }).from(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter)))));
            }
            else if (!updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                }).from(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updateSupplyOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictSupplyOrders = await tx.select({
                    id: supplyOrder_schema_1.SupplyOrderTable.id,
                }).from(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt)))));
            }
            const resposeOfUpdatingSupplyOrder = await tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                description: updateSupplyOrderDto.description,
                initPrice: updateSupplyOrderDto.initPrice,
                startCord: newStartCord,
                endCord: newEndCord,
                startAddress: updateSupplyOrderDto.startAddress,
                endAddress: updateSupplyOrderDto.endAddress,
                ...(updateSupplyOrderDto.startAfter
                    ? { startAfter: new Date(updateSupplyOrderDto.startAfter) }
                    : {}),
                ...(updateSupplyOrderDto.endedAt
                    ? { endedAt: new Date(updateSupplyOrderDto.endedAt) }
                    : {}),
                tolerableRDV: updateSupplyOrderDto.tolerableRDV,
                autoAccept: updateSupplyOrderDto.autoAccept,
                status: updateSupplyOrderDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (updateSupplyOrderDto.startAfter || updateSupplyOrderDto.endedAt
                ? undefined
                : (0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "EXPIRED")), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId))).returning({
                id: supplyOrder_schema_1.SupplyOrderTable.id,
                status: supplyOrder_schema_1.SupplyOrderTable.status,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0),
                    ...resposeOfUpdatingSupplyOrder[0],
                }];
        });
    }
    async startSupplyOrderWithoutInvite(id, userId, userName, acceptAutoAcceptSupplyOrderDto) {
        return await this.db.transaction(async (tx) => {
            const supplyOrder = await tx.select({
                ridderName: ridder_schema_1.RidderTable.userName,
            }).from(supplyOrder_schema_1.SupplyOrderTable)
                .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id));
            if (!supplyOrder || supplyOrder.length === 0) {
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            }
            const responseOfRejectingOtherPassengerInvites = await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                status: "REJECTED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).returning({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
                userId: passengerInvite_schema_1.PassengerInviteTable.userId,
            });
            if (responseOfRejectingOtherPassengerInvites && responseOfRejectingOtherPassengerInvites.length !== 0) {
                const responseOfCreatingNotificationToRejectOthers = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfRejectingOtherPassengerInvites.map((content) => {
                    return (0, notificationTemplate_1.NotificationTemplateOfRejectingPassengerInvite)(supplyOrder[0].ridderName, `${supplyOrder[0].ridderName}'s supply order has started directly by some other passenger`, content.userId, content.id);
                }));
                if (!responseOfCreatingNotificationToRejectOthers
                    || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherPassengerInvites.length) {
                    throw exceptions_1.ClientCreatePassengerNotificationException;
                }
            }
            const responseOfDeletingSupplyOrder = await tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                status: "RESERVED",
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true))).returning();
            if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            }
            const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                ridderId: responseOfDeletingSupplyOrder[0].creatorId,
                passengerId: userId,
                prevOrderId: "PurchaseOrder" + " " + responseOfDeletingSupplyOrder[0].id,
                finalPrice: responseOfDeletingSupplyOrder[0].initPrice,
                passengerDescription: responseOfDeletingSupplyOrder[0].description,
                ridderDescription: acceptAutoAcceptSupplyOrderDto.description,
                finalStartCord: responseOfDeletingSupplyOrder[0].startCord,
                finalEndCord: responseOfDeletingSupplyOrder[0].endCord,
                finalStartAddress: responseOfDeletingSupplyOrder[0].startAddress,
                finalEndAddress: responseOfDeletingSupplyOrder[0].endAddress,
                startAfter: responseOfDeletingSupplyOrder[0].startAfter,
                endedAt: responseOfDeletingSupplyOrder[0].endedAt,
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
            const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfDirectlyStartOrder)(userName, responseOfDeletingSupplyOrder[0].creatorId, responseOfCreatingOrder[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
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
    async cancelSupplyOrderById(id, creatorId, creatorName) {
        return await this.db.transaction(async (tx) => {
            const responseOfCancelingSupplyOrder = await tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                status: "CANCEL",
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"))).returning({
                id: supplyOrder_schema_1.SupplyOrderTable.id,
                stauts: supplyOrder_schema_1.SupplyOrderTable.status,
            });
            if (!responseOfCancelingSupplyOrder || responseOfCancelingSupplyOrder.length === 0) {
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            }
            const responseOfCancelingPassengerInvite = await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                status: "CANCEL",
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).returning({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
                passengerId: passengerInvite_schema_1.PassengerInviteTable.userId,
            });
            if (!responseOfCancelingPassengerInvite || responseOfCancelingPassengerInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfCancelingPassengerInvite.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfCancelingSupplyOrder)(creatorName, content.passengerId, responseOfCancelingSupplyOrder[0].id);
            }));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            return responseOfCancelingSupplyOrder;
        });
    }
    async deleteSupplyOrderById(id, creatorId) {
        return await this.db.delete(supplyOrder_schema_1.SupplyOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId))).returning({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        });
    }
};
exports.SupplyOrderService = SupplyOrderService;
exports.SupplyOrderService = SupplyOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], SupplyOrderService);
//# sourceMappingURL=supplyOrder.service.js.map