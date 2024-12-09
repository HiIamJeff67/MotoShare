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
exports.PeriodicPurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const periodicPurchaseOrder_schema_1 = require("../drizzle/schema/periodicPurchaseOrder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
let PeriodicPurchaseOrderService = class PeriodicPurchaseOrderService {
    constructor(db) {
        this.db = db;
    }
    async createPeriodicPurchaseOrderByCreatorId(creatorId, createPeriodicPurchaseOrderDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConflictPeriodicPurchaseOrders = await tx.select({
                id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
            }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.endedAt, new Date(createPeriodicPurchaseOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.startAfter, new Date(createPeriodicPurchaseOrderDto.endedAt)))));
            const responseOfCreatingPeriodicPurchaseOrder = await tx.insert(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable).values({
                creatorId: creatorId,
                scheduledDay: createPeriodicPurchaseOrderDto.scheduledDay,
                initPrice: createPeriodicPurchaseOrderDto.initPrice,
                startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createPeriodicPurchaseOrderDto.startCordLongitude}, ${createPeriodicPurchaseOrderDto.startCordLatitude}),
          4326
        )`,
                endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createPeriodicPurchaseOrderDto.endCordLongitude}, ${createPeriodicPurchaseOrderDto.endCordLatitude}),
          4326
        )`,
                startAddress: createPeriodicPurchaseOrderDto.startAddress,
                endAddress: createPeriodicPurchaseOrderDto.endAddress,
                startAfter: new Date(createPeriodicPurchaseOrderDto.startAfter),
                endedAt: new Date(createPeriodicPurchaseOrderDto.endedAt),
                isUrgent: createPeriodicPurchaseOrderDto.isUrgent,
                autoAccept: createPeriodicPurchaseOrderDto.autoAccept,
            }).returning({
                id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPeriodicPurchaseOrders && responseOfSelectingConflictPeriodicPurchaseOrders.length !== 0),
                    ...responseOfCreatingPeriodicPurchaseOrder[0],
                }];
        });
    }
    async getPeriodicPurchaseOrderById(id, creatorId) {
        return await this.db.query.PeriodicPurchaseOrderTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId)),
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
                isUrgent: true,
                autoAccept: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async searchPaginationPeriodicPurchaseOrders(creatorId, scheduledDay = undefined, limit, offset, isAutoAccept) {
        return await this.db.select({
            id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
            scheduledDay: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.scheduledDay,
            autoAccept: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.autoAccept,
            createdAt: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.createdAt,
            updatedAt: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.updatedAt,
        }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId), (scheduledDay ? (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.scheduledDay, scheduledDay) : undefined), (isAutoAccept ? (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.autoAccept, isAutoAccept) : undefined))).orderBy((0, drizzle_orm_1.desc)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async updatePeriodicPurchaseOrderById(id, creatorId, updatePeriodicPurchaseOrderDto) {
        return await this.db.transaction(async (tx) => {
            const newStartCord = (updatePeriodicPurchaseOrderDto.startCordLongitude !== undefined
                && updatePeriodicPurchaseOrderDto.startCordLatitude !== undefined)
                ? { x: updatePeriodicPurchaseOrderDto.startCordLongitude,
                    y: updatePeriodicPurchaseOrderDto.startCordLatitude, }
                : undefined;
            const newEndCord = (updatePeriodicPurchaseOrderDto.endCordLongitude !== undefined
                && updatePeriodicPurchaseOrderDto.endCordLatitude !== undefined)
                ? { x: updatePeriodicPurchaseOrderDto.endCordLongitude,
                    y: updatePeriodicPurchaseOrderDto.endCordLatitude }
                : undefined;
            let responseOfSelectingConflictPeriodicPurchaseOrders = undefined;
            if (updatePeriodicPurchaseOrderDto.startAfter && updatePeriodicPurchaseOrderDto.endedAt) {
                const [startAfter, endedAt] = [new Date(updatePeriodicPurchaseOrderDto.startAfter), new Date(updatePeriodicPurchaseOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicPurchaseOrders = await tx.select({
                    id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
                }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.endedAt, new Date(updatePeriodicPurchaseOrderDto.startAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.startAfter, new Date(updatePeriodicPurchaseOrderDto.endedAt)))));
            }
            else if (updatePeriodicPurchaseOrderDto.startAfter && !updatePeriodicPurchaseOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    endedAt: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.endedAt,
                }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(updatePeriodicPurchaseOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicPurchaseOrders = await tx.select({
                    id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
                }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.endedAt, new Date(updatePeriodicPurchaseOrderDto.startAfter)))));
            }
            else if (!updatePeriodicPurchaseOrderDto.startAfter && updatePeriodicPurchaseOrderDto.endedAt) {
                const tempResponse = await tx.select({
                    startAfter: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.startAfter,
                }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId)));
                if (!tempResponse || tempResponse.length === 0)
                    throw exceptions_1.ClientPeriodicPurchaseOrderNotFoundException;
                const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updatePeriodicPurchaseOrderDto.endedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPeriodicPurchaseOrders = await tx.select({
                    id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
                }).from(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.startAfter, new Date(updatePeriodicPurchaseOrderDto.endedAt)))));
            }
            const responseOfUpdatingPeriodicPurchaseOrder = await tx.update(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable).set({
                scheduledDay: updatePeriodicPurchaseOrderDto.scheduledDay,
                initPrice: updatePeriodicPurchaseOrderDto.initPrice,
                startCord: newStartCord,
                endCord: newEndCord,
                startAddress: updatePeriodicPurchaseOrderDto.startAddress,
                endAddress: updatePeriodicPurchaseOrderDto.endAddress,
                ...(updatePeriodicPurchaseOrderDto.startAfter
                    ? { startAfter: new Date(updatePeriodicPurchaseOrderDto.startAfter) }
                    : {}),
                ...(updatePeriodicPurchaseOrderDto.endedAt
                    ? { endedAt: new Date(updatePeriodicPurchaseOrderDto.endedAt) }
                    : {}),
                isUrgent: updatePeriodicPurchaseOrderDto.isUrgent,
                autoAccept: updatePeriodicPurchaseOrderDto.autoAccept,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId))).returning({
                id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
            });
            return [{
                    hasConflict: (responseOfSelectingConflictPeriodicPurchaseOrders && responseOfSelectingConflictPeriodicPurchaseOrders.length !== 0),
                    ...responseOfUpdatingPeriodicPurchaseOrder[0],
                }];
        });
    }
    async deletePeriodicPurchaseOrderById(id, creatorId) {
        return await this.db.delete(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id, id), (0, drizzle_orm_1.eq)(periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.creatorId, creatorId))).returning({
            id: periodicPurchaseOrder_schema_1.PeriodicPurchaseOrderTable.id,
        });
    }
};
exports.PeriodicPurchaseOrderService = PeriodicPurchaseOrderService;
exports.PeriodicPurchaseOrderService = PeriodicPurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PeriodicPurchaseOrderService);
//# sourceMappingURL=periodicPurchaseOrder.service.js.map