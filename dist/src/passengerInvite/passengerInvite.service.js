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
let PassengerInviteService = class PassengerInviteService {
    constructor(db) {
        this.db = db;
    }
    async createPassengerInviteByOrderId(inviterId, orderId, createPassengerInviteDto) {
        return await this.db.insert(passengerInvite_schema_1.PassengerInviteTable).values({
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
            suggestStartAfter: new Date(createPassengerInviteDto.suggestStartAfter || new Date()),
            suggestEndedAt: new Date(createPassengerInviteDto.suggestEndedAt || new Date()),
            status: "CHECKING",
        }).returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
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
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, supplyOrder_schema_1.SupplyOrderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, userId), (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, userId))))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id));
    }
    async searchPaginationPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
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
    async searchCurAdjacentPassengerInvitesByInviterId(inviterId, receiverName = undefined, limit, offset) {
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
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
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
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
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggetStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
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
    async searchPaginationPasssengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
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
    async searchCurAdjacentPassengerInvitesByReceiverId(receiverId, inviterName = undefined, limit, offset) {
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
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
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
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
        const query = this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            suggestStartAddress: passengerInvite_schema_1.PassengerInviteTable.startAddress,
            suggestEndAddress: passengerInvite_schema_1.PassengerInviteTable.endAddress,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: passengerInvite_schema_1.PassengerInviteTable.suggestEndedAt,
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
    async updatePassengerInviteById(id, inviterId, updatePassengerInviteDto) {
        const newStartCord = (updatePassengerInviteDto.startCordLongitude !== undefined
            && updatePassengerInviteDto.startCordLatitude !== undefined)
            ? { x: updatePassengerInviteDto.startCordLongitude, y: updatePassengerInviteDto.startCordLatitude }
            : undefined;
        const newEndCord = (updatePassengerInviteDto.endCordLongitude !== undefined
            && updatePassengerInviteDto.endCordLatitude !== undefined)
            ? { x: updatePassengerInviteDto.endCordLongitude, y: updatePassengerInviteDto.endCordLatitude }
            : undefined;
        return await this.db.update(passengerInvite_schema_1.PassengerInviteTable).set({
            briefDescription: updatePassengerInviteDto.briefDescription,
            suggestPrice: updatePassengerInviteDto.suggestPrice,
            startCord: newStartCord,
            endCord: newEndCord,
            startAddress: updatePassengerInviteDto.startAddress,
            endAddress: updatePassengerInviteDto.endAddress,
            suggestStartAfter: new Date(updatePassengerInviteDto.suggestStartAfter || new Date()),
            suggestEndedAt: new Date(updatePassengerInviteDto.suggestEndedAt || new Date()),
            updatedAt: new Date(),
            status: updatePassengerInviteDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING")))
            .returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        });
    }
    async decidePassengerInviteById(id, receiverId, decidePassengerInviteDto) {
        const supplyOrder = await this.db.query.PassengerInviteTable.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING")),
            with: {
                order: {
                    columns: {
                        id: true,
                        creatorId: true,
                    }
                }
            }
        });
        if (!supplyOrder || !supplyOrder.order)
            throw exceptions_1.ClientInviteNotFoundException;
        if (receiverId !== supplyOrder?.order?.creatorId)
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
                if (!responseOfDecidingPassengerInvite
                    || responseOfDecidingPassengerInvite.length === 0) {
                    throw exceptions_1.ClientInviteNotFoundException;
                }
                await tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                    status: "REJECTED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.orderId, supplyOrder.order.id), (0, drizzle_orm_1.ne)(passengerInvite_schema_1.PassengerInviteTable.id, id)));
                const responseOfDeletingSupplyOrder = await tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                    status: "RESERVED",
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, supplyOrder.order.id))
                    .returning({
                    receiverId: supplyOrder_schema_1.SupplyOrderTable.creatorId,
                    receiverStartCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                    receiverStartAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                    tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                    receiverDescription: supplyOrder_schema_1.SupplyOrderTable.description,
                    orderStatus: supplyOrder_schema_1.SupplyOrderTable.status,
                });
                if (!responseOfDeletingSupplyOrder
                    || responseOfDeletingSupplyOrder.length === 0) {
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                }
                const responseOfCreatingOrder = await tx.insert(order_schema_1.OrderTable).values({
                    ridderId: responseOfDeletingSupplyOrder[0].receiverId,
                    passengerId: responseOfDecidingPassengerInvite[0].inviterId,
                    prevOrderId: "SupplyOrder" + " " + supplyOrder.order.id,
                    finalPrice: responseOfDecidingPassengerInvite[0].suggestPrice,
                    passengerDescription: responseOfDecidingPassengerInvite[0].inviterDescription,
                    ridderDescription: responseOfDeletingSupplyOrder[0].receiverDescription,
                    passengerStartCord: responseOfDecidingPassengerInvite[0].inviterStartCord,
                    passengerEndCord: responseOfDecidingPassengerInvite[0].inviterEndCord,
                    ridderStartCord: responseOfDeletingSupplyOrder[0].receiverStartCord,
                    passengerStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
                    passengerEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
                    ridderStartAddress: responseOfDeletingSupplyOrder[0].receiverStartAddress,
                    startAfter: responseOfDecidingPassengerInvite[0].suggestStartAfter,
                    endedAt: responseOfDecidingPassengerInvite[0].suggestEndedAt,
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
                        status: responseOfDecidingPassengerInvite[0].inviteStatus,
                        price: responseOfCreatingOrder[0].finalPrice,
                        passengerStartCord: responseOfDecidingPassengerInvite[0].inviterStartCord,
                        passengerEndCord: responseOfDecidingPassengerInvite[0].inviterEndCord,
                        ridderStartCord: responseOfDeletingSupplyOrder[0].receiverStartCord,
                        passengerStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
                        passengerEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
                        ridderStartAddress: responseOfDeletingSupplyOrder[0].receiverStartAddress,
                        startAfter: responseOfCreatingOrder[0].startAfter,
                        endedAt: responseOfCreatingOrder[0].endedAt,
                        orderStatus: responseOfCreatingOrder[0].status,
                    }];
            });
        }
        else if (decidePassengerInviteDto.status === "REJECTED") {
            return await this.db.update(passengerInvite_schema_1.PassengerInviteTable).set({
                status: decidePassengerInviteDto.status,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id))
                .returning({
                status: passengerInvite_schema_1.PassengerInviteTable.status,
                updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            });
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
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PassengerInviteService);
//# sourceMappingURL=passengerInvite.service.js.map