"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RidderPreferencesService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_module_1 = require("../drizzle/drizzle.module");
var passenger_schema_1 = require("../drizzle/schema/passenger.schema");
var exceptions_1 = require("../exceptions");
var drizzle_orm_1 = require("drizzle-orm");
var ridderPreferences_schema_1 = require("../drizzle/schema/ridderPreferences.schema");
var passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
var RidderPreferencesService = /** @class */ (function () {
    function RidderPreferencesService(db) {
        this.db = db;
    }
    /* ================================= Create operations ================================= */
    RidderPreferencesService.prototype.createRidderPreferenceByPreferenceUserName = function (userId, preferenceUserName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var preferenceUser, responseOfCreatingRiddePreference;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: passenger_schema_1.PassengerTable.id
                                        }).from(passenger_schema_1.PassengerTable)
                                            .where(drizzle_orm_1.eq(passenger_schema_1.PassengerTable.userName, preferenceUserName))];
                                    case 1:
                                        preferenceUser = _a.sent();
                                        if (!preferenceUser || preferenceUser.length === 0) {
                                            throw exceptions_1.ClientPassengerNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.insert(ridderPreferences_schema_1.RidderPreferences).values({
                                                userId: userId,
                                                preferenceUserId: preferenceUser[0].id
                                            }).returning()];
                                    case 2:
                                        responseOfCreatingRiddePreference = _a.sent();
                                        return [2 /*return*/, responseOfCreatingRiddePreference && responseOfCreatingRiddePreference.length !== 0 ? [{}] : undefined];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Create operations ================================= */
    /* ================================= Search operations ================================= */
    RidderPreferencesService.prototype.searchPaginationRidderPreferences = function (userId, preferenceUserName, limit, offset) {
        if (preferenceUserName === void 0) { preferenceUserName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            preferenceUserName: passenger_schema_1.PassengerTable.userName,
                            preferenceUserAvatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            preferenceUserSelfIntroduction: passengerInfo_schema_1.PassengerInfoTable.selfIntroduction,
                            isPreferenceUserOnline: passengerInfo_schema_1.PassengerInfoTable.isOnline
                        }).from(ridderPreferences_schema_1.RidderPreferences)
                            .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(ridderPreferences_schema_1.RidderPreferences.preferenceUserId, passenger_schema_1.PassengerTable.id))
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderPreferences_schema_1.RidderPreferences.userId, userId), drizzle_orm_1.or(drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, preferenceUserName + "%"), drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, preferenceUserName + "%")))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Search operations ================================= */
    /* ================================= Delete operations ================================= */
    RidderPreferencesService.prototype.deleteRidderPreferenceByUserIdAndPreferenceUserId = function (userId, preferenceUserName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var preferenceUser, responseOfDeletingRidderPreference;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: passenger_schema_1.PassengerTable.id
                                        }).from(passenger_schema_1.PassengerTable)
                                            .where(drizzle_orm_1.eq(passenger_schema_1.PassengerTable.userName, preferenceUserName))];
                                    case 1:
                                        preferenceUser = _a.sent();
                                        if (!preferenceUser || preferenceUser.length === 0) {
                                            throw exceptions_1.ClientPassengerNotFoundException;
                                        }
                                        return [4 /*yield*/, tx["delete"](ridderPreferences_schema_1.RidderPreferences)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderPreferences_schema_1.RidderPreferences.userId, userId), drizzle_orm_1.eq(ridderPreferences_schema_1.RidderPreferences.preferenceUserId, preferenceUser[0].id))).returning()];
                                    case 2:
                                        responseOfDeletingRidderPreference = _a.sent();
                                        return [2 /*return*/, responseOfDeletingRidderPreference && responseOfDeletingRidderPreference.length !== 0 ? [{}] : undefined];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderPreferencesService = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], RidderPreferencesService);
    return RidderPreferencesService;
}());
exports.RidderPreferencesService = RidderPreferencesService;
