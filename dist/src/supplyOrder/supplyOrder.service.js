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
let SupplyOrderService = class SupplyOrderService {
    constructor(db) {
        this.db = db;
    }
    async createSupplyOrderByCreatorId(creatorId, createSupplyOrderDto) {
        return await this.db.insert(supplyOrder_schema_1.SupplyOrderTable).values({
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
            startAfter: new Date(createSupplyOrderDto.startAfter || new Date()),
            endedAt: new Date(createSupplyOrderDto.endedAt || new Date()),
            tolerableRDV: createSupplyOrderDto.tolerableRDV,
        }).returning({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        });
    }
    async getSupplyOrdersByCreatorId(creatorId, limit, offset) {
        return await this.db.query.SupplyOrderTable.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId)),
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
                endedAt: true,
                tolerableRDV: true,
                status: true,
            },
            orderBy: (0, drizzle_orm_1.desc)(supplyOrder_schema_1.SupplyOrderTable.updatedAt),
            limit: limit,
            offset: offset,
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
    async searchPaginationSupplyOrders(creatorName = undefined, limit, offset) {
        const query = this.db.select({
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
            status: supplyOrder_schema_1.SupplyOrderTable.status,
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(supplyOrder_schema_1.SupplyOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentSupplyOrders(creatorName = undefined, limit, offset, getAdjacentSupplyOrdersDto) {
        const query = this.db.select({
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
            status: supplyOrder_schema_1.SupplyOrderTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord}, 
            ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentSupplyOrders(creatorName = undefined, limit, offset, getAdjacentSupplyOrdersDto) {
        const query = this.db.select({
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
            status: supplyOrder_schema_1.SupplyOrderTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
        }).from(supplyOrder_schema_1.SupplyOrderTable)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.endCord},
            ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRouteSupplyOrders(creatorName = undefined, limit, offset, getSimilarRouteSupplyOrdersDto) {
        const query = this.db.select({
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
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        if (creatorName) {
            query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, creatorName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
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
        return await query;
    }
    async updateSupplyOrderById(id, creatorId, updateSupplyOrderDto) {
        const newStartCord = (updateSupplyOrderDto.startCordLongitude !== undefined
            && updateSupplyOrderDto.startCordLatitude !== undefined)
            ? { x: updateSupplyOrderDto.startCordLongitude, y: updateSupplyOrderDto.startCordLatitude, }
            : undefined;
        const newEndCord = (updateSupplyOrderDto.endCordLongitude !== undefined
            && updateSupplyOrderDto.endCordLatitude !== undefined)
            ? { x: updateSupplyOrderDto.endCordLongitude, y: updateSupplyOrderDto.endCordLatitude }
            : undefined;
        return await this.db.update(supplyOrder_schema_1.SupplyOrderTable).set({
            description: updateSupplyOrderDto.description,
            initPrice: updateSupplyOrderDto.initPrice,
            startCord: newStartCord,
            endCord: newEndCord,
            startAddress: updateSupplyOrderDto.startAddress,
            endAddress: updateSupplyOrderDto.endAddress,
            updatedAt: new Date(),
            startAfter: new Date(updateSupplyOrderDto.startAfter || new Date()),
            endedAt: new Date(updateSupplyOrderDto.endedAt || new Date()),
            tolerableRDV: updateSupplyOrderDto.tolerableRDV,
            status: updateSupplyOrderDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId))).returning({
            id: supplyOrder_schema_1.SupplyOrderTable.id,
            status: supplyOrder_schema_1.SupplyOrderTable.status,
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
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], SupplyOrderService);
//# sourceMappingURL=supplyOrder.service.js.map