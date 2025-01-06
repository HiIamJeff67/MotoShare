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
exports.PurchaseOrderService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_orm_1 = require("drizzle-orm");
var drizzle_module_1 = require("../../src/drizzle/drizzle.module");
var purchaseOrder_schema_1 = require("../../src/drizzle/schema/purchaseOrder.schema");
var passenger_schema_1 = require("../drizzle/schema/passenger.schema");
var passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
var exceptions_1 = require("../exceptions");
var ridderInvite_schema_1 = require("../drizzle/schema/ridderInvite.schema");
var order_schema_1 = require("../drizzle/schema/order.schema");
var notificationTemplate_1 = require("../notification/notificationTemplate");
var PurchaseOrderService = /** @class */ (function () {
    function PurchaseOrderService(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    /* ================================= Detect And Update Expired PurchaseOrders operation ================================= */
    PurchaseOrderService.prototype.updateExpiredPurchaseOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                            status: "EXPIRED"
                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), drizzle_orm_1.lt(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date()))).returning({
                            id: purchaseOrder_schema_1.PurchaseOrderTable.id
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response) { // response.length can potentially be 0, since there's no expited orders
                            throw exceptions_1.ServerNeonAutoUpdateExpiredPurchaseOrderException;
                        }
                        return [2 /*return*/, response.length];
                }
            });
        });
    };
    /* ================================= Detect And Update Expired PurchaseOrders operation ================================= */
    /* ================================= Create operations ================================= */
    PurchaseOrderService.prototype.createPurchaseOrderByCreatorId = function (creatorId, createPurchaseOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingConflictPurchaseOrders, responseOfCreatingPurchaseOrder;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: purchaseOrder_schema_1.PurchaseOrderTable.id
                                        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(createPurchaseOrderDto.startAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(createPurchaseOrderDto.endedAt)))))];
                                    case 1:
                                        responseOfSelectingConflictPurchaseOrders = _a.sent();
                                        return [4 /*yield*/, tx.insert(purchaseOrder_schema_1.PurchaseOrderTable).values({
                                                creatorId: creatorId,
                                                description: createPurchaseOrderDto.description,
                                                initPrice: createPurchaseOrderDto.initPrice,
                                                startCord: drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"])), createPurchaseOrderDto.startCordLongitude, createPurchaseOrderDto.startCordLatitude),
                                                endCord: drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"])), createPurchaseOrderDto.endCordLongitude, createPurchaseOrderDto.endCordLatitude),
                                                startAddress: createPurchaseOrderDto.startAddress,
                                                endAddress: createPurchaseOrderDto.endAddress,
                                                startAfter: new Date(createPurchaseOrderDto.startAfter),
                                                endedAt: new Date(createPurchaseOrderDto.endedAt),
                                                isUrgent: createPurchaseOrderDto.isUrgent,
                                                autoAccept: createPurchaseOrderDto.autoAccept
                                            }).returning({
                                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                                status: purchaseOrder_schema_1.PurchaseOrderTable.status
                                            })];
                                    case 2:
                                        responseOfCreatingPurchaseOrder = _a.sent();
                                        return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0) }, responseOfCreatingPurchaseOrder[0])]];
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
    // for specifying the details of the other purchaseOrders
    PurchaseOrderService.prototype.getPurchaseOrderById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query.PurchaseOrderTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id)),
                            columns: {
                                id: true,
                                initPrice: true,
                                description: true,
                                startCord: true,
                                endCord: true,
                                startAddress: true,
                                endAddress: true,
                                startAfter: true,
                                endedAt: true,
                                isUrgent: true,
                                status: true,
                                autoAccept: true,
                                createdAt: true,
                                updatedAt: true
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
                                                avatorUrl: true
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
    PurchaseOrderService.prototype.searchPurchaseOrdersByCreatorId = function (creatorId, limit, offset, isAutoAccept) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                            status: purchaseOrder_schema_1.PurchaseOrderTable.status
                        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined))).orderBy(drizzle_orm_1.desc(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchPaginationPurchaseOrders = function (creatorName, limit, offset, isAutoAccept) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                creatorName: passenger_schema_1.PassengerTable.userName,
                                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                                initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                                startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                                endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                                startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                                endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                                createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                                updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                                status: purchaseOrder_schema_1.PurchaseOrderTable.status
                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                                .orderBy(drizzle_orm_1.desc(purchaseOrder_schema_1.PurchaseOrderTable.updatedAt))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchAboutToStartPurchaseOrders = function (creatorName, limit, offset, isAutoAccept) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                creatorName: passenger_schema_1.PassengerTable.userName,
                                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                                initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                                startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                                endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                                startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                                endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                                createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                                updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                                status: purchaseOrder_schema_1.PurchaseOrderTable.status
                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                                .orderBy(drizzle_orm_1.asc(purchaseOrder_schema_1.PurchaseOrderTable.startAfter))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchSimliarTimePurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarTimePurchaseOrderDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                creatorName: passenger_schema_1.PassengerTable.userName,
                                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                                initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                                startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                                endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                                startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                                endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                                createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                                updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                                status: purchaseOrder_schema_1.PurchaseOrderTable.status
                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n              ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n              ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"])), purchaseOrder_schema_1.PurchaseOrderTable.startAfter, getSimilarTimePurchaseOrderDto.startAfter, purchaseOrder_schema_1.PurchaseOrderTable.endedAt, getSimilarTimePurchaseOrderDto.endedAt)).limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchCurAdjacentPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                creatorName: passenger_schema_1.PassengerTable.userName,
                                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                                initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                                startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                                endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                                startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                                endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                                createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                                updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                                status: purchaseOrder_schema_1.PurchaseOrderTable.status,
                                manhattanDistance: drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"], ["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getAdjacentPurchaseOrdersDto.cordLongitude, getAdjacentPurchaseOrdersDto.cordLatitude)
                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"], ["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getAdjacentPurchaseOrdersDto.cordLongitude, getAdjacentPurchaseOrdersDto.cordLatitude))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchDestAdjacentPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                            creatorName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                            createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                            updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                            isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                            autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                            status: purchaseOrder_schema_1.PurchaseOrderTable.status,
                            manhattanDistance: drizzle_orm_1.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"], ["ST_Distance(\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, getAdjacentPurchaseOrdersDto.cordLongitude, getAdjacentPurchaseOrdersDto.cordLatitude)
                        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                            .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                            .orderBy(drizzle_orm_1.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"], ["ST_Distance(\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n        )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, getAdjacentPurchaseOrdersDto.cordLongitude, getAdjacentPurchaseOrdersDto.cordLatitude))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.searchSimilarRoutePurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarRoutePurchaseOrdersDto) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.select({
                                id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                creatorName: passenger_schema_1.PassengerTable.userName,
                                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                                initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                                startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                                endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                                startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                                endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                                createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                                updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept,
                                status: purchaseOrder_schema_1.PurchaseOrderTable.status,
                                RDV: drizzle_orm_1.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n      "], ["\n          ST_Distance(\n            ", ",\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n          ) \n        + ST_Distance(\n            ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n            ", "\n          ) \n        - ST_Distance(\n            ", ",\n            ", "\n          )\n      "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getSimilarRoutePurchaseOrdersDto.startCordLongitude, getSimilarRoutePurchaseOrdersDto.startCordLatitude, getSimilarRoutePurchaseOrdersDto.startCordLongitude, getSimilarRoutePurchaseOrdersDto.startCordLatitude, getSimilarRoutePurchaseOrdersDto.endCordLongitude, getSimilarRoutePurchaseOrdersDto.endCordLatitude, getSimilarRoutePurchaseOrdersDto.endCordLongitude, getSimilarRoutePurchaseOrdersDto.endCordLatitude, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord)
                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined)))).leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))
                                .orderBy(drizzle_orm_1.sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n            ST_Distance(\n              ", ",\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n              ", "\n            ) \n          - ST_Distance(\n              ", ",\n              ", "\n            )\n        "], ["\n            ST_Distance(\n              ", ",\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n              ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n              ", "\n            ) \n          - ST_Distance(\n              ", ",\n              ", "\n            )\n        "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getSimilarRoutePurchaseOrdersDto.startCordLongitude, getSimilarRoutePurchaseOrdersDto.startCordLatitude, getSimilarRoutePurchaseOrdersDto.startCordLongitude, getSimilarRoutePurchaseOrdersDto.startCordLatitude, getSimilarRoutePurchaseOrdersDto.endCordLongitude, getSimilarRoutePurchaseOrdersDto.endCordLatitude, getSimilarRoutePurchaseOrdersDto.endCordLongitude, getSimilarRoutePurchaseOrdersDto.endCordLatitude, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord))
                                .limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Search operations ================= */
    /* ================= Powerful Search operations ================= */
    PurchaseOrderService.prototype.searchBetterFirstPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getBetterPurchaseOrderDto, searchPriorities) {
        if (creatorName === void 0) { creatorName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var timeQuery, routeQuery, startQuery, destQuery, updatedAtQuery, aboutToStartQuery, spaceResponseField, timeResponseField, sortMap, searchQueries;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined, aboutToStartQuery = undefined;
                        spaceResponseField = {};
                        timeResponseField = {};
                        if (getBetterPurchaseOrderDto.startAfter || getBetterPurchaseOrderDto.endedAt) {
                            timeQuery = drizzle_orm_1.sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["(\n            ", "\n            ", "\n            ", "\n          ) ASC"], ["(\n            ",
                                "\n            ", "\n            ",
                                "\n          ) ASC"])), getBetterPurchaseOrderDto.startAfter ? drizzle_orm_1.sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"], ["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"])), purchaseOrder_schema_1.PurchaseOrderTable.startAfter, getBetterPurchaseOrderDto.startAfter) : drizzle_orm_1.sql(templateObject_11 || (templateObject_11 = __makeTemplateObject([""], [""]))), getBetterPurchaseOrderDto.startAfter && getBetterPurchaseOrderDto.endedAt ? drizzle_orm_1.sql(templateObject_12 || (templateObject_12 = __makeTemplateObject([" + "], [" + "]))) : drizzle_orm_1.sql(templateObject_13 || (templateObject_13 = __makeTemplateObject([""], [""]))), getBetterPurchaseOrderDto.endedAt ? drizzle_orm_1.sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"], ["ABS(EXTRACT(EPOCH FROM (", " - ", ")))"])), purchaseOrder_schema_1.PurchaseOrderTable.endedAt, getBetterPurchaseOrderDto.endedAt) : drizzle_orm_1.sql(templateObject_15 || (templateObject_15 = __makeTemplateObject([""], [""]))));
                            timeResponseField = { timeDiff: timeQuery };
                        }
                        if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude
                            && getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude) {
                            routeQuery = drizzle_orm_1.sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                ", "\n            ) \n          - ST_Distance(\n                ", ",\n                ", "\n            )\n          ) ASC"], ["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            ) \n          + ST_Distance(\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326),\n                ", "\n            ) \n          - ST_Distance(\n                ", ",\n                ", "\n            )\n          ) ASC"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getBetterPurchaseOrderDto.startCordLongitude, getBetterPurchaseOrderDto.startCordLatitude, getBetterPurchaseOrderDto.startCordLongitude, getBetterPurchaseOrderDto.startCordLatitude, getBetterPurchaseOrderDto.endCordLongitude, getBetterPurchaseOrderDto.endCordLatitude, getBetterPurchaseOrderDto.endCordLongitude, getBetterPurchaseOrderDto.endCordLatitude, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord);
                            spaceResponseField = { RDV: routeQuery };
                        }
                        if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude) {
                            startQuery = drizzle_orm_1.sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            )\n          ) ASC"], ["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            )\n          ) ASC"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, getBetterPurchaseOrderDto.startCordLongitude, getBetterPurchaseOrderDto.startCordLatitude);
                            spaceResponseField = __assign(__assign({}, spaceResponseField), { startManhattanDistance: startQuery });
                        }
                        if (getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude) {
                            destQuery = drizzle_orm_1.sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            )\n          ) ASC"], ["(\n            ST_Distance(\n                ", ",\n                ST_SetSRID(ST_MakePoint(", ", ", "), 4326)\n            )\n          ) ASC"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, getBetterPurchaseOrderDto.endCordLongitude, getBetterPurchaseOrderDto.endCordLatitude);
                            spaceResponseField = __assign(__assign({}, spaceResponseField), { destManhattanDistance: destQuery });
                        }
                        updatedAtQuery = drizzle_orm_1.sql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), purchaseOrder_schema_1.PurchaseOrderTable.updatedAt);
                        aboutToStartQuery = drizzle_orm_1.sql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), purchaseOrder_schema_1.PurchaseOrderTable.startAfter);
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
                        return [4 /*yield*/, this.updateExpiredPurchaseOrders()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (_a = this.db.select(__assign(__assign({ id: purchaseOrder_schema_1.PurchaseOrderTable.id, creatorName: passenger_schema_1.PassengerTable.userName, avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl, initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice, startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord, endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord, startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress, endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress, createdAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt, updatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt, startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter, endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt, isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent, autoAccept: purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, status: purchaseOrder_schema_1.PurchaseOrderTable.status }, timeResponseField), spaceResponseField)).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (isAutoAccept ? drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true) : undefined), drizzle_orm_1.or((creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, creatorName + "%") : undefined), (creatorName ? drizzle_orm_1.like(passenger_schema_1.PassengerTable.email, creatorName + "%") : undefined))))
                                .leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, passengerInfo_schema_1.PassengerInfoTable.userId))).orderBy.apply(_a, searchQueries).limit(limit)
                                .offset(offset)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================================= Get operations ================================= */
    /* ================================= Update operations ================================= */
    PurchaseOrderService.prototype.updatePurchaseOrderById = function (id, // id of the order, for finding the specific order
    creatorId, // id of the passenger who want to update this order, for checking the validation
    updatePurchaseOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var newStartCord, newEndCord, responseOfSelectingConflictPurchaseOrders, _a, startAfter, endedAt, tempResponse, _b, startAfter, endedAt, tempResponse, _c, startAfter, endedAt, responseOfUpdatingPurchaseOrder;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        newStartCord = (updatePurchaseOrderDto.startCordLongitude !== undefined
                                            && updatePurchaseOrderDto.startCordLatitude !== undefined)
                                            ? { x: updatePurchaseOrderDto.startCordLongitude, y: updatePurchaseOrderDto.startCordLatitude }
                                            : undefined;
                                        newEndCord = (updatePurchaseOrderDto.endCordLongitude !== undefined
                                            && updatePurchaseOrderDto.endCordLatitude !== undefined)
                                            ? { x: updatePurchaseOrderDto.endCordLongitude, y: updatePurchaseOrderDto.endCordLatitude }
                                            : undefined;
                                        responseOfSelectingConflictPurchaseOrders = undefined;
                                        if (!(updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt)) return [3 /*break*/, 2];
                                        _a = [new Date(updatePurchaseOrderDto.startAfter), new Date(updatePurchaseOrderDto.endedAt)], startAfter = _a[0], endedAt = _a[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: purchaseOrder_schema_1.PurchaseOrderTable.id
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt)))))];
                                    case 1:
                                        responseOfSelectingConflictPurchaseOrders = _d.sent();
                                        return [3 /*break*/, 8];
                                    case 2:
                                        if (!(updatePurchaseOrderDto.startAfter && !updatePurchaseOrderDto.endedAt)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.select({
                                                endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED")))];
                                    case 3:
                                        tempResponse = _d.sent();
                                        if (!tempResponse || tempResponse.length === 0)
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        _b = [new Date(updatePurchaseOrderDto.startAfter), new Date(tempResponse[0].endedAt)], startAfter = _b[0], endedAt = _b[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: purchaseOrder_schema_1.PurchaseOrderTable.id
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.lte(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter)))))];
                                    case 4:
                                        responseOfSelectingConflictPurchaseOrders = _d.sent();
                                        return [3 /*break*/, 8];
                                    case 5:
                                        if (!(!updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.select({
                                                startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED")))];
                                    case 6:
                                        tempResponse = _d.sent();
                                        if (!tempResponse || tempResponse.length === 0)
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        _c = [new Date(tempResponse[0].startAfter), new Date(updatePurchaseOrderDto.endedAt)], startAfter = _c[0], endedAt = _c[1];
                                        if (startAfter >= endedAt)
                                            throw exceptions_1.ClientEndBeforeStartException;
                                        return [4 /*yield*/, tx.select({
                                                id: purchaseOrder_schema_1.PurchaseOrderTable.id
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.not(drizzle_orm_1.gte(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt)))))];
                                    case 7:
                                        responseOfSelectingConflictPurchaseOrders = _d.sent();
                                        _d.label = 8;
                                    case 8: return [4 /*yield*/, tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set(__assign(__assign(__assign(__assign(__assign(__assign({ description: updatePurchaseOrderDto.description, initPrice: updatePurchaseOrderDto.initPrice }, (newStartCord
                                            ? { startCord: drizzle_orm_1.sql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newStartCord.x, newStartCord.y) }
                                            : {})), (newEndCord
                                            ? { endCord: drizzle_orm_1.sql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newEndCord.x, newEndCord.y) }
                                            : {})), { startAddress: updatePurchaseOrderDto.startAddress, endAddress: updatePurchaseOrderDto.endAddress }), (updatePurchaseOrderDto.startAfter
                                            ? { startAfter: new Date(updatePurchaseOrderDto.startAfter) }
                                            : {})), (updatePurchaseOrderDto.endedAt
                                            ? { endedAt: new Date(updatePurchaseOrderDto.endedAt) }
                                            : {})), { isUrgent: updatePurchaseOrderDto.isUrgent, autoAccept: updatePurchaseOrderDto.autoAccept, status: updatePurchaseOrderDto.status, updatedAt: new Date() })).where(drizzle_orm_1.and(drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "RESERVED"), (updatePurchaseOrderDto.startAfter || updatePurchaseOrderDto.endedAt
                                            ? undefined
                                            : drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "EXPIRED")), // if the user don't update startAfter or endedAt in this time, 
                                        // then we add the constrant of excluding the "EXPIRED" purchaseOrder
                                        drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
                                            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                            status: purchaseOrder_schema_1.PurchaseOrderTable.status
                                        })];
                                    case 9:
                                        responseOfUpdatingPurchaseOrder = _d.sent();
                                        return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0) }, responseOfUpdatingPurchaseOrder[0])]];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
    PurchaseOrderService.prototype.startPurchaseOrderWithoutInvite = function (id, userId, userName, acceptAutoAcceptPurchaseOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var purchaseOrder, responseOfRejectingOtherRidderInvites, responseOfCreatingNotificationToRejectOters, responseOfDeletingPurchaseOrder, responseOfCreatingOrder, responseOfCreatingNotification;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            passengerName: passenger_schema_1.PassengerTable.userName
                                        }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                            .where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id))
                                            .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))];
                                    case 1:
                                        purchaseOrder = _a.sent();
                                        if (!purchaseOrder || purchaseOrder.length === 0) {
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                                                status: "REJECTED",
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.orderId, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                                                id: ridderInvite_schema_1.RidderInviteTable.id,
                                                userId: ridderInvite_schema_1.RidderInviteTable.userId
                                            })];
                                    case 2:
                                        responseOfRejectingOtherRidderInvites = _a.sent();
                                        if (!(responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfRejectingOtherRidderInvites.map(function (content) {
                                                return notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite(purchaseOrder[0].passengerName, purchaseOrder[0].passengerName + "'s order purchase order has started directly by some other ridder", content.userId, content.id);
                                            }))];
                                    case 3:
                                        responseOfCreatingNotificationToRejectOters = _a.sent();
                                        if (!responseOfCreatingNotificationToRejectOters
                                            || responseOfCreatingNotificationToRejectOters.length !== responseOfRejectingOtherRidderInvites.length) {
                                            throw exceptions_1.ClientCreateRidderNotificationException;
                                        }
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                                            status: "RESERVED",
                                            updatedAt: new Date()
                                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.autoAccept, true))).returning()];
                                    case 5:
                                        responseOfDeletingPurchaseOrder = _a.sent();
                                        if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.insert(order_schema_1.OrderTable).values({
                                                ridderId: userId,
                                                passengerId: responseOfDeletingPurchaseOrder[0].creatorId,
                                                prevOrderId: "PurchaseOrder" + " " + responseOfDeletingPurchaseOrder[0].id,
                                                finalPrice: responseOfDeletingPurchaseOrder[0].initPrice,
                                                passengerDescription: responseOfDeletingPurchaseOrder[0].description,
                                                ridderDescription: acceptAutoAcceptPurchaseOrderDto.description,
                                                finalStartCord: drizzle_orm_1.sql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDeletingPurchaseOrder[0].startCord.x, responseOfDeletingPurchaseOrder[0].startCord.y),
                                                finalEndCord: drizzle_orm_1.sql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDeletingPurchaseOrder[0].endCord.x, responseOfDeletingPurchaseOrder[0].endCord.y),
                                                finalStartAddress: responseOfDeletingPurchaseOrder[0].startAddress,
                                                finalEndAddress: responseOfDeletingPurchaseOrder[0].endAddress,
                                                startAfter: responseOfDeletingPurchaseOrder[0].startAfter,
                                                endedAt: responseOfDeletingPurchaseOrder[0].endedAt
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
                                        return [4 /*yield*/, this.passengerNotification.createPassengerNotificationByUserId(notificationTemplate_1.NotificationTemplateOfDirectlyStartOrder(userName, responseOfDeletingPurchaseOrder[0].creatorId, responseOfCreatingOrder[0].id))];
                                    case 7:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreatePassengerNotificationException;
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
    /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
    /* ================================= Update operations ================================= */
    /* ================================= Delete operations ================================= */
    PurchaseOrderService.prototype.cancelPurchaseOrderById = function (id, creatorId, creatorName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfCancelingPurchaseOrder, responseOfCancelingRidderInvite, responseOfCreatingNotification;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                                            status: "CANCEL"
                                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"))).returning({
                                            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                                            stauts: purchaseOrder_schema_1.PurchaseOrderTable.status
                                        })];
                                    case 1:
                                        responseOfCancelingPurchaseOrder = _a.sent();
                                        if (!responseOfCancelingPurchaseOrder || responseOfCancelingPurchaseOrder.length === 0) {
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                                                status: "CANCEL"
                                            }).where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.orderId, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                                                id: ridderInvite_schema_1.RidderInviteTable.id,
                                                ridderId: ridderInvite_schema_1.RidderInviteTable.userId
                                            })];
                                    case 2:
                                        responseOfCancelingRidderInvite = _a.sent();
                                        if (!responseOfCancelingRidderInvite || responseOfCancelingRidderInvite.length === 0) {
                                            throw exceptions_1.ClientInviteNotFoundException;
                                        }
                                        return [4 /*yield*/, this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfCancelingRidderInvite.map(function (content) {
                                                return notificationTemplate_1.NotificationTemplateOfCancelingPurchaseOrder(creatorName, content.ridderId, responseOfCancelingPurchaseOrder[0].id);
                                            }))];
                                    case 3:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreateRidderNotificationException;
                                        }
                                        return [2 /*return*/, responseOfCancelingPurchaseOrder];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService.prototype.deletePurchaseOrderById = function (id, creatorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db["delete"](purchaseOrder_schema_1.PurchaseOrderTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.ne(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, creatorId))).returning({
                            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                            status: purchaseOrder_schema_1.PurchaseOrderTable.status
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PurchaseOrderService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], PurchaseOrderService);
    return PurchaseOrderService;
}());
exports.PurchaseOrderService = PurchaseOrderService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
