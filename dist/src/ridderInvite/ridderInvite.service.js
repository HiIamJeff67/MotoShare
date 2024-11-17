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
const exceptions_1 = require("../exceptions");
const order_schema_1 = require("../drizzle/schema/order.schema");
let RidderInviteService = class RidderInviteService {
    constructor(db) {
        this.db = db;
    }
    async createRidderInviteByOrderId(inviterId, orderId, createRidderInviteDto) {
        return await this.db.insert(ridderInvite_schema_1.RidderInviteTable).values({
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
            suggestStartAfter: new Date(createRidderInviteDto.suggestStartAfter || new Date()),
            suggestEndedAt: new Date(createRidderInviteDto.suggestEndedAt || new Date()),
            status: "CHECKING",
        }).returning({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
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
        }).from(ridderInvite_schema_1.RidderInviteTable)
            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder_schema_1.PurchaseOrderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, userId), (0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, userId))))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id));
    }
    async searchPaginationRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
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
    async searchCurAdjacentRidderInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            suggetStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
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
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            suggetStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
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
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
            receiverName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            suggetStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
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
    async searchPaginationRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
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
    async searchCurAdjacentRidderInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
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
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
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
        const query = this.db.select({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
            inviterName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
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
    async updateRidderInviteById(id, inviterId, updateRidderInviteDto) {
        const newStartCord = (updateRidderInviteDto.startCordLongitude !== undefined
            && updateRidderInviteDto.startCordLatitude !== undefined)
            ? { x: updateRidderInviteDto.startCordLongitude, y: updateRidderInviteDto.startCordLatitude }
            : undefined;
        const newEndCord = (updateRidderInviteDto.endCordLongitude !== undefined
            && updateRidderInviteDto.endCordLatitude !== undefined)
            ? { x: updateRidderInviteDto.endCordLongitude, y: updateRidderInviteDto.endCordLatitude }
            : undefined;
        return await this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
            briefDescription: updateRidderInviteDto.briefDescription,
            suggestPrice: updateRidderInviteDto.suggestPrice,
            startCord: newStartCord,
            endCord: newEndCord,
            startAddress: updateRidderInviteDto.startAddress,
            endAddress: updateRidderInviteDto.endAddress,
            suggestStartAfter: new Date(updateRidderInviteDto.suggestStartAfter || new Date()),
            suggestEndedAt: new Date(updateRidderInviteDto.suggestEndedAt || new Date()),
            updatedAt: new Date(),
            status: updateRidderInviteDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")))
            .returning({
            id: ridderInvite_schema_1.RidderInviteTable.id,
            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            status: ridderInvite_schema_1.RidderInviteTable.status,
        });
    }
    async decideRidderInviteById(id, receiverId, decideRidderInviteDto) {
        const purchaseOrder = await this.db.query.RidderInviteTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id), (0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")),
            with: {
                order: {
                    columns: {
                        id: true,
                        creatorId: true,
                    }
                }
            }
        });
        if (!purchaseOrder || !purchaseOrder.order)
            throw exceptions_1.ClientInviteNotFoundException;
        if (receiverId !== purchaseOrder?.order?.creatorId)
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
                if (!responseOfDecidingRidderInvite
                    || responseOfDecidingRidderInvite.length === 0) {
                    throw exceptions_1.ClientInviteNotFoundException;
                }
                await tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                    status: "REJECTED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder.order.id), (0, drizzle_orm_1.ne)(ridderInvite_schema_1.RidderInviteTable.id, id)));
                const responseOfDeletingPurchaseOrder = await tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                    status: "RESERVED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, purchaseOrder.order.id))
                    .returning({
                    receiverId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
                    receiverStartCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                    receiverEndCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                    receiverStartAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                    receiverEndAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                    isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                    orderStatus: purchaseOrder_schema_1.PurchaseOrderTable.status,
                });
                if (!responseOfDeletingPurchaseOrder
                    || responseOfDeletingPurchaseOrder.length === 0) {
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                }
                const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                    ridderId: responseOfDecidingRidderInvite[0].inviterId,
                    passengerId: responseOfDeletingPurchaseOrder[0].receiverId,
                    prevOrderId: "PurchaseOrder" + " " + purchaseOrder.order.id,
                    finalPrice: responseOfDecidingRidderInvite[0].suggestPrice,
                    passengerStartCord: responseOfDeletingPurchaseOrder[0].receiverStartCord,
                    passengerEndCord: responseOfDeletingPurchaseOrder[0].receiverEndCord,
                    ridderStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
                    passengerStartAddress: responseOfDeletingPurchaseOrder[0].receiverStartAddress,
                    passengerEndAddress: responseOfDeletingPurchaseOrder[0].receiverEndAddress,
                    ridderStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                    startAfter: responseOfDecidingRidderInvite[0].suggestStartAfter,
                    endedAt: responseOfDecidingRidderInvite[0].suggestEndedAt,
                }).returning({
                    id: order_schema_1.OrderTable.id,
                    finalPrice: order_schema_1.OrderTable.finalPrice,
                    startAfter: order_schema_1.OrderTable.startAfter,
                    endedAt: order_schema_1.OrderTable.endedAt,
                    status: order_schema_1.OrderTable.passengerStatus,
                });
                if (!responseOfCreatingOrder
                    || responseOfCreatingOrder.length === 0) {
                    throw exceptions_1.ClientCreateOrderException;
                }
                return [{
                        orderId: responseOfCreatingOrder[0].id,
                        status: responseOfDecidingRidderInvite[0].inviteStatus,
                        price: responseOfCreatingOrder[0].finalPrice,
                        passsengerStartCord: responseOfDeletingPurchaseOrder[0].receiverStartCord,
                        passengerEndCord: responseOfDeletingPurchaseOrder[0].receiverEndCord,
                        ridderStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
                        passengerStartAddress: responseOfDeletingPurchaseOrder[0].receiverStartAddress,
                        passengerEndAddress: responseOfDeletingPurchaseOrder[0].receiverEndAddress,
                        ridderStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                        startAfter: responseOfCreatingOrder[0].startAfter,
                        endedAt: responseOfCreatingOrder[0].endedAt,
                        orderStatus: responseOfCreatingOrder[0].status,
                    }];
            });
        }
        else if (decideRidderInviteDto.status === "REJECTED") {
            return await this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
                status: decideRidderInviteDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(ridderInvite_schema_1.RidderInviteTable.id, id))
                .returning({
                status: ridderInvite_schema_1.RidderInviteTable.status,
                updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
            });
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
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], RidderInviteService);
//# sourceMappingURL=ridderInvite.service.js.map