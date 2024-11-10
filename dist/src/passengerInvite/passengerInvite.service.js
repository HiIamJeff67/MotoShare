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
            suggestStartAfter: createPassengerInviteDto.suggestStartAfter,
            status: "CHECKING",
        }).returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        });
    }
    async getPassengerInviteById(id) {
        return await this.db.query.PassengerInviteTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id),
            columns: {
                id: true,
                suggestPrice: true,
                briefDescription: true,
                startCord: true,
                endCord: true,
                suggestStartAfter: true,
                createdAt: true,
                updatedAt: true,
                status: true,
            },
            with: {
                order: {
                    columns: {
                        initPrice: true,
                        startCord: true,
                        endCord: true,
                        description: true,
                        startAfter: true,
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
                                        motocycleType: true,
                                        motocyclePhotoUrl: true,
                                        phoneNumber: true,
                                        motocycleLicense: true,
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
    }
    async searchPaginationPassengerInvitesByInviterId(inviterId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggetStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(passengerInvite_schema_1.PassengerInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchCurAdjacentPassengerInvitesByInviterId(inviterId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggetStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchDestAdjacentPassengerInvitesByInviterId(inviterId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggetStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchSimilarRoutePassengerInvitesByInviterId(inviterId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            receiverName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggetStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      `,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId))
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      `)
            .limit(limit)
            .offset(offset);
    }
    async searchPaginationPasssengerInvitesByReceiverId(receiverId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.desc)(passengerInvite_schema_1.PassengerInviteTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchCurAdjacentPassengerInvitesByReceiverId(receiverId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.startCord},
        ${passengerInvite_schema_1.PassengerInviteTable.startCord},
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchDestAdjacentPassengerInvitesByReceiverId(receiverId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
      )`,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `ST_Distance(
        ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        ${passengerInvite_schema_1.PassengerInviteTable.endCord},
      )`)
            .limit(limit)
            .offset(offset);
    }
    async searchSimilarRoutePassengerInvitesByReceverId(receiverId, limit, offset) {
        return await this.db.select({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            orderId: passengerInvite_schema_1.PassengerInviteTable.orderId,
            inviterName: passenger_schema_1.PassengerTable.userName,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
            suggestPrice: passengerInvite_schema_1.PassengerInviteTable.suggestPrice,
            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
            suggestStartAfter: passengerInvite_schema_1.PassengerInviteTable.suggestStartAfter,
            createdAt: passengerInvite_schema_1.PassengerInviteTable.createdAt,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
            RDV: (0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      `,
        }).from(passengerInvite_schema_1.PassengerInviteTable)
            .leftJoin(supplyOrder_schema_1.SupplyOrderTable, (0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, passengerInvite_schema_1.PassengerInviteTable.orderId))
            .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.creatorId, receiverId))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInvite_schema_1.PassengerInviteTable.userId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.sql) `
        ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.startCord},
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${passengerInvite_schema_1.PassengerInviteTable.endCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${supplyOrder_schema_1.SupplyOrderTable.startCord},
          ${supplyOrder_schema_1.SupplyOrderTable.endCord},
        )
      `)
            .limit(limit)
            .offset(offset);
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
            suggestStartAfter: updatePassengerInviteDto.suggestStartAfter,
            updatedAt: new Date(),
            status: updatePassengerInviteDto.status,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId)))
            .returning({
            id: passengerInvite_schema_1.PassengerInviteTable.id,
            updatedAt: passengerInvite_schema_1.PassengerInviteTable.updatedAt,
            status: passengerInvite_schema_1.PassengerInviteTable.status,
        });
    }
    async decidePassengerInvitebyId(id, receiverId, decidePassengerInviteDto) {
        const supplyOrder = await this.db.query.PassengerInviteTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id),
            with: {
                order: {
                    columns: {
                        creatorId: true,
                    }
                }
            }
        });
        if (!supplyOrder || !supplyOrder.order || receiverId !== supplyOrder?.order?.creatorId) {
            throw new common_1.UnauthorizedException("You have no access to the invite");
        }
        return await this.db.update(passengerInvite_schema_1.PassengerInviteTable).set({
            status: decidePassengerInviteDto.status,
        }).where((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id));
    }
    async deletePassengerInviteById(id, inviterId) {
        return await this.db.delete(passengerInvite_schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.id, id), (0, drizzle_orm_1.eq)(passengerInvite_schema_1.PassengerInviteTable.userId, inviterId)))
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