"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SupplyOrderService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_module_1 = require("../../src/drizzle/drizzle.module");
var supplyOrder_schema_1 = require("../../src/drizzle/schema/supplyOrder.schema");
var drizzle_orm_1 = require("drizzle-orm");
var ridder_schema_1 = require("../drizzle/schema/ridder.schema");
var ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
var exceptions_1 = require("../exceptions");
var passengerInvite_schema_1 = require("../drizzle/schema/passengerInvite.schema");
var order_schema_1 = require("../drizzle/schema/order.schema");
var notificationTemplate_1 = require("../notification/notificationTemplate");
var SupplyOrderService = /** @class */ (function () {
    function SupplyOrderService(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    /* ================================= Detect And Update Expired SupplyOrders operation ================================= */
    SupplyOrderService.prototype.updateExpiredSupplyOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.update(supplyOrder_schema_1.SupplyOrderTable).set({
                            status: "EXPIRED"
                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), drizzle_orm_1.lt(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date()))).returning({
                            id: supplyOrder_schema_1.SupplyOrderTable.id
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            throw exceptions_1.ServerNeonAutoUpdateExpiredSupplyOrderException;
                        }
                        return [2 /*return*/, response.length];
                }
            });
        });
    };
    /* ================================= Detect And Update Expired SupplyOrders operation ================================= */
    /* ================================= Create operations ================================= */
    SupplyOrderService.prototype.createSupplyOrderByCreatorId = function (creatorId, createSupplyOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingConflictSupplyOrders, responseOfCreatingSupplyOrder;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: supplyOrder_schema_1.SupplyOrderTable.id
                                        }).from(supplyOrder_schema_1.SupplyOrderTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(createSupplyOrderDto.startAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(createSupplyOrderDto.endedAt)))))];
                                    case 1:
                                        responseOfSelectingConflictSupplyOrders = _a.sent();
                                        return [4 /*yield*/, tx.insert(supplyOrder_schema_1.SupplyOrderTable).values({
                                                creatorId: creatorId,
                                                description: createSupplyOrderDto.description,
                                                initPrice: createSupplyOrderDto.initPrice,
                                                startCord: drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "), \n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "), \n          4326\n        )"])), createSupplyOrderDto.startCordLongitude, createSupplyOrderDto.startCordLatitude),
                                                endCord: drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "), \n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "), \n          4326\n        )"])), createSupplyOrderDto.endCordLongitude, createSupplyOrderDto.endCordLatitude),
                                                startAddress: createSupplyOrderDto.startAddress,
                                                endAddress: createSupplyOrderDto.endAddress,
                                                startAfter: new Date(createSupplyOrderDto.startAfter),
                                                endedAt: new Date(createSupplyOrderDto.endedAt),
                                                tolerableRDV: createSupplyOrderDto.tolerableRDV,
                                                autoAccept: createSupplyOrderDto.autoAccept
                                            }).returning({
                                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                                status: supplyOrder_schema_1.SupplyOrderTable.status
                                            })];
                                    case 2:
                                        responseOfCreatingSupplyOrder = _a.sent();
                                        return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0) }, responseOfCreatingSupplyOrder[0])]];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Create operations ================================= */
    /* ================================= Get operations ================================= */
    // for specifying the details of that other SupplyOrders
    SupplyOrderService.prototype.getSupplyOrderById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query.SupplyOrderTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id)),
                            columns: {
                                id: true,
                                initPrice: true,
                                description: true,
                                startCord: true,
                                endCord: true,
                                startAddress: true,
                                endAddress: true,
                                createdAt: true,
                                updatedAt: true,
                                startAfter: true,
                                endedAt: true,
                                tolerableRDV: true,
                                autoAccept: true,
                                status: true
                            },
                            "with": {
                                creator: {
                                    columns: {
                                        userName: true
                                    },
                                    "with": {
                                        info: {
                                            columns: {
                                                isOnline: true,
                                                avatorUrl: true,
                                                motocycleType: true,
                                                motocyclePhotoUrl: true
                                            }
                                        }
                                    }
                                }
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Search operations ================= */
    SupplyOrderService.prototype.searchSupplyOrdersByCreatorId = function (creatorId, limit, offset, isAutoAccept) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            id: supplyOrder_schema_1.SupplyOrderTable.id,
                            initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                            startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                            endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                            startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                            endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                            startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                            endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                            createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                            updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                            tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                            autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                            status: supplyOrder_schema_1.SupplyOrderTable.status
                        }).from(supplyOrder_schema_1.SupplyOrderTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined))).orderBy(drizzle_orm_1.desc(supplyOrder_schema_1.SupplyOrderTable.updatedAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchPaginationSupplyOrders = function (creatorName, limit, offset, isAutoAccept) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                                .orderBy(drizzle_orm_1.desc(supplyOrder_schema_1.SupplyOrderTable.updatedAt))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchAboutToStartSupplyOrders = function (creatorName, limit, offset, isAutoAccept) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                                .orderBy(drizzle_orm_1.asc(supplyOrder_schema_1.SupplyOrderTable.startAfter))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchSimilarTimeSupplyOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarTimeSupplyOrderDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) + \n              ABS(EXTRACT(EPOCH FROM (", " - ", ")))"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) + \n              ABS(EXTRACT(EPOCH FROM (", " - ", ")))"])), supplyOrder_schema_1.SupplyOrderTable.startAfter, getSimilarTimeSupplyOrderDto.startAfter, supplyOrder_schema_1.SupplyOrderTable.endedAt, getSimilarTimeSupplyOrderDto.endedAt)).limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchCurAdjacentSupplyOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentSupplyOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status,
                                manhattanDistance: drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["ST_Distance(\n        ", ", \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"], ["ST_Distance(\n        ", ", \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"])), supplyOrder_schema_1.SupplyOrderTable.startCord, getAdjacentSupplyOrdersDto.cordLongitude, getAdjacentSupplyOrdersDto.cordLatitude)
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["ST_Distance(\n          ", ", \n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"], ["ST_Distance(\n          ", ", \n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"])), supplyOrder_schema_1.SupplyOrderTable.startCord, getAdjacentSupplyOrdersDto.cordLongitude, getAdjacentSupplyOrdersDto.cordLatitude))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchDestAdjacentSupplyOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentSupplyOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status,
                                manhattanDistance: drizzle_orm_1.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"], ["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"])), supplyOrder_schema_1.SupplyOrderTable.endCord, getAdjacentSupplyOrdersDto.cordLongitude, getAdjacentSupplyOrdersDto.cordLatitude)
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"], ["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"])), supplyOrder_schema_1.SupplyOrderTable.endCord, getAdjacentSupplyOrdersDto.cordLongitude, getAdjacentSupplyOrdersDto.cordLatitude))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.searchSimilarRouteSupplyOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarRouteSupplyOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: supplyOrder_schema_1.SupplyOrderTable.id,
                                creatorName: ridder_schema_1.RidderTable.userName,
                                avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                                initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice,
                                startCord: supplyOrder_schema_1.SupplyOrderTable.startCord,
                                endCord: supplyOrder_schema_1.SupplyOrderTable.endCord,
                                startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress,
                                endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress,
                                createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt,
                                updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt,
                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter,
                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt,
                                tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV,
                                motocycleType: ridderInfo_schema_1.RidderInfoTable.motocycleType,
                                autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept,
                                status: supplyOrder_schema_1.SupplyOrderTable.status,
                                RDV: drizzle_orm_1.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n      "], ["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n      "])), supplyOrder_schema_1.SupplyOrderTable.startCord, getSimilarRouteSupplyOrdersDto.startCordLongitude, getSimilarRouteSupplyOrdersDto.startCordLatitude, getSimilarRouteSupplyOrdersDto.startCordLongitude, getSimilarRouteSupplyOrdersDto.startCordLatitude, getSimilarRouteSupplyOrdersDto.endCordLongitude, getSimilarRouteSupplyOrdersDto.endCordLatitude, getSimilarRouteSupplyOrdersDto.endCordLongitude, getSimilarRouteSupplyOrdersDto.endCordLatitude, supplyOrder_schema_1.SupplyOrderTable.endCord, supplyOrder_schema_1.SupplyOrderTable.startCord, supplyOrder_schema_1.SupplyOrderTable.endCord)
                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, supplyOrder_schema_1.SupplyOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined)))).leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n        "], ["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n        "])), supplyOrder_schema_1.SupplyOrderTable.startCord, getSimilarRouteSupplyOrdersDto.startCordLongitude, getSimilarRouteSupplyOrdersDto.startCordLatitude, getSimilarRouteSupplyOrdersDto.startCordLongitude, getSimilarRouteSupplyOrdersDto.startCordLatitude, getSimilarRouteSupplyOrdersDto.endCordLongitude, getSimilarRouteSupplyOrdersDto.endCordLatitude, getSimilarRouteSupplyOrdersDto.endCordLongitude, getSimilarRouteSupplyOrdersDto.endCordLatitude, supplyOrder_schema_1.SupplyOrderTable.endCord, supplyOrder_schema_1.SupplyOrderTable.startCord, supplyOrder_schema_1.SupplyOrderTable.endCord))
                                .limit(limit)
                                .offset(offset)];
                    case 2: 
                    // consider the similarity of the given route and every other passible route in SupplyOrderTable
                    // RDV = (|ridder.start - passenger.start| + |passenger.start - passenger.end| + |passenger.end - ridder.end|) - (|ridder.start - ridder.end|)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Search operations ================= */
    /* ================= Powerful Search operations ================= */
    SupplyOrderService.prototype.searchBetterFirstSupplyOrders = function (creatorName, limit, offset, isAutoAccept, getBetterSupplyOrderDto, searchPriorities) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var timeQuery, aboutToStartQuery, routeQuery, startQuery, destQuery, updatedAtQuery, spaceResponseField, sortMap, searchQueries;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
                        spaceResponseField = {};
                        if (getBetterSupplyOrderDto.startAfter || getBetterSupplyOrderDto.endedAt) {
                            timeQuery = drizzle_orm_1.sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["(\n              ", "\n              ", "\n              ", "\n            ) ASC"], ["(\n              ",
                                "\n              ", "\n              ",
                                "\n            ) ASC"])), getBetterSupplyOrderDto.startAfter ? drizzle_orm_1.sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"], ["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"])), supplyOrder_schema_1.SupplyOrderTable.startAfter, getBetterSupplyOrderDto.startAfter) : drizzle_orm_1.sql(templateObject_11 || (templateObject_11 = __makeTemplateObject([""], [""]))), getBetterSupplyOrderDto.startAfter && getBetterSupplyOrderDto.endedAt ? drizzle_orm_1.sql(templateObject_12 || (templateObject_12 = __makeTemplateObject([" + "], [" + "]))) : drizzle_orm_1.sql(templateObject_13 || (templateObject_13 = __makeTemplateObject([""], [""]))), getBetterSupplyOrderDto.endedAt ? drizzle_orm_1.sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"], ["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"])), supplyOrder_schema_1.SupplyOrderTable.endedAt, getBetterSupplyOrderDto.endedAt) : drizzle_orm_1.sql(templateObject_15 || (templateObject_15 = __makeTemplateObject([""], [""]))));
                        }
                        if (getBetterSupplyOrderDto.startCordLongitude && getBetterSupplyOrderDto.startCordLatitude
                            && getBetterSupplyOrderDto.endCordLongitude && getBetterSupplyOrderDto.endCordLatitude) {
                            routeQuery = drizzle_orm_1.sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              ) \n            + ST_Distance(\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              ) \n            + ST_Distance(\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                  ", "\n              ) \n            - ST_Distance(\n                  ", ",\n                  ", "\n              )\n            ) ASC"], ["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              ) \n            + ST_Distance(\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              ) \n            + ST_Distance(\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                  ", "\n              ) \n            - ST_Distance(\n                  ", ",\n                  ", "\n              )\n            ) ASC"])), supplyOrder_schema_1.SupplyOrderTable.startCord, getBetterSupplyOrderDto.startCordLongitude, getBetterSupplyOrderDto.startCordLatitude, getBetterSupplyOrderDto.startCordLongitude, getBetterSupplyOrderDto.startCordLatitude, getBetterSupplyOrderDto.endCordLongitude, getBetterSupplyOrderDto.endCordLatitude, getBetterSupplyOrderDto.endCordLongitude, getBetterSupplyOrderDto.endCordLatitude, supplyOrder_schema_1.SupplyOrderTable.endCord, supplyOrder_schema_1.SupplyOrderTable.startCord, supplyOrder_schema_1.SupplyOrderTable.endCord);
                            spaceResponseField = { RDV: routeQuery };
                        }
                        else if (getBetterSupplyOrderDto.startCordLongitude && getBetterSupplyOrderDto.startCordLatitude) {
                            startQuery = drizzle_orm_1.sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              )\n            ) ASC"], ["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              )\n            ) ASC"])), supplyOrder_schema_1.SupplyOrderTable.startCord, getBetterSupplyOrderDto.startCordLongitude, getBetterSupplyOrderDto.startCordLatitude);
                            spaceResponseField = __assign(__assign({}, spaceResponseField), { startManhattanDistance: startQuery });
                        }
                        else if (getBetterSupplyOrderDto.endCordLongitude && getBetterSupplyOrderDto.endCordLatitude) {
                            destQuery = drizzle_orm_1.sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              )\n            ) ASC"], ["(\n              ST_Distance(\n                  ", ",\n                  ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n              )\n            ) ASC"])), supplyOrder_schema_1.SupplyOrderTable.endCord, getBetterSupplyOrderDto.endCordLongitude, getBetterSupplyOrderDto.endCordLatitude);
                            spaceResponseField = __assign(__assign({}, spaceResponseField), { destManhattanDistance: destQuery });
                        }
                        updatedAtQuery = drizzle_orm_1.sql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), supplyOrder_schema_1.SupplyOrderTable.updatedAt);
                        aboutToStartQuery = drizzle_orm_1.sql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), supplyOrder_schema_1.SupplyOrderTable.startAfter);
                        sortMap = {
                            'T': timeQuery,
                            'R': routeQuery,
                            'S': startQuery,
                            'D': destQuery,
                            'U': updatedAtQuery
                        };
                        searchQueries = searchPriorities.split('')
                            .map(function (symbol) { return sortMap[symbol]; })
                            .filter(function (query) { return query !== undefined; });
                        searchQueries.push(aboutToStartQuery);
                        return [4 /*yield*/, this.updateExpiredSupplyOrders()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (_a = this.db.select(__assign({ id: supplyOrder_schema_1.SupplyOrderTable.id, creatorName: ridder_schema_1.RidderTable.userName, avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl, initPrice: supplyOrder_schema_1.SupplyOrderTable.initPrice, startCord: supplyOrder_schema_1.SupplyOrderTable.startCord, endCord: supplyOrder_schema_1.SupplyOrderTable.endCord, startAddress: supplyOrder_schema_1.SupplyOrderTable.startAddress, endAddress: supplyOrder_schema_1.SupplyOrderTable.endAddress, createdAt: supplyOrder_schema_1.SupplyOrderTable.createdAt, updatedAt: supplyOrder_schema_1.SupplyOrderTable.updatedAt, startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter, endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt, tolerableRDV: supplyOrder_schema_1.SupplyOrderTable.tolerableRDV, autoAccept: supplyOrder_schema_1.SupplyOrderTable.autoAccept, status: supplyOrder_schema_1.SupplyOrderTable.status }, spaceResponseField)).from(supplyOrder_schema_1.SupplyOrderTable)
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(ridder_schema_1.RidderTable.email, creatorName + "%") : undefined))))
                                .leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInfo_schema_1.RidderInfoTable.userId))).orderBy.apply(_a, searchQueries).limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================================= Get operations ================================= */
    /* ================================= Update operations ================================= */
    SupplyOrderService.prototype.updateSupplyOrderById = function (id, creatorId, updateSupplyOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var newStartCord, newEndCord, responseOfSelectingConflictSupplyOrders, _a, startAfter, endedAt, tempResponse, _b, startAfter, endedAt, tempResponse, _c, startAfter, endedAt, resposeOfUpdatingSupplyOrder;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        newStartCord = (updateSupplyOrderDto.startCordLongitude !== undefined
                                            && updateSupplyOrderDto.startCordLatitude !== undefined)
                                            ? { x: updateSupplyOrderDto.startCordLongitude, y: updateSupplyOrderDto.startCordLatitude }
                                            : undefined;
                                        newEndCord = (updateSupplyOrderDto.endCordLongitude !== undefined
                                            && updateSupplyOrderDto.endCordLatitude !== undefined)
                                            ? { x: updateSupplyOrderDto.endCordLongitude, y: updateSupplyOrderDto.endCordLatitude }
                                            : undefined;
                                        responseOfSelectingConflictSupplyOrders = undefined;
                                        if (!(updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt)) return [3 /*break*/, 2];
                                        _a = [new Date(updateSupplyOrderDto.startAfter), new Date(updateSupplyOrderDto.endedAt)], startAfter = _a[0], endedAt = _a[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: supplyOrder_schema_1.SupplyOrderTable.id
                                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt)))))];
                                    case 1:
                                        responseOfSelectingConflictSupplyOrders = _d.sent();
                                        return [3 /*break*/, 8];
                                    case 2:
                                        if (!(updateSupplyOrderDto.startAfter && !updateSupplyOrderDto.endedAt)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.select({
                                                endedAt: supplyOrder_schema_1.SupplyOrderTable.endedAt
                                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId)))];
                                    case 3:
                                        tempResponse = _d.sent();
                                        if (!tempResponse || tempResponse.length === 0)
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        _b = [new Date(updateSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)], startAfter = _b[0], endedAt = _b[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: supplyOrder_schema_1.SupplyOrderTable.id
                                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(supplyOrder_schema_1.SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter)))))];
                                    case 4:
                                        responseOfSelectingConflictSupplyOrders = _d.sent();
                                        return [3 /*break*/, 8];
                                    case 5:
                                        if (!(!updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.select({
                                                startAfter: supplyOrder_schema_1.SupplyOrderTable.startAfter
                                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId)))];
                                    case 6:
                                        tempResponse = _d.sent();
                                        if (!tempResponse || tempResponse.length === 0)
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        _c = [new Date(tempResponse[0].startAfter), new Date(updateSupplyOrderDto.endedAt)], startAfter = _c[0], endedAt = _c[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: supplyOrder_schema_1.SupplyOrderTable.id
                                            }).from(supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.gte(supplyOrder_schema_1.SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt)))))];
                                    case 7:
                                        responseOfSelectingConflictSupplyOrders = _d.sent();
                                        _d.label = 8;
                                    case 8: return [4 /*yield*/, tx.update(supplyOrder_schema_1.SupplyOrderTable).set(__assign(__assign(__assign(__assign(__assign(__assign({ description: updateSupplyOrderDto.description, initPrice: updateSupplyOrderDto.initPrice }, (newStartCord
                                            ? { startCord: drizzle_orm_1.sql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newStartCord.x, newStartCord.y) }
                                            : {})), (newEndCord
                                            ? { endCord: drizzle_orm_1.sql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newEndCord.x, newEndCord.y) }
                                            : {})), { startAddress: updateSupplyOrderDto.startAddress, endAddress: updateSupplyOrderDto.endAddress }), (updateSupplyOrderDto.startAfter
                                            ? { startAfter: new Date(updateSupplyOrderDto.startAfter) }
                                            : {})), (updateSupplyOrderDto.endedAt
                                            ? { endedAt: new Date(updateSupplyOrderDto.endedAt) }
                                            : {})), { tolerableRDV: updateSupplyOrderDto.tolerableRDV, autoAccept: updateSupplyOrderDto.autoAccept, status: updateSupplyOrderDto.status, updatedAt: new Date() })).where(drizzle_orm_1.and(drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "RESERVED"), (updateSupplyOrderDto.startAfter || updateSupplyOrderDto.endedAt
                                            ? undefined
                                            : drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "EXPIRED")), // if the user don't update startAfter or endedAt in this time, 
                                        // then we add the constrant of excluding the "EXPIRED" supplyOrder
                                        drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId))).returning({
                                            id: supplyOrder_schema_1.SupplyOrderTable.id,
                                            status: supplyOrder_schema_1.SupplyOrderTable.status
                                        })];
                                    case 9:
                                        resposeOfUpdatingSupplyOrder = _d.sent();
                                        return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0) }, resposeOfUpdatingSupplyOrder[0])]];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Start with AutoAccept SupplyOrders operations ================================= */
    SupplyOrderService.prototype.startSupplyOrderWithoutInvite = function (id, userId, userName, acceptAutoAcceptSupplyOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var supplyOrder, responseOfRejectingOtherPassengerInvites, responseOfCreatingNotificationToRejectOthers, responseOfDeletingSupplyOrder, responseOfCreatingOrder, responseOfCreatingNotification;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            ridderName: ridder_schema_1.RidderTable.userName
                                        }).from(supplyOrder_schema_1.SupplyOrderTable)
                                            .where(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id))
                                            .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, ridder_schema_1.RidderTable.id))];
                                    case 1:
                                        supplyOrder = _a.sent();
                                        if (!supplyOrder || supplyOrder.length === 0) {
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                                                status: "REJECTED",
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.and(drizzle_orm_1.eq(passengerInvite_schema_1.PassengerInviteTable.orderId, id), drizzle_orm_1.eq(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).returning({
                                                id: passengerInvite_schema_1.PassengerInviteTable.id,
                                                userId: passengerInvite_schema_1.PassengerInviteTable.userId
                                            })];
                                    case 2:
                                        responseOfRejectingOtherPassengerInvites = _a.sent();
                                        if (!(responseOfRejectingOtherPassengerInvites && responseOfRejectingOtherPassengerInvites.length !== 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfRejectingOtherPassengerInvites.map(function (content) {
                                                return notificationTemplate_1.NotificationTemplateOfRejectingPassengerInvite(supplyOrder[0].ridderName, supplyOrder[0].ridderName + "'s supply order has started directly by some other passenger", content.userId, content.id);
                                            }))];
                                    case 3:
                                        responseOfCreatingNotificationToRejectOthers = _a.sent();
                                        if (!responseOfCreatingNotificationToRejectOthers
                                            || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherPassengerInvites.length) {
                                            throw exceptions_1.ClientCreatePassengerNotificationException;
                                        }
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                                            status: "RESERVED",
                                            updatedAt: new Date()
                                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.autoAccept, true))).returning()];
                                    case 5:
                                        responseOfDeletingSupplyOrder = _a.sent();
                                        if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.insert(order_schema_1.OrderTable).values({
                                                ridderId: responseOfDeletingSupplyOrder[0].creatorId,
                                                passengerId: userId,
                                                prevOrderId: "PurchaseOrder" + " " + responseOfDeletingSupplyOrder[0].id,
                                                finalPrice: responseOfDeletingSupplyOrder[0].initPrice,
                                                passengerDescription: responseOfDeletingSupplyOrder[0].description,
                                                ridderDescription: acceptAutoAcceptSupplyOrderDto.description,
                                                finalStartCord: drizzle_orm_1.sql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDeletingSupplyOrder[0].startCord.x, responseOfDeletingSupplyOrder[0].startCord.y),
                                                finalEndCord: drizzle_orm_1.sql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDeletingSupplyOrder[0].endCord.x, responseOfDeletingSupplyOrder[0].endCord.y),
                                                finalStartAddress: responseOfDeletingSupplyOrder[0].startAddress,
                                                finalEndAddress: responseOfDeletingSupplyOrder[0].endAddress,
                                                startAfter: responseOfDeletingSupplyOrder[0].startAfter,
                                                endedAt: responseOfDeletingSupplyOrder[0].endedAt
                                            }).returning({
                                                id: order_schema_1.OrderTable.id,
                                                finalPrice: order_schema_1.OrderTable.finalPrice,
                                                finalStartCord: order_schema_1.OrderTable.finalStartCord,
                                                finalEndCord: order_schema_1.OrderTable.finalEndCord,
                                                finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                                                finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                                                startAfter: order_schema_1.OrderTable.startAfter,
                                                endedAt: order_schema_1.OrderTable.endedAt,
                                                status: order_schema_1.OrderTable.passengerStatus
                                            })];
                                    case 6:
                                        responseOfCreatingOrder = _a.sent();
                                        if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
                                            throw exceptions_1.ClientCreateOrderException;
                                        }
                                        return [4 /*yield*/, this.ridderNotification.createRidderNotificationByUserId(notificationTemplate_1.NotificationTemplateOfDirectlyStartOrder(userName, responseOfDeletingSupplyOrder[0].creatorId, responseOfCreatingOrder[0].id))];
                                    case 7:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreateRidderNotificationException;
                                        }
                                        return [2 /*return*/, [{
                                                    orderId: responseOfCreatingOrder[0].id,
                                                    price: responseOfCreatingOrder[0].finalPrice,
                                                    finalStartCord: responseOfCreatingOrder[0].finalStartCord,
                                                    finalEndCord: responseOfCreatingOrder[0].finalEndCord,
                                                    finalStartAddress: responseOfCreatingOrder[0].finalStartAddress,
                                                    finalEndAddress: responseOfCreatingOrder[0].finalEndAddress,
                                                    startAfter: responseOfCreatingOrder[0].startAfter,
                                                    endedAt: responseOfCreatingOrder[0].endedAt,
                                                    orderStatus: responseOfCreatingOrder[0].status
                                                }]];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Start with AutoAccept SupplyOrders operations ================================= */
    /* ================================= Update operations ================================= */
    /* ================================= Delete operations ================================= */
    SupplyOrderService.prototype.cancelSupplyOrderById = function (id, creatorId, creatorName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfCancelingSupplyOrder, responseOfCancelingPassengerInvite, responseOfCreatingNotification;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.update(supplyOrder_schema_1.SupplyOrderTable).set({
                                            status: "CANCEL"
                                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"))).returning({
                                            id: supplyOrder_schema_1.SupplyOrderTable.id,
                                            stauts: supplyOrder_schema_1.SupplyOrderTable.status
                                        })];
                                    case 1:
                                        responseOfCancelingSupplyOrder = _a.sent();
                                        if (!responseOfCancelingSupplyOrder || responseOfCancelingSupplyOrder.length === 0) {
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.update(passengerInvite_schema_1.PassengerInviteTable).set({
                                                status: "CANCEL"
                                            }).where(drizzle_orm_1.and(drizzle_orm_1.eq(passengerInvite_schema_1.PassengerInviteTable.orderId, id), drizzle_orm_1.eq(passengerInvite_schema_1.PassengerInviteTable.status, "CHECKING"))).returning({
                                                id: passengerInvite_schema_1.PassengerInviteTable.id,
                                                passengerId: passengerInvite_schema_1.PassengerInviteTable.userId
                                            })];
                                    case 2:
                                        responseOfCancelingPassengerInvite = _a.sent();
                                        if (!responseOfCancelingPassengerInvite || responseOfCancelingPassengerInvite.length === 0) {
                                            throw exceptions_1.ClientInviteNotFoundException;
                                        }
                                        return [4 /*yield*/, this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfCancelingPassengerInvite.map(function (content) {
                                                return notificationTemplate_1.NotificationTemplateOfCancelingSupplyOrder(creatorName, content.passengerId, responseOfCancelingSupplyOrder[0].id);
                                            }))];
                                    case 3:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreatePassengerNotificationException;
                                        }
                                        return [2 /*return*/, responseOfCancelingSupplyOrder];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService.prototype.deleteSupplyOrderById = function (id, creatorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db["delete"](supplyOrder_schema_1.SupplyOrderTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.ne(supplyOrder_schema_1.SupplyOrderTable.status, "POSTED"), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, id), drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.creatorId, creatorId))).returning({
                            id: supplyOrder_schema_1.SupplyOrderTable.id,
                            status: supplyOrder_schema_1.SupplyOrderTable.status
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SupplyOrderService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], SupplyOrderService);
    return SupplyOrderService;
}());
exports.SupplyOrderService = SupplyOrderService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
