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
exports.RidderPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
const exceptions_1 = require("../exceptions");
const drizzle_orm_1 = require("drizzle-orm");
const ridderPreferences_schema_1 = require("../drizzle/schema/ridderPreferences.schema");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
let RidderPreferencesService = class RidderPreferencesService {
    constructor(db) {
        this.db = db;
    }
    async createRidderPreferenceByPreferenceUserName(userId, preferenceUserName) {
        return await this.db.transaction(async (tx) => {
            const preferenceUser = await tx.select({
                id: passenger_schema_1.PassengerTable.id,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, preferenceUserName));
            if (!preferenceUser || preferenceUser.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const responseOfCreatingRiddePreference = await tx.insert(ridderPreferences_schema_1.RidderPreferences).values({
                userId: userId,
                preferenceUserId: preferenceUser[0].id,
            }).returning();
            return responseOfCreatingRiddePreference && responseOfCreatingRiddePreference.length !== 0 ? [{}] : undefined;
        });
    }
    async searchPaginationRidderPreferences(userId, preferenceUserName = undefined, limit, offset) {
        return await this.db.select({
            preferenceUserName: passenger_schema_1.PassengerTable.userName,
            preferenceUserAvatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            isPreferenceUserOnline: passengerInfo_schema_1.PassengerInfoTable.isOnline,
        }).from(ridderPreferences_schema_1.RidderPreferences)
            .leftJoin(passenger_schema_1.PassengerTable, (0, drizzle_orm_1.eq)(ridderPreferences_schema_1.RidderPreferences.preferenceUserId, passenger_schema_1.PassengerTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderPreferences_schema_1.RidderPreferences.userId, userId), (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, preferenceUserName + "%"))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
            .limit(limit)
            .offset(offset);
    }
    async deleteRidderPreferenceByUserIdAndPreferenceUserId(userId, preferenceUserName) {
        return await this.db.transaction(async (tx) => {
            const preferenceUser = await tx.select({
                id: passenger_schema_1.PassengerTable.id,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, preferenceUserName));
            if (!preferenceUser || preferenceUser.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const responseOfDeletingRidderPreference = await tx.delete(ridderPreferences_schema_1.RidderPreferences)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderPreferences_schema_1.RidderPreferences.userId, userId), (0, drizzle_orm_1.eq)(ridderPreferences_schema_1.RidderPreferences.preferenceUserId, preferenceUser[0].id))).returning();
            return responseOfDeletingRidderPreference && responseOfDeletingRidderPreference.length !== 0 ? [{}] : undefined;
        });
    }
};
exports.RidderPreferencesService = RidderPreferencesService;
exports.RidderPreferencesService = RidderPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], RidderPreferencesService);
//# sourceMappingURL=ridderPreferences.service.js.map