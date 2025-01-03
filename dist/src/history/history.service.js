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
const passengerAuth_schema_1 = require("../drizzle/schema/passengerAuth.schema");
const ridderAuth_schema_1 = require("../drizzle/schema/ridderAuth.schema");
const exceptions_1 = require("../exceptions");
const notificationTemplate_1 = require("../notification/notificationTemplate");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
let HistoryService = class HistoryService {
    constructor(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async _updateAverageStarRatingByPassengerId(userId) {
        return await this.db.transaction(async (tx) => {
            const response = await tx.select({
                avgStarRating: (0, drizzle_orm_1.avg)((0, drizzle_orm_1.sql) `cast(${history_schema_1.HistoryTable.starRatingByRidder}::text as int)`),
            }).from(history_schema_1.HistoryTable)
                .where((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, userId));
            if (!response || response.length === 0) {
                throw exceptions_1.ClientCalculatePassengerAverageStarRatingException;
            }
            if (response[0].avgStarRating === null) {
                return [null];
            }
            else {
                return await tx.update(passengerInfo_schema_1.PassengerInfoTable).set({
                    avgStarRating: response[0].avgStarRating,
                }).where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, userId))
                    .returning({
                    avgStarRating: passengerInfo_schema_1.PassengerInfoTable.avgStarRating,
                });
            }
        });
    }
    async _updateAverageStarRatingByRidderId(userId) {
        return await this.db.transaction(async (tx) => {
            const respone = await tx.select({
                avgStarRating: (0, drizzle_orm_1.avg)((0, drizzle_orm_1.sql) `cast(${history_schema_1.HistoryTable.starRatingByRidder})::text as int`),
            }).from(history_schema_1.HistoryTable)
                .where((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, userId));
            if (!respone || respone.length === 0) {
                throw exceptions_1.ClientCalculateRidderAverageStarRatingException;
            }
            if (respone[0].avgStarRating === null) {
                return [null];
            }
            else {
                return await tx.update(ridderInfo_schema_1.RidderInfoTable).set({
                    avgStarRating: respone[0].avgStarRating,
                }).where((0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, userId))
                    .returning({
                    avgStarRating: ridderInfo_schema_1.RidderInfoTable.avgStarRating,
                });
            }
        });
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
    async rateAndCommentHistoryForPassengerById(id, passengerId, passengerName, rateAndCommentHistoryDto) {
        return await this.db.transaction(async (tx) => {
            const passenger = await tx.select({
                isEmailAuthenticated: passengerAuth_schema_1.PassengerAuthTable.isEmailAuthenticated,
            }).from(passengerAuth_schema_1.PassengerAuthTable)
                .where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, passengerId));
            if (!passenger || passenger.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            if (!passenger[0].isEmailAuthenticated)
                throw exceptions_1.ClientWithoutAdvanceAuthorizedUserException;
            const responseOfUpdatingHistory = await tx.update(history_schema_1.HistoryTable).set({
                starRatingByPassenger: rateAndCommentHistoryDto.starRating,
                commentByPassenger: rateAndCommentHistoryDto.comment,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.passengerId, passengerId))).returning({
                id: history_schema_1.HistoryTable.id,
                ridderId: history_schema_1.HistoryTable.ridderId,
                starRatingByPassenger: history_schema_1.HistoryTable.starRatingByPassenger,
                commentByPassenger: history_schema_1.HistoryTable.commentByPassenger,
                status: history_schema_1.HistoryTable.status,
            });
            if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
                throw exceptions_1.ClientHistoryNotFoundException;
            }
            if (responseOfUpdatingHistory[0].ridderId) {
                const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfRatingAndCommentingHistory)(passengerName, responseOfUpdatingHistory[0].ridderId, responseOfUpdatingHistory[0].id, responseOfUpdatingHistory[0].starRatingByPassenger, responseOfUpdatingHistory[0].commentByPassenger ?? ""));
                if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                    throw exceptions_1.ClientCreateRidderNotificationException;
                }
                this._updateAverageStarRatingByRidderId(responseOfUpdatingHistory[0].ridderId);
            }
            return [{
                    id: responseOfUpdatingHistory[0].id,
                    status: responseOfUpdatingHistory[0].status,
                }];
        });
    }
    async rateAndCommentHistoryForRidderById(id, ridderId, ridderName, rateAndCommentHistoryDto) {
        const ridder = await this.db.select({
            isEmailAuthenticated: ridderAuth_schema_1.RidderAuthTable.isEmailAuthenticated,
        }).from(ridderAuth_schema_1.RidderAuthTable)
            .where((0, drizzle_orm_1.eq)(ridderAuth_schema_1.RidderAuthTable.userId, ridderId));
        if (!ridder || ridder.length === 0)
            throw exceptions_1.ClientRidderNotFoundException;
        if (!ridder[0].isEmailAuthenticated)
            throw exceptions_1.ClientWithoutAdvanceAuthorizedUserException;
        const responseOfUpdatingHistory = await this.db.update(history_schema_1.HistoryTable).set({
            starRatingByRidder: rateAndCommentHistoryDto.starRating,
            commentByRidder: rateAndCommentHistoryDto.comment,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.id, id), (0, drizzle_orm_1.eq)(history_schema_1.HistoryTable.ridderId, ridderId))).returning({
            id: history_schema_1.HistoryTable.id,
            passengerId: history_schema_1.HistoryTable.passengerId,
            starRatingByRidder: history_schema_1.HistoryTable.starRatingByRidder,
            commentByRidder: history_schema_1.HistoryTable.commentByRidder,
            status: history_schema_1.HistoryTable.status,
        });
        if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
            throw exceptions_1.ClientHistoryNotFoundException;
        }
        if (responseOfUpdatingHistory[0].passengerId) {
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfRatingAndCommentingHistory)(ridderName, responseOfUpdatingHistory[0].passengerId, responseOfUpdatingHistory[0].id, responseOfUpdatingHistory[0].starRatingByRidder, responseOfUpdatingHistory[0].commentByRidder ?? ""));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            this._updateAverageStarRatingByPassengerId(responseOfUpdatingHistory[0].passengerId);
        }
        return [{
                id: responseOfUpdatingHistory[0].id,
                status: responseOfUpdatingHistory[0].status,
            }];
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
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], HistoryService);
//# sourceMappingURL=history.service.js.map