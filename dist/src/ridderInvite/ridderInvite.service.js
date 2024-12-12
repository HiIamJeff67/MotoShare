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
exports.RidderInviteService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const ridderInvite_schema_1 = require("../drizzle/schema/ridderInvite.schema");
const drizzle_orm_1 = require("drizzle-orm");
const purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const order_schema_1 = require("../drizzle/schema/order.schema");
const exceptions_1 = require("../exceptions");
const notificationTemplate_1 = require("../notification/notificationTemplate");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
let RidderInviteService = class RidderInviteService {
    constructor(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async updateExpiredRidderInvites() {
        const response = await this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
            status: "CANCEL",
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lt)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date()))).returning({
            id: ridderInvite_schema_1.RidderInviteTable.id,
        });
        if (!response) {
            throw exceptions_1.ServerNeonautoUpdateExpiredRidderInviteException;
        }
        return response.length;
    }
    async createRidderInviteByOrderId(inviterId, inviterName, orderId, createRidderInviteDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingConfictRidderInvites = await tx.select({
                id: ridderInvite_schema_1.RidderInviteTable.id,
            }).from(ridderInvite_schema_1.RidderInviteTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(createRidderInviteDto.suggestStartAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(createRidderInviteDto.suggestEndedAt)))));
            const responseOfSelectingPurchaseOrder = await tx.select({
                passengerId: passenger_schema_1.PassengerTable.id,
                status: purchaseOrder_schema_1.PurchaseOrderTable.status,
            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
            if (!responseOfSelectingPurchaseOrder || responseOfSelectingPurchaseOrder.length === 0
                || responseOfSelectingPurchaseOrder[0].status !== "POSTED") {
                throw exceptions_1.ClientPurchaseOrderNotFoundException;
            }
            const responseOfCreatingRidderInvite = await tx.insert(ridderInvite_schema_1.RidderInviteTable).values({
                userId: inviterId,
                orderId: orderId,
                briefDescription: createRidderInviteDto.briefDescription,
                suggestPrice: createRidderInviteDto.suggestPrice,
                startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createRidderInviteDto.startCordLongitude}, ${createRidderInviteDto.startCordLatitude}),
          4326
        )`,
                endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(
          ST_MakePoint(${createRidderInviteDto.endCordLongitude}, ${createRidderInviteDto.endCordLatitude}),
          4326
        )`,
                startAddress: createRidderInviteDto.startAddress,
                endAddress: createRidderInviteDto.endAddress,
                suggestStartAfter: new Date(createRidderInviteDto.suggestStartAfter),
                suggestEndedAt: new Date(createRidderInviteDto.suggestEndedAt),
            }).returning({
                id: ridderInvite_schema_1.RidderInviteTable.id,
                orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                status: ridderInvite_schema_1.RidderInviteTable.status,
            });
            if (!responseOfCreatingRidderInvite || responseOfCreatingRidderInvite.length === 0) {
                throw exceptions_1.ClientCreateRidderInviteException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfCreatingRidderInvite)(inviterName, responseOfSelectingPurchaseOrder[0].passengerId, responseOfCreatingRidderInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            return [{
                    hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0),
                    ...responseOfCreatingRidderInvite[0],
                }];
        });
    }
    async getRidderInviteById(id, userId) {
        return await this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            inviteBriefDescription: ridderInvite_schema_1.RidderInviteTable.briefDescription,
            suggestStartCord: ridderInvite_schema_1.RidderInviteTable.startCord,
            suggestEndCord: ridderInvite_schema_1.RidderInviteTable.endCord,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            inviteCreatedAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            inviteUdpatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            inviteStatus: ridderInvite_schema_1.RidderInviteTable.status,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            description: purchaseOrder_schema_1.PurchaseOrderTable.description,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            orderCreatedAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
            orderUpdatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
            creatorName: passenger_schema_1.PassengerTable.userName,
            isOnline: passengerInfo_schema_1.PassengerInfoTable.isOnline,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            phoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder_schema_1.PurchaseOrderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, userId), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, userId))))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id));
    }
    async searchPaginationRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.desc)(ridderInvite_schema_1.RidderInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchAboutToStartRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.asc)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarTimeRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} - ${purchaseOrder_schema_1.PurchaseOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestEndedAt} - ${purchaseOrder_schema_1.PurchaseOrderTable.endedAt}))) ASC`).limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ${ridderInvite_schema_1.RidderInviteTable.startCord}
      )`,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ${ridderInvite_schema_1.RidderInviteTable.startCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ${ridderInvite_schema_1.RidderInviteTable.endCord}
      )`,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
            ${ridderInvite_schema_1.RidderInviteTable.endCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRouteRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.endCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      `,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
            ST_Distance(
              ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
              ${ridderInvite_schema_1.RidderInviteTable.startCord}
          )
          + ST_Distance(
              ${ridderInvite_schema_1.RidderInviteTable.startCord},
              ${ridderInvite_schema_1.RidderInviteTable.endCord}
            )
          + ST_Distance(
              ${ridderInvite_schema_1.RidderInviteTable.endCord},
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
    async searchBetterFirstRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset, searchPriorities) {
        let timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
        let spaceResponseField = {};
        timeQuery = (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} - ${purchaseOrder_schema_1.PurchaseOrderTable.startAfter}))) +
                      ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestEndedAt} - ${purchaseOrder_schema_1.PurchaseOrderTable.endedAt}))) ASC`;
        aboutToStartQuery = (0, drizzle_orm_1.sql) `${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} ASC`;
        startQuery = (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ${ridderInvite_schema_1.RidderInviteTable.startCord}
      )`;
        destQuery = (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ${ridderInvite_schema_1.RidderInviteTable.endCord}
      )`;
        routeQuery = (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.endCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      `;
        updatedAtQuery = (0, drizzle_orm_1.sql) `${ridderInvite_schema_1.RidderInviteTable.updatedAt} DESC`;
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
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggesEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            ...spaceResponseField,
        }).from(ridderInvite_schema_1.RidderInviteTable);
        if (receiverName) {
            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, receiverName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchPaginationRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(ridderInvite_schema_1.RidderInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchAboutToStartRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.asc)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter))
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarTimeRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} - ${purchaseOrder_schema_1.PurchaseOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestEndedAt} - ${purchaseOrder_schema_1.PurchaseOrderTable.endedAt}))) ASC`).limit(limit)
            .offset(offset);
        return await query;
    }
    async searchCurAdjacentRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ${ridderInvite_schema_1.RidderInviteTable.startCord}
      )`,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
            ${ridderInvite_schema_1.RidderInviteTable.startCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchDestAdjacentRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            manhattanDistance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
        ${ridderInvite_schema_1.RidderInviteTable.endCord}
      )`,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
            ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
            ${ridderInvite_schema_1.RidderInviteTable.endCord}
          )`)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async searchSimilarRouteRidderInvitesByReceverId(receiverId, inviterName = undefined, limit, offset) {
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.startCord},
          ${ridderInvite_schema_1.RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${ridderInvite_schema_1.RidderInviteTable.endCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
          ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
        )
      `,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
            ST_Distance(
              ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
              ${ridderInvite_schema_1.RidderInviteTable.startCord}
            )
          + ST_Distance(
              ${ridderInvite_schema_1.RidderInviteTable.startCord},
              ${ridderInvite_schema_1.RidderInviteTable.endCord}
            )
          + ST_Distance(
              ${ridderInvite_schema_1.RidderInviteTable.endCord},
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
    async searchBetterFirstRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset, searchPriorities) {
        let timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
        let spaceResponseField = {};
        timeQuery = (0, drizzle_orm_1.sql) `ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} - ${purchaseOrder_schema_1.PurchaseOrderTable.startAfter}))) +
                    ABS(EXTRACT(EPOCH FROM (${ridderInvite_schema_1.RidderInviteTable.suggestEndedAt} - ${purchaseOrder_schema_1.PurchaseOrderTable.endedAt}))) ASC`;
        aboutToStartQuery = (0, drizzle_orm_1.sql) `${ridderInvite_schema_1.RidderInviteTable.suggestStartAfter} ASC`;
        startQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
      ${ridderInvite_schema_1.RidderInviteTable.startCord}
    )`;
        destQuery = (0, drizzle_orm_1.sql) `ST_Distance(
      ${purchaseOrder_schema_1.PurchaseOrderTable.endCord},
      ${ridderInvite_schema_1.RidderInviteTable.endCord}
    )`;
        routeQuery = (0, drizzle_orm_1.sql) `
      ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ${ridderInvite_schema_1.RidderInviteTable.startCord}
      )
    + ST_Distance(
        ${ridderInvite_schema_1.RidderInviteTable.startCord},
        ${ridderInvite_schema_1.RidderInviteTable.endCord}
      )
    + ST_Distance(
        ${ridderInvite_schema_1.RidderInviteTable.endCord},
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
      )
    - ST_Distance(
        ${purchaseOrder_schema_1.PurchaseOrderTable.startCord},
        ${purchaseOrder_schema_1.PurchaseOrderTable.endCord}
      )
    `;
        updatedAtQuery = (0, drizzle_orm_1.sql) `${ridderInvite_schema_1.RidderInviteTable.updatedAt} DESC`;
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
        await this.updateExpiredRidderInvites();
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggesEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            ...spaceResponseField,
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
        if (inviterName) {
            query.leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
        }
        else {
            query.where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
        }
        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
        return await query;
    }
    async updateRidderInviteById(id, inviterId, inviterName, updateRidderInviteDto) {
        return this.db.transaction(async (tx) => {
            const newStartCord = (updateRidderInviteDto.startCordLongitude !== undefined
                && updateRidderInviteDto.startCordLatitude !== undefined)
                ? { x: updateRidderInviteDto.startCordLongitude, y: updateRidderInviteDto.startCordLatitude }
                : undefined;
            const newEndCord = (updateRidderInviteDto.endCordLongitude !== undefined
                && updateRidderInviteDto.endCordLatitude !== undefined)
                ? { x: updateRidderInviteDto.endCordLongitude, y: updateRidderInviteDto.endCordLatitude }
                : undefined;
            const ridderInvite = await tx.select({
                passengerId: passenger_schema_1.PassengerTable.id,
                suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            }).from(ridderInvite_schema_1.RidderInviteTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder_schema_1.PurchaseOrderTable.id))
                .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id));
            if (!ridderInvite || ridderInvite.length === 0)
                throw exceptions_1.ClientInviteNotFoundException;
            let responseOfSelectingConfictRidderInvites = undefined;
            if (updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConfictRidderInvites = await tx.select({
                    id: ridderInvite_schema_1.RidderInviteTable.id,
                }).from(ridderInvite_schema_1.RidderInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter))), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt)))));
            }
            else if (updateRidderInviteDto.suggestStartAfter && !updateRidderInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(ridderInvite[0].suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConfictRidderInvites = await tx.select({
                    id: ridderInvite_schema_1.RidderInviteTable.id,
                }).from(ridderInvite_schema_1.RidderInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.lte)(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter)))));
            }
            else if (!updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
                const [startAfter, endedAt] = [new Date(ridderInvite[0].suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)];
                if (startAfter >= endedAt)
                    throw exceptions_1.ClientEndBeforeStartException;
                responseOfSelectingConfictRidderInvites = await tx.select({
                    id: ridderInvite_schema_1.RidderInviteTable.id,
                }).from(ridderInvite_schema_1.RidderInviteTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.gte)(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt)))));
            }
            const responseOfUpdatingRidderInvite = await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                briefDescription: updateRidderInviteDto.briefDescription,
                suggestPrice: updateRidderInviteDto.suggestPrice,
                ...(newStartCord
                    ? { startCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)` }
                    : {}),
                ...(newEndCord
                    ? { endCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)` }
                    : {}),
                startAddress: updateRidderInviteDto.startAddress,
                endAddress: updateRidderInviteDto.endAddress,
                ...(updateRidderInviteDto.suggestStartAfter
                    ? { suggestStartAfter: new Date(updateRidderInviteDto.suggestStartAfter) }
                    : {}),
                ...(updateRidderInviteDto.suggestEndedAt
                    ? { suggestEndedAt: new Date(updateRidderInviteDto.suggestEndedAt) }
                    : {}),
                updatedAt: new Date(),
                status: updateRidderInviteDto.status,
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                id: ridderInvite_schema_1.RidderInviteTable.id,
                status: ridderInvite_schema_1.RidderInviteTable.status,
            });
            if (!responseOfUpdatingRidderInvite || responseOfUpdatingRidderInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((updateRidderInviteDto.status && updateRidderInviteDto.status === "CANCEL")
                ? (0, notificationTemplate_1.NotificationTemplateOfCancelingRidderInvite)(inviterName, ridderInvite[0].passengerId, responseOfUpdatingRidderInvite[0].id)
                : (0, notificationTemplate_1.NotificationTemplateOfUpdatingRidderInvite)(inviterName, ridderInvite[0].passengerId, responseOfUpdatingRidderInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            return [{
                    hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0),
                    ...responseOfUpdatingRidderInvite[0],
                }];
        });
    }
    async decideRidderInviteById(id, receiverId, receiverName, decideRidderInviteDto) {
        const ridderInvite = await this.db.query.RidderInviteTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")),
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
        if (!ridderInvite || !ridderInvite.order)
            throw exceptions_1.ClientInviteNotFoundException;
        if (receiverId !== ridderInvite?.order?.creatorId)
            throw exceptions_1.ClientUserHasNoAccessException;
        if (decideRidderInviteDto.status === "ACCEPTED") {
            return await this.db.transaction(async (tx) => {
                const responseOfDecidingRidderInvite = await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                    status: decideRidderInviteDto.status,
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id))
                    .returning({
                    inviterId: ridderInvite_schema_1.RidderInviteTable.userId,
                    inviterStartCord: ridderInvite_schema_1.RidderInviteTable.startCord,
                    inviterEndCord: ridderInvite_schema_1.RidderInviteTable.endCord,
                    inviterStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                    inviterEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                    suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                    suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                    suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                    inviterDescription: ridderInvite_schema_1.RidderInviteTable.briefDescription,
                    inviteStatus: ridderInvite_schema_1.RidderInviteTable.status,
                });
                if (!responseOfDecidingRidderInvite || responseOfDecidingRidderInvite.length === 0) {
                    throw exceptions_1.ClientInviteNotFoundException;
                }
                const responseOfRejectingOtherRidderInvites = await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                    status: "REJECTED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, ridderInvite.order.id), (0, drizzle_orm_1.ne)(ridderInvite_schema_1.RidderInviteTable.id, id))).returning({
                    id: ridderInvite_schema_1.RidderInviteTable.id,
                    userId: ridderInvite_schema_1.RidderInviteTable.userId,
                });
                if (responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0) {
                    const responseOfCreatingNotificationToRejectOthers = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfRejectingOtherRidderInvites.map((content) => {
                        return (0, notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite)(receiverName, `${receiverName} has found a better invite to start his/her travel`, content.userId, content.id);
                    }));
                    if (!responseOfCreatingNotificationToRejectOthers
                        || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherRidderInvites.length) {
                        throw exceptions_1.ClientCreateRidderNotificationException;
                    }
                }
                const responseOfDeletingPurchaseOrder = await tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                    status: "RESERVED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite.order.id), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"))).returning({
                    receiverId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
                    isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                    receiverDescription: purchaseOrder_schema_1.PurchaseOrderTable.description,
                    orderStatus: purchaseOrder_schema_1.PurchaseOrderTable.status,
                });
                if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                }
                const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                    ridderId: responseOfDecidingRidderInvite[0].inviterId,
                    passengerId: responseOfDeletingPurchaseOrder[0].receiverId,
                    prevOrderId: "PurchaseOrder" + " " + ridderInvite.order.id,
                    finalPrice: responseOfDecidingRidderInvite[0].suggestPrice,
                    passengerDescription: responseOfDeletingPurchaseOrder[0].receiverDescription,
                    ridderDescription: responseOfDecidingRidderInvite[0].inviterDescription,
                    finalStartCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDecidingRidderInvite[0].inviterStartCord.x}, ${responseOfDecidingRidderInvite[0].inviterStartCord.y}), 4326)`,
                    finalEndCord: (0, drizzle_orm_1.sql) `ST_SetSRID(ST_MakePoint(${responseOfDecidingRidderInvite[0].inviterEndCord.x}, ${responseOfDecidingRidderInvite[0].inviterEndCord.y}), 4326)`,
                    finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                    finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
                    startAfter: responseOfDecidingRidderInvite[0].suggestStartAfter,
                    endedAt: responseOfDecidingRidderInvite[0].suggestEndedAt,
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
                const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfAcceptingRidderInvite)(receiverName, ridderInvite.inviter.id, responseOfCreatingOrder[0].id));
                if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                    throw exceptions_1.ClientCreateRidderNotificationException;
                }
                return [{
                        orderId: responseOfCreatingOrder[0].id,
                        status: responseOfDecidingRidderInvite[0].inviteStatus,
                        price: responseOfCreatingOrder[0].finalPrice,
                        finalStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
                        finalEndCord: responseOfDecidingRidderInvite[0].inviterEndCord,
                        finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                        finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
                        startAfter: responseOfCreatingOrder[0].startAfter,
                        endedAt: responseOfCreatingOrder[0].endedAt,
                        orderStatus: responseOfCreatingOrder[0].status,
                    }];
            });
        }
        else if (decideRidderInviteDto.status === "REJECTED") {
            const responseOfRejectingRidderInvite = await this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
                status: decideRidderInviteDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id))
                .returning({
                id: ridderInvite_schema_1.RidderInviteTable.id,
                ridderId: ridderInvite_schema_1.RidderInviteTable.userId,
                status: ridderInvite_schema_1.RidderInviteTable.status,
                updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            });
            if (!responseOfRejectingRidderInvite || responseOfRejectingRidderInvite.length === 0) {
                throw exceptions_1.ClientInviteNotFoundException;
            }
            const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite)(receiverName, decideRidderInviteDto.rejectReason, responseOfRejectingRidderInvite[0].ridderId, responseOfRejectingRidderInvite[0].id));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
            return [{
                    status: responseOfRejectingRidderInvite[0].status,
                }];
        }
    }
    async deleteRidderInviteById(id, inviterId) {
        return await this.db.delete(ridderInvite_schema_1.RidderInviteTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.ne)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")))
            .returning({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        });
    }
};
exports.RidderInviteService = RidderInviteService;
exports.RidderInviteService = RidderInviteService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], RidderInviteService);
//# sourceMappingURL=ridderInvite.service.js.map