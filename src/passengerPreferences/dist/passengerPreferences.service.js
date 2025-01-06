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
exports.PassengerPreferencesService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_module_1 = require("../drizzle/drizzle.module");
var passengerPreferences_schema_1 = require("../drizzle/schema/passengerPreferences.schema");
var ridder_schema_1 = require("../drizzle/schema/ridder.schema");
var ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
var drizzle_orm_1 = require("drizzle-orm");
var exceptions_1 = require("../exceptions");
var PassengerPreferencesService = /** @class */ (function () {
    function PassengerPreferencesService(db) {
        this.db = db;
    }
    /* ================================= Create operations ================================= */
    PassengerPreferencesService.prototype.createPassengerPreferenceByPreferenceUserName = function (userId, preferenceUserName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var preferenceUser, responseOfCreatingPassengerPreference;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: ridder_schema_1.RidderTable.id
                                        }).from(ridder_schema_1.RidderTable)
                                            .where(drizzle_orm_1.eq(ridder_schema_1.RidderTable.userName, preferenceUserName))];
                                    case 1:
                                        preferenceUser = _a.sent();
                                        if (!preferenceUser || preferenceUser.length === 0) {
                                            throw exceptions_1.ClientRidderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.insert(passengerPreferences_schema_1.PassengerPreferences).values({
                                                userId: userId,
                                                preferenceUserId: preferenceUser[0].id
                                            }).returning()];
                                    case 2:
                                        responseOfCreatingPassengerPreference = _a.sent();
                                        return [2 /*return*/, responseOfCreatingPassengerPreference && responseOfCreatingPassengerPreference.length !== 0 ? [{}] : undefined];
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
    PassengerPreferencesService.prototype.searchPaginationPassengerPreferences = function (userId, preferenceUserName, limit, offset) {
        if (preferenceUserName === void 0) { preferenceUserName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            preferenceUserName: ridder_schema_1.RidderTable.userName,
                            preferenceUserAvatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            preferenceUserSelfIntroduction: ridderInfo_schema_1.RidderInfoTable.selfIntroduction,
                            isPreferenceUserOnline: ridderInfo_schema_1.RidderInfoTable.isOnline
                        }).from(passengerPreferences_schema_1.PassengerPreferences)
                            .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(passengerPreferences_schema_1.PassengerPreferences.preferenceUserId, ridder_schema_1.RidderTable.id))
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(passengerPreferences_schema_1.PassengerPreferences.userId, userId), drizzle_orm_1.or(drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, preferenceUserName + "%"), drizzle_orm_1.like(ridder_schema_1.RidderTable.email, preferenceUserName + "%")))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Search operations ================================= */
    /* ================================= Delete operations ================================= */
    PassengerPreferencesService.prototype.deletePassengerPreferenceByUserIdAndPreferenceUserId = function (userId, preferenceUserName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ridder, responseOfDeletingPassengerPreferences;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: ridder_schema_1.RidderTable.id
                                        }).from(ridder_schema_1.RidderTable)
                                            .where(drizzle_orm_1.eq(ridder_schema_1.RidderTable.userName, preferenceUserName))];
                                    case 1:
                                        ridder = _a.sent();
                                        if (!ridder || ridder.length === 0) {
                                            throw exceptions_1.ClientRidderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx["delete"](passengerPreferences_schema_1.PassengerPreferences)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(passengerPreferences_schema_1.PassengerPreferences.userId, userId), drizzle_orm_1.eq(passengerPreferences_schema_1.PassengerPreferences.preferenceUserId, ridder[0].id))).returning()];
                                    case 2:
                                        responseOfDeletingPassengerPreferences = _a.sent();
                                        return [2 /*return*/, responseOfDeletingPassengerPreferences && responseOfDeletingPassengerPreferences.length !== 0 ? [{}] : undefined];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PassengerPreferencesService = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], PassengerPreferencesService);
    return PassengerPreferencesService;
}());
exports.PassengerPreferencesService = PassengerPreferencesService;
