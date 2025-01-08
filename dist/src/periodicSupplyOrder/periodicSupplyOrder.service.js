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
exports.PeriodicSupplyOrderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const periodicSupplyOrder_schema_1 = require("../drizzle/schema/periodicSupplyOrder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
let PeriodicSupplyOrderService = class PeriodicSupplyOrderService {
    constructor(db) {
        this.db = db;
    }
    async createPeriodicSupplyOrderByCreatorId(creatorId, createPeriodicSupplyOrderDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
                id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
            }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.endedAt, new Date(createPeriodicSupplyOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.startAfter, new Date(createPeriodicSupplyOrderDto.endedAt)))));
            const responseOfCreatingPeriodicSupplyOrder = await tx.insert(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable).values({
                creatorId: creatorId,
                scheduledDay: createPeriodicSupplyOrderDto.scheduledDay,
                initPrice: createPeriodicSupplyOrderDto.initPrice,
                startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
            ST_MakePoint(${createPeriodicSupplyOrderDto.startCordLongitude}, ${createPeriodicSupplyOrderDto.startCordLatitude}),
            4326
          )`,
                endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
            ST_MakePoint(${createPeriodicSupplyOrderDto.endCordLongitude}, ${createPeriodicSupplyOrderDto.endCordLatitude}),
            4326
          )`,
                startAddress: createPeriodicSupplyOrderDto.startAddress,
                endAddress: createPeriodicSupplyOrderDto.endAddress,
                startAfter: new Date(createPeriodicSupplyOrderDto.startAfter),
                endedAt: new Date(createPeriodicSupplyOrderDto.endedAt),
                tolerableRDV: createPeriodicSupplyOrderDto.tolerableRDV,
                autoAccept: createPeriodicSupplyOrderDto.autoAccept,
            }).returning({
                id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPeriodicSupplyOrders && responseOfSelectingConflictPeriodicSupplyOrders.length !== 0),
                    ...responseOfCreatingPeriodicSupplyOrder[0],
                }];
        });
    }
    async getPeriodicSupplyOrderById(id, creatorId) {
        return await this.db.query.PeriodicSupplyOrderTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId)),
            columns: {
                id: true,
                scheduledDay: true,
                initPrice: true,
                startCord: true,
                endCord: true,
                startAddress: true,
                endAddress: true,
                startAfter: true,
                endedAt: true,
                tolerableRDV: true,
                autoAccept: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async searchPaginationPeriodicSupplyOrders(creatorId, scheduledDay = undefined, limit, offset, isAutoAccept) {
        return await this.db.select({
            id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
            scheduledDay: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.scheduledDay,
            autoAccept: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.autoAccept,
            startAfter: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.startAfter,
            endedAt: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.endedAt,
            createdAt: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.createdAt,
            updatedAt: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.updatedAt,
        }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId), (scheduledDay ? (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.scheduledDay, scheduledDay) : undefined), (isAutoAccept ? (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.autoAccept, isAutoAccept) : undefined))).orderBy((0, drizzle_orm_1.desc)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async updatePeriodicSupplyOrderById(id, creatorId, updatePeriodicSupplyOrderDto) {
        return await this.db.transaction(async (tx) => {
            const newStartCord = (updatePeriodicSupplyOrderDto.startCordLongitude !== undefined
                && updatePeriodicSupplyOrderDto.startCordLatitude !== undefined)
                ? { x: updatePeriodicSupplyOrderDto.startCordLongitude,
                    y: updatePeriodicSupplyOrderDto.startCordLatitude, }
                : undefined;
            const newEndCord = (updatePeriodicSupplyOrderDto.endCordLongitude !== undefined
                && updatePeriodicSupplyOrderDto.endCordLatitude !== undefined)
                ? { x: updatePeriodicSupplyOrderDto.endCordLongitude,
                    y: updatePeriodicSupplyOrderDto.endCordLatitude }
                : undefined;
            let responseOfSelectingConflictPeriodicSupplyOrders = undefined;
            if (updatePeriodicSupplyOrderDto.startAfter && updatePeriodicSupplyOrderDto.endedAt) {
                const [startAfter, endedAt] = [new Date(updatePeriodicSupplyOrderDto.startAfter), new Date(updatePeriodicSupplyOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
                    id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
                }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.endedAt, new Date(updatePeriodicSupplyOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.startAfter, new Date(updatePeriodicSupplyOrderDto.endedAt)))));
            }
            else if (updatePeriodicSupplyOrderDto.startAfter && !updatePeriodicSupplyOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    endedAt: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.endedAt,
                }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(updatePeriodicSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
                    id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
                }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.endedAt, new Date(updatePeriodicSupplyOrderDto.startAfter)))));
            }
            else if (!updatePeriodicSupplyOrderDto.startAfter && updatePeriodicSupplyOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    startAfter: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.startAfter,
                }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPeriodicSupplyOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updatePeriodicSupplyOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
                    id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
                }).from(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.startAfter, new Date(updatePeriodicSupplyOrderDto.endedAt)))));
            }
            const responseOfUpdatingPeriodicSupplyOrder = await tx.update(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable).set({
                scheduledDay: updatePeriodicSupplyOrderDto.scheduledDay,
                initPrice: updatePeriodicSupplyOrderDto.initPrice,
                ...(newStartCord
                    ? { startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)` }
                    : {}),
                ...(newEndCord
                    ? { endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)` }
                    : {}),
                startAddress: updatePeriodicSupplyOrderDto.startAddress,
                endAddress: updatePeriodicSupplyOrderDto.endAddress,
                ...(updatePeriodicSupplyOrderDto.startAfter
                    ? { startAfter: new Date(updatePeriodicSupplyOrderDto.startAfter) }
                    : {}),
                ...(updatePeriodicSupplyOrderDto.endedAt
                    ? { endedAt: new Date(updatePeriodicSupplyOrderDto.endedAt) }
                    : {}),
                tolerableRDV: updatePeriodicSupplyOrderDto.tolerableRDV,
                autoAccept: updatePeriodicSupplyOrderDto.autoAccept,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId))).returning({
                id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPeriodicSupplyOrders && responseOfSelectingConflictPeriodicSupplyOrders.length !== 0),
                    ...responseOfUpdatingPeriodicSupplyOrder[0],
                }];
        });
    }
    async deletePeriodicSupplyOrderById(id, creatorId) {
        return await this.db.delete(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.creatorId, creatorId))).returning({
            id: periodicSupplyOrder_schema_1.PeriodicSupplyOrderTable.id,
        });
    }
};
exports.PeriodicSupplyOrderService = PeriodicSupplyOrderService;
exports.PeriodicSupplyOrderService = PeriodicSupplyOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PeriodicSupplyOrderService);
//# sourceMappingURL=periodicSupplyOrder.service.js.map