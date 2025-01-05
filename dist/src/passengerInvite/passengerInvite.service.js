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
exports.PassengerInviteService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerInvite_schema_1 = require("../drizzle/schema/passengerInvite.schema");
const drizzle_orm_1 = require("drizzle-orm");
const supplyOrder_schema_1 = require("../drizzle/schema/supplyOrder.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const exceptions_1 = require("../exceptions");
const order_schema_1 = require("../drizzle/schema/order.schema");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const notificationTemplate_1 = require("../notification/notificationTemplate");
let PassengerInviteService = class PassengerInviteService {
    constructor(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async updateExpiredPassengerInvites() {
        const response = await this.db.update(passengerInvite_schema_1.PassengerInviteTable).set({
            status: "CANCEL",
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lt)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter, new Date()))).returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            userId: passengerInvite_schema_1.PassengerInviteTable.userId,
        });
        if (!response) {
            throw exceptions_1.ServerNeonAutoUpdateExpiredPassengerInviteException;
        }
        return response.length;
    }
    async createPassengerInviteByOrderId(inviterId, inviterName, orderId, createPassengerInviteDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConfictPassengerInvites = await tx.select({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
            }).from(passengerInvite_schema_1.PassengerInviteTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt, new Date(createPassengerInviteDto.suggestStartAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter, new Date(createPassengerInviteDto.suggestEndedAt)))));
            const responseOfSelectingSupplyOrder = await tx.select({
                ridderId: ridder_schema_1.RidderTable.id,
                status: supplyOrder_schema_1.SupplyOrderTable.status,
            }).from(supplyOrder_schema_1.SupplyOrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, orderId), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"))).leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id));
            if (!responseOfSelectingSupplyOrder || responseOfSelectingSupplyOrder.length === 0
                || responseOfSelectingSupplyOrder[0].status !== "POSTED") {
                throw exceptions_1.ClientSupplyOrderNotFoundException;
            }
            const responseOfCreatingPassengerInvite = await tx.insert(passengerInvite_schema_1.PassengerInviteTable).values({
                userId: inviterId,
                orderId: orderId,
                briefDescription: createPassengerInviteDto.briefDescription,
                suggestPrice: createPassengerInviteDto.suggestPrice,
                startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createPassengerInviteDto.startCordLongitude}, ${createPassengerInviteDto.startCordLatitude}),
          4326
        )`,
                endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createPassengerInviteDto.endCordLongitude}, ${createPassengerInviteDto.endCordLatitude}),
          4326
        )`,
                startAddress: createPassengerInviteDto.startAddress,
                endAddress: createPassengerInviteDto.endAddress,
                suggestStartAfter: new Date(createPassengerInviteDto.suggestStartAfter),
                suggestEndedAt: new Date(createPassengerInviteDto.suggestEndedAt),
            }).returning({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
                orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
                status: passengerInvite_schema_1.PassengerInviteTable.status,
            });
            if (!responseOfCreatingPassengerInvite || responseOfCreatingPassengerInvite.length === 0) {
                throw exceptions_1.ClientCreatePassengerInviteException;
            }
            const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfCreatingPassengerInvite)(inviterName, responseOfSelectingSupplyOrder[0].ridderId, responseOfCreatingPassengerInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
            return [{
                    hasConflict: (responseOfSelectingConfictPassengerInvites && responseOfSelectingConfictPassengerInvites.length !== 0),
                    ...responseOfCreatingPassengerInvite[0],
                }];
        });
    }
    async getPassengerInviteById(id, userId) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            inviteBriefDescription: passengerInvite_schema_1.PassengerInviteTable.briefDescription,
            suggestStartCord: passengerInvite_schema_1.PassengerInviteTable.startCord,
            suggestEndCord: passengerInvite_schema_1.PassengerInviteTable.endCord,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            inviteCreatedAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            inviteUdpatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            inviteStatus: passengerInvite_schema_1.PassengerInviteTable.status,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            description: supplyOrder_schema_1.SupplyOrderTable.description,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            orderCreatedAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
            orderUpdatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
            creatorName: ridder_schema_1.RidderTable.userName,
            isOnline: ridderInfo_schema_1.RidderInfoTable.isOnline,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            motocycleLicense: ridderInfo_schema_1.RidderInfoTable.motocycleLicense,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            motocyclePhotoUrl: ridderInfo_schema_1.RidderInfoTable.motocyclePhotoUrl,
            phoneNumber: ridderInfo_schema_1.RidderInfoTable.phoneNumber,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, supplyOrder_schema_1.SupplyOrderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, userId), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, userId))))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id));
    }
    async searchPaginationPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(passengerInvite_schema_1.PassengerInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchAboutToStartPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.asc)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarTimePassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} - ${supplyOrder_schema_1.SupplyOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt} - ${supplyOrder_schema_1.SupplyOrderTable.endedAt}))) ASC`).limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord}
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
           ${supplyOrder_schema_1.SupplyOrderTable.startCord},
           ${passengerInvite_schema_1.PassengerInviteTable.startCord}
         )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord}
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.endCord},
            ${passengerInvite_schema_1.PassengerInviteTable.endCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRoutePassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord}
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord}
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord}
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord}
        )
      `,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
            ST_Distance(
              ${supplyOrder_schema_1.SupplyOrderTable.startCord},
              ${passengerInvite_schema_1.PassengerInviteTable.startCord}
          )
          + ST_Distance(
              ${passengerInvite_schema_1.PassengerInviteTable.startCord},
              ${passengerInvite_schema_1.PassengerInviteTable.endCord}
            )
          + ST_Distance(
              ${passengerInvite_schema_1.PassengerInviteTable.endCord},
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
    async searchBetterFirstPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset, searchPriorities) {
        let timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
        let spaceResponseField = {};
        timeQuery = (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} - ${supplyOrder_schema_1.SupplyOrderTable.startAfter}))) +
                    ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt} - ${supplyOrder_schema_1.SupplyOrderTable.endedAt}))) ASC`;
        aboutToStartQuery = (0, drizzle_orm_1.sql) `${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} ASC`;
        startQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${supplyOrder_schema_1.SupplyOrderTable.startCord},
      ${passengerInvite_schema_1.PassengerInviteTable.startCord}
    )`;
        destQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${supplyOrder_schema_1.SupplyOrderTable.endCord},
      ${passengerInvite_schema_1.PassengerInviteTable.endCord}
    )`;
        routeQuery = (0, drizzle_orm_1.sql) `
      ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord}
      )
    + ST_Distance(
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord}
      )
    + ST_Distance(
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        ${supplyOrder_schema_1.SupplyOrderTable.endCord}
      )
    - ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${supplyOrder_schema_1.SupplyOrderTable.endCord}
      )
    `;
        updatedAtQuery = (0, drizzle_orm_1.sql) `${passengerInvite_schema_1.PassengerInviteTable.updatedAt} DESC`;
        spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };
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
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            ...spaceResponseField,
        }).from(passengerInvite_schema_1.PassengerInviteTable);
        if (receiverName) {
            query.leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
                .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchPaginationPasssengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.desc)(passengerInvite_schema_1.PassengerInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchAboutToStartPassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.asc)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarTimePassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} - ${supplyOrder_schema_1.SupplyOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt} - ${supplyOrder_schema_1.SupplyOrderTable.endedAt}))) ASC`).limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentPassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord}
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.startCord},
            ${passengerInvite_schema_1.PassengerInviteTable.startCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentPassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord}
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${supplyOrder_schema_1.SupplyOrderTable.endCord},
            ${passengerInvite_schema_1.PassengerInviteTable.endCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRoutePassengerInvitesByReceverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord}
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord}
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord}
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord}
        )
      `,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
            ST_Distance(
              ${supplyOrder_schema_1.SupplyOrderTable.startCord},
              ${passengerInvite_schema_1.PassengerInviteTable.startCord}
            )
          + ST_Distance(
              ${passengerInvite_schema_1.PassengerInviteTable.startCord},
              ${passengerInvite_schema_1.PassengerInviteTable.endCord}
            )
          + ST_Distance(
              ${passengerInvite_schema_1.PassengerInviteTable.endCord},
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
    async searchBetterFirstPassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset, searchPriorities) {
        let timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
        let spaceResponseField = {};
        timeQuery = (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} - ${supplyOrder_schema_1.SupplyOrderTable.startAfter}))) +
                    ABS(EXTRACT(EPOCH FROM (${passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt} - ${supplyOrder_schema_1.SupplyOrderTable.endedAt}))) ASC`;
        aboutToStartQuery = (0, drizzle_orm_1.sql) `${passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter} ASC`;
        startQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${supplyOrder_schema_1.SupplyOrderTable.startCord},
      ${passengerInvite_schema_1.PassengerInviteTable.startCord}
    )`;
        destQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${supplyOrder_schema_1.SupplyOrderTable.endCord},
      ${passengerInvite_schema_1.PassengerInviteTable.endCord}
    )`;
        routeQuery = (0, drizzle_orm_1.sql) `
      ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord}
      )
    + ST_Distance(
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord}
      )
    + ST_Distance(
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        ${supplyOrder_schema_1.SupplyOrderTable.endCord}
      )
    - ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${supplyOrder_schema_1.SupplyOrderTable.endCord}
      )
    `;
        updatedAtQuery = (0, drizzle_orm_1.sql) `${passengerInvite_schema_1.PassengerInviteTable.updatedAt} DESC`;
        spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };
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
        await this.updateExpiredPassengerInvites();
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggesEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            ...spaceResponseField,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async updatePassengerInviteById(id, inviterId, inviterName, updatePassengerInviteDto) {
        return this.db.transaction(async (tx) => {
            const newStartCord = (updatePassengerInviteDto.startCordLongitude !== undefined
                && updatePassengerInviteDto.startCordLatitude !== undefined)
                ? { x: updatePassengerInviteDto.startCordLongitude, y: updatePassengerInviteDto.startCordLatitude }
                : undefined;
            const newEndCord = (updatePassengerInviteDto.endCordLongitude !== undefined
                && updatePassengerInviteDto.endCordLatitude !== undefined)
                ? { x: updatePassengerInviteDto.endCordLongitude, y: updatePassengerInviteDto.endCordLatitude }
                : undefined;
            const passengerInvite = await tx.select({
                ridderId: ridder_schema_1.RidderTable.id,
                suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
                suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            }).from(passengerInvite_schema_1.PassengerInviteTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, supplyOrder_schema_1.SupplyOrderTable.id))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id));
            if (!passengerInvite || passengerInvite.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
            let responseOfSelectingConflictPassengerInvites = undefined;
            if (updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPassengerInvites = await tx.select({
                    id: passengerInvite_schema_1.PassengerInviteTable.id,
                }).from(passengerInvite_schema_1.PassengerInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt, new Date(updatePassengerInviteDto.suggestStartAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter, new Date(updatePassengerInviteDto.suggestEndedAt)))));
            }
            else if (updatePassengerInviteDto.suggestStartAfter && !updatePassengerInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(passengerInvite[0].suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPassengerInvites = await tx.select({
                    id: passengerInvite_schema_1.PassengerInviteTable.id,
                }).from(passengerInvite_schema_1.PassengerInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt, new Date(updatePassengerInviteDto.suggestStartAfter)))));
            }
            else if (!updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(passengerInvite[0].suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConflictPassengerInvites = await tx.select({
                    id: passengerInvite_schema_1.PassengerInviteTable.id,
                }).from(passengerInvite_schema_1.PassengerInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter, new Date(updatePassengerInviteDto.suggestEndedAt)))));
            }
            const responseOfUpdatingPassengerInvite = await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                briefDescription: updatePassengerInviteDto.briefDescription,
                suggestPrice: updatePassengerInviteDto.suggestPrice,
                ...(newStartCord
                    ? { startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)` }
                    : {}),
                ...(newEndCord
                    ? { endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)` }
                    : {}),
                startAddress: updatePassengerInviteDto.startAddress,
                endAddress: updatePassengerInviteDto.endAddress,
                ...(updatePassengerInviteDto.suggestStartAfter
                    ? { suggestStartAfter: new Date(updatePassengerInviteDto.suggestStartAfter) }
                    : {}),
                ...(updatePassengerInviteDto.suggestEndedAt
                    ? { suggestEndedAt: new Date(updatePassengerInviteDto.suggestEndedAt) }
                    : {}),
                updatedAt: new Date(),
                status: updatePassengerInviteDto.status,
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).returning({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
                status: passengerInvite_schema_1.PassengerInviteTable.status,
            });
            if (!responseOfUpdatingPassengerInvite || responseOfUpdatingPassengerInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((updatePassengerInviteDto.status && updatePassengerInviteDto.status === "CANCEL")
                ? (0, notificationTemplate_1.NotificationTemplateOfCancelingPassengerInvite)(inviterName, passengerInvite[0].ridderId, responseOfUpdatingPassengerInvite[0].id)
                : (0, notificationTemplate_1.NotificationTemplateOfUpdatingPassengerInvite)(inviterName, passengerInvite[0].ridderId, responseOfUpdatingPassengerInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
            return [{
                    hasConflict: (responseOfSelectingConflictPassengerInvites && responseOfSelectingConflictPassengerInvites.length !== 0),
                    ...responseOfUpdatingPassengerInvite[0],
                }];
        });
    }
    async decidePassengerInviteById(id, receiverId, receiverName, decidePassengerInviteDto) {
        const passengerInvite = await this.db.query.PassengerInviteTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING")),
            with: {
                inviter: {
                    columns: {
                        id: true,
                    }
                },
                order: {
                    columns: {
                        id: true,
                        creatorId: true,
                    },
                },
            }
        });
        if (!passengerInvite || !passengerInvite.order)
            throw exceptions_1.ClientInviteNotFoundException;
        if (receiverId !== passengerInvite?.order?.creatorId)
            throw exceptions_1.ClientUserHasNoAccessException;
        if (decidePassengerInviteDto.status === "ACCEPTED") {
            return await this.db.transaction(async (tx) => {
                const responseOfDecidingPassengerInvite = await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                    status: decidePassengerInviteDto.status,
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id))
                    .returning({
                    inviterId: passengerInvite_schema_1.PassengerInviteTable.userId,
                    inviterStartCord: passengerInvite_schema_1.PassengerInviteTable.startCord,
                    inviterEndCord: passengerInvite_schema_1.PassengerInviteTable.endCord,
                    inviterStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
                    inviterEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
                    suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
                    suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
                    suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
                    inviterDescription: passengerInvite_schema_1.PassengerInviteTable.briefDescription,
                    inviteStatus: passengerInvite_schema_1.PassengerInviteTable.status,
                });
                if (!responseOfDecidingPassengerInvite || responseOfDecidingPassengerInvite.length === 0) {
                    throw exceptions_1.ClientInviteNotFoundException;
                }
                const responseOfRejectingOtherPassengerInvites = await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                    status: "REJECTED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, passengerInvite.order.id), (0, drizzle_orm_1.ne)(passengerInvite_schema_1.PassengerInviteTable.id, id))).returning({
                    id: passengerInvite_schema_1.PassengerInviteTable.id,
                    userId: passengerInvite_schema_1.PassengerInviteTable.userId,
                });
                if (responseOfRejectingOtherPassengerInvites && responseOfRejectingOtherPassengerInvites.length !== 0) {
                    const responseOfCreatingNotificationToRejectOthers = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfRejectingOtherPassengerInvites.map((content) => {
                        return (0, notificationTemplate_1.NotificationTemplateOfRejectingPassengerInvite)(receiverName, `${receiverName} has found a better invite to start his/her travel`, content.userId, content.id);
                    }));
                    if (!responseOfCreatingNotificationToRejectOthers
                        || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherPassengerInvites.length) {
                        throw exceptions_1.ClientCreatePassengerNotificationException;
                    }
                }
                const responseOfDeletingSupplyOrder = await tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                    status: "RESERVED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite.order.id), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"))).returning({
                    receiverId: supplyOrder_schema_1.SupplyOrderTable.creatorId,
                    tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                    receiverDescription: supplyOrder_schema_1.SupplyOrderTable.description,
                    orderStatus: supplyOrder_schema_1.SupplyOrderTable.status,
                });
                if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                }
                const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                    ridderId: responseOfDeletingSupplyOrder[0].receiverId,
                    passengerId: responseOfDecidingPassengerInvite[0].inviterId,
                    prevOrderId: "SupplyOrder" + " " + passengerInvite.order.id,
                    finalPrice: responseOfDecidingPassengerInvite[0].suggestPrice,
                    passengerDescription: responseOfDecidingPassengerInvite[0].inviterDescription,
                    ridderDescription: responseOfDeletingSupplyOrder[0].receiverDescription,
                    finalStartCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDecidingPassengerInvite[0].inviterStartCord.x}, ${responseOfDecidingPassengerInvite[0].inviterStartCord.y}), 4326)`,
                    finalEndCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDecidingPassengerInvite[0].inviterEndCord.x}, ${responseOfDecidingPassengerInvite[0].inviterEndCord.y}), 4326)`,
                    finalStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
                    finalEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
                    startAfter: responseOfDecidingPassengerInvite[0].suggestStartAfter,
                    endedAt: responseOfDecidingPassengerInvite[0].suggestEndedAt,
                }).returning({
                    id: order_schema_1.OrderTable.id,
                    finalPrice: order_schema_1.OrderTable.finalPrice,
                    startAfter: order_schema_1.OrderTable.startAfter,
                    endedAt: order_schema_1.OrderTable.endedAt,
                    status: order_schema_1.OrderTable.passengerStatus,
                });
                if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
                    throw exceptions_1.ClientCreateOrderException;
                }
                const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfAcceptingPassengerInvite)(receiverName, passengerInvite.inviter.id, responseOfCreatingOrder[0].id));
                if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                    throw exceptions_1.ClientCreatePassengerNotificationException;
                }
                return [{
                        orderId: responseOfCreatingOrder[0].id,
                        status: responseOfDecidingPassengerInvite[0].inviteStatus,
                        price: responseOfCreatingOrder[0].finalPrice,
                        finalStartCord: responseOfDecidingPassengerInvite[0].inviterStartCord,
                        finalEndCord: responseOfDecidingPassengerInvite[0].inviterEndCord,
                        finalStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
                        finalEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
                        startAfter: responseOfCreatingOrder[0].startAfter,
                        endedAt: responseOfCreatingOrder[0].endedAt,
                        orderStatus: responseOfCreatingOrder[0].status,
                    }];
            });
        }
        else if (decidePassengerInviteDto.status === "REJECTED") {
            const responseOfRejectingPassengerInvite = await this.db.update(passengerInvite_schema_1.PassengerInviteTable).set({
                status: decidePassengerInviteDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id))
                .returning({
                id: passengerInvite_schema_1.PassengerInviteTable.id,
                passengerId: passengerInvite_schema_1.PassengerInviteTable.userId,
                status: passengerInvite_schema_1.PassengerInviteTable.status,
                updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            });
            if (!responseOfRejectingPassengerInvite || responseOfRejectingPassengerInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfRejectingPassengerInvite)(receiverName, decidePassengerInviteDto.rejectReason, responseOfRejectingPassengerInvite[0].passengerId, responseOfRejectingPassengerInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            return [{
                    status: responseOfRejectingPassengerInvite[0].status,
                }];
        }
    }
    async deletePassengerInviteById(id, inviterId) {
        return await this.db.delete(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.ne)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING")))
            .returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        });
    }
};
exports.PassengerInviteService = PassengerInviteService;
exports.PassengerInviteService = PassengerInviteService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], PassengerInviteService);
//# sourceMappingURL=passengerInvite.service.js.map