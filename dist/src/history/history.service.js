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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const history_schema_1 = require("../drizzle/schema/history.schema");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const exceptions_1 = require("../exceptions");
const passengerAuth_schema_1 = require("../drizzle/schema/passengerAuth.schema");
const ridderAuth_schema_1 = require("../drizzle/schema/ridderAuth.schema");
let HistoryService = class HistoryService {
    constructor(db) {
        this.db = db;
    }
    async getHistoryById(id, userId) {
        return await this.db.select({
            id: history_schema_1.HistoryTable.id,
            passengerName: passenger_schema_1.PassengerTable.userName,
            passengerAvatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            passengerPhoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
            ridderName: ridder_schema_1.RidderTable.userName,
            ridderAvatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            ridderPhoneNumber: ridderInfo_schema_1.RidderInfoTable.phoneNumber,
            finalPrice: history_schema_1.HistoryTable.finalPrice,
            finalStartCord: history_schema_1.HistoryTable.finalStartCord,
            finalEndCord: history_schema_1.HistoryTable.finalEndCord,
            finalStartAddress: history_schema_1.HistoryTable.finalStartAddress,
            finalEndAddress: history_schema_1.HistoryTable.finalEndAddress,
            startAfter: history_schema_1.HistoryTable.startAfter,
            endedAt: history_schema_1.HistoryTable.endedAt,
            motocyclePhotoUrl: ridderInfo_schema_1.RidderInfoTable.motocyclePhotoUrl,
            motocycleLicense: ridderInfo_schema_1.RidderInfoTable.motocycleLicense,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            starRatingByPassenger: history_schema_1.HistoryTable.starRatingByPassenger,
            starRatingByRidder: history_schema_1.HistoryTable.starRatingByRidder,
            commentByPassenger: history_schema_1.HistoryTable.commentByPassenger,
            commentByRidder: history_schema_1.HistoryTable.commentByRidder,
            createdAt: history_schema_1.HistoryTable.createdAt,
            updatedAt: history_schema_1.HistoryTable.updatedAt,
        }).from(history_schema_1.HistoryTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, userId), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, userId))))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, history_schema_1.HistoryTable.passengerId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, history_schema_1.HistoryTable.ridderId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, history_schema_1.HistoryTable.passengerId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, history_schema_1.HistoryTable.ridderId));
    }
    async searchPaginationHistoryByPassengerId(passengerId, limit, offset) {
        return await this.db.select({
            id: history_schema_1.HistoryTable.id,
            finalStartCord: history_schema_1.HistoryTable.finalStartCord,
            finalEndCord: history_schema_1.HistoryTable.finalEndCord,
            finalStartAddress: history_schema_1.HistoryTable.finalStartAddress,
            finalEndAddress: history_schema_1.HistoryTable.finalEndAddress,
            ridderName: ridder_schema_1.RidderTable.userName,
            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            finalPrice: history_schema_1.HistoryTable.finalPrice,
            startAfter: history_schema_1.HistoryTable.startAfter,
            endedAt: history_schema_1.HistoryTable.endedAt,
            createdAt: history_schema_1.HistoryTable.createdAt,
            updatedAt: history_schema_1.HistoryTable.updatedAt,
            ridderPhoneNumber: ridderInfo_schema_1.RidderInfoTable.phoneNumber,
            motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
            status: history_schema_1.HistoryTable.status,
        }).from(history_schema_1.HistoryTable)
            .where((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, passengerId))
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, history_schema_1.HistoryTable.ridderId))
            .leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
            .orderBy((0, drizzle_orm_1.desc)(history_schema_1.HistoryTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async searchPaginationHistoryByRidderId(ridderId, limit, offset) {
        return await this.db.select({
            id: history_schema_1.HistoryTable.id,
            finalStartCord: history_schema_1.HistoryTable.finalStartCord,
            finalEndCord: history_schema_1.HistoryTable.finalEndCord,
            finalStartAddress: history_schema_1.HistoryTable.finalStartAddress,
            finalEndAddress: history_schema_1.HistoryTable.finalEndAddress,
            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            finalPrice: history_schema_1.HistoryTable.finalPrice,
            startAfter: history_schema_1.HistoryTable.startAfter,
            endedAt: history_schema_1.HistoryTable.endedAt,
            createdAt: history_schema_1.HistoryTable.createdAt,
            updatedAt: history_schema_1.HistoryTable.updatedAt,
            passengerPhoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
            status: history_schema_1.HistoryTable.status,
        }).from(history_schema_1.HistoryTable)
            .where((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, ridderId))
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, history_schema_1.HistoryTable.ridderId))
            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
            .orderBy((0, drizzle_orm_1.desc)(history_schema_1.HistoryTable.updatedAt))
            .limit(limit)
            .offset(offset);
    }
    async rateAndCommentHistoryForPassengerById(id, passengerId, rateAndCommentHistoryDto) {
        const passenger = await this.db.select({
            isEmailAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isEmailAuthenticated,
        }).from(passengerAuth_schema_1.PassengerAuthTable)
            .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, passengerId));
        if (!passenger || passenger.length === 0)
            throw exceptions_1.ClientPassengerNotFoundException;
        if (!passenger[0].isEmailAuthenticated)
            throw exceptions_1.ClientWithoutAdvanceAuthorizedUserException;
        return await this.db.update(history_schema_1.HistoryTable).set({
            starRatingByPassenger: rateAndCommentHistoryDto.starRating,
            commentByPassenger: rateAndCommentHistoryDto.comment,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, passengerId))).returning({
            status: history_schema_1.HistoryTable.status,
        });
    }
    async rateAndCommentHistoryForRidderById(id, ridderId, rateAndCommentHistoryDto) {
        const ridder = await this.db.select({
            isEmailAuthenticated: ridderAuth_schema_1.RidderAuthTable.isEmailAuthenticated,
        }).from(ridderAuth_schema_1.RidderAuthTable)
            .where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, ridderId));
        if (!ridder || ridder.length === 0)
            throw exceptions_1.ClientRidderNotFoundException;
        if (!ridder[0].isEmailAuthenticated)
            throw exceptions_1.ClientWithoutAdvanceAuthorizedUserException;
        return await this.db.update(history_schema_1.HistoryTable).set({
            starRatingByRidder: rateAndCommentHistoryDto.starRating,
            commentByRidder: rateAndCommentHistoryDto.comment,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, ridderId))).returning({
            status: history_schema_1.HistoryTable.status,
        });
    }
    async delinkHistoryByPassengerId(id, passengerId) {
        const responseOfUpdatingHistory = await this.db.update(history_schema_1.HistoryTable).set({
            passengerId: null,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, passengerId), (0, drizzle_orm_1.ne)(history_schema_1.HistoryTable.starRatingByPassenger, "0")))
            .returning({
            passengerId: history_schema_1.HistoryTable.passengerId,
            ridderId: history_schema_1.HistoryTable.ridderId,
        });
        if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
            throw exceptions_1.ClientHistoryNotFoundException;
        }
        if (responseOfUpdatingHistory[0].ridderId === null) {
            const responseOfDeletingHistory = await this.db.delete(history_schema_1.HistoryTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.isNull)(history_schema_1.HistoryTable.passengerId), (0, drizzle_orm_1.isNull)(history_schema_1.HistoryTable.ridderId)))
                .returning({
                id: history_schema_1.HistoryTable.id,
            });
            if (!responseOfDeletingHistory || responseOfDeletingHistory.length === 0) {
                throw exceptions_1.ClientHistoryNotFoundException;
            }
        }
        return [{
                id: id,
            }];
    }
    async delinkHistoryByRidderId(id, ridderId) {
        const responseOfUpdatingHistory = await this.db.update(history_schema_1.HistoryTable).set({
            ridderId: null,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, ridderId), (0, drizzle_orm_1.ne)(history_schema_1.HistoryTable.starRatingByRidder, "0")))
            .returning({
            passengerId: history_schema_1.HistoryTable.passengerId,
            ridderId: history_schema_1.HistoryTable.ridderId,
        });
        if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
            throw exceptions_1.ClientHistoryNotFoundException;
        }
        if (responseOfUpdatingHistory[0].passengerId === null) {
            const responseOfDeletingHistory = await this.db.delete(history_schema_1.HistoryTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.isNull)(history_schema_1.HistoryTable.passengerId), (0, drizzle_orm_1.isNull)(history_schema_1.HistoryTable.ridderId)))
                .returning({
                id: history_schema_1.HistoryTable.id,
            });
            if (!responseOfDeletingHistory || responseOfDeletingHistory.length === 0) {
                throw exceptions_1.ClientHistoryNotFoundException;
            }
        }
        return [{
                id: id,
            }];
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], HistoryService);
//# sourceMappingURL=history.service.js.map