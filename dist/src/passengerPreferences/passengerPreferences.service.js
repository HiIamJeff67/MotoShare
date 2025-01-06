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
exports.PassengerPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerPreferences_schema_1 = require("../drizzle/schema/passengerPreferences.schema");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
let PassengerPreferencesService = class PassengerPreferencesService {
    constructor(db) {
        this.db = db;
    }
    async createPassengerPreferenceByPreferenceUserName(userId, preferenceUserName) {
        return await this.db.transaction(async (tx) => {
            const preferenceUser = await tx.select({
                id: ridder_schema_1.RidderTable.id,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, preferenceUserName));
            if (!preferenceUser || preferenceUser.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            const responseOfCreatingPassengerPreference = await tx.insert(passengerPreferences_schema_1.PassengerPreferences).values({
                userId: userId,
                preferenceUserId: preferenceUser[0].id,
            }).returning();
            return responseOfCreatingPassengerPreference && responseOfCreatingPassengerPreference.length !== 0 ? [{}] : undefined;
        });
    }
    async searchPaginationPassengerPreferences(userId, preferenceUserName = undefined, limit, offset) {
        return await this.db.select({
            preferenceUserName: ridder_schema_1.RidderTable.userName,
            preferenceUserAvatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
            preferenceUserSelfIntroduction: ridderInfo_schema_1.RidderInfoTable.selfIntroduction,
            isPreferenceUserOnline: ridderInfo_schema_1.RidderInfoTable.isOnline,
        }).from(passengerPreferences_schema_1.PassengerPreferences)
            .leftJoin(ridder_schema_1.RidderTable, (0, drizzle_orm_1.eq)(passengerPreferences_schema_1.PassengerPreferences.preferenceUserId, ridder_schema_1.RidderTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerPreferences_schema_1.PassengerPreferences.userId, userId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, preferenceUserName + "%"), (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.email, preferenceUserName + "%")))).leftJoin(ridderInfo_schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
            .limit(limit)
            .offset(offset);
    }
    async deletePassengerPreferenceByUserIdAndPreferenceUserId(userId, preferenceUserName) {
        return await this.db.transaction(async (tx) => {
            const ridder = await tx.select({
                id: ridder_schema_1.RidderTable.id,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, preferenceUserName));
            if (!ridder || ridder.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            const responseOfDeletingPassengerPreferences = await tx.delete(passengerPreferences_schema_1.PassengerPreferences)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerPreferences_schema_1.PassengerPreferences.userId, userId), (0, drizzle_orm_1.eq)(passengerPreferences_schema_1.PassengerPreferences.preferenceUserId, ridder[0].id))).returning();
            return responseOfDeletingPassengerPreferences && responseOfDeletingPassengerPreferences.length !== 0 ? [{}] : undefined;
        });
    }
};
exports.PassengerPreferencesService = PassengerPreferencesService;
exports.PassengerPreferencesService = PassengerPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PassengerPreferencesService);
//# sourceMappingURL=passengerPreferences.service.js.map