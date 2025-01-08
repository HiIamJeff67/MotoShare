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
exports.RidderInviteService = void 0;
var common_1 = require("@nestjs/common");
var drizzle_module_1 = require("../drizzle/drizzle.module");
var ridderInvite_schema_1 = require("../drizzle/schema/ridderInvite.schema");
var drizzle_orm_1 = require("drizzle-orm");
var purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
var passenger_schema_1 = require("../drizzle/schema/passenger.schema");
var passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
var ridder_schema_1 = require("../drizzle/schema/ridder.schema");
var ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
var order_schema_1 = require("../drizzle/schema/order.schema");
var exceptions_1 = require("../exceptions");
var notificationTemplate_1 = require("../notification/notificationTemplate");
var RidderInviteService = /** @class */ (function () {
    function RidderInviteService(passengerNotification, ridderNotification, db) {
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    /* ================================= Detect And Update Expired RidderInvites operations ================================= */
    RidderInviteService.prototype.updateExpiredRidderInvites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
                            status: "CANCEL"
                        }).where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"), drizzle_orm_1.lt(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date()))).returning({
                            id: ridderInvite_schema_1.RidderInviteTable.id
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            throw exceptions_1.ServerNeonautoUpdateExpiredRidderInviteException;
                        }
                        return [2 /*return*/, response.length];
                }
            });
        });
    };
    /* ================================= Detect And Update Expired RidderInvites operations ================================= */
    /* ================================= Create operations ================================= */
    RidderInviteService.prototype.createRidderInviteByOrderId = function (inviterId, inviterName, orderId, createRidderInviteDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingConfictRidderInvites, responseOfSelectingPurchaseOrder, responseOfCreatingRidderInvite, responseOfCreatingNotification;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            id: ridderInvite_schema_1.RidderInviteTable.id
                                        }).from(ridderInvite_schema_1.RidderInviteTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.not(drizzle_orm_1.lte(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(createRidderInviteDto.suggestStartAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(createRidderInviteDto.suggestEndedAt)))))];
                                    case 1:
                                        responseOfSelectingConfictRidderInvites = _a.sent();
                                        return [4 /*yield*/, tx.select({
                                                passengerId: passenger_schema_1.PassengerTable.id,
                                                status: purchaseOrder_schema_1.PurchaseOrderTable.status
                                            }).from(purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, orderId))
                                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))];
                                    case 2:
                                        responseOfSelectingPurchaseOrder = _a.sent();
                                        if (!responseOfSelectingPurchaseOrder || responseOfSelectingPurchaseOrder.length === 0
                                            || responseOfSelectingPurchaseOrder[0].status !== "POSTED") {
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        }
                                        return [4 /*yield*/, tx.insert(ridderInvite_schema_1.RidderInviteTable).values({
                                                userId: inviterId,
                                                orderId: orderId,
                                                briefDescription: createRidderInviteDto.briefDescription,
                                                suggestPrice: createRidderInviteDto.suggestPrice,
                                                startCord: drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"])), createRidderInviteDto.startCordLongitude, createRidderInviteDto.startCordLatitude),
                                                endCord: drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"], ["ST_SetSRID(\n          ST_MakePoint(", ", ", "),\n          4326\n        )"])), createRidderInviteDto.endCordLongitude, createRidderInviteDto.endCordLatitude),
                                                startAddress: createRidderInviteDto.startAddress,
                                                endAddress: createRidderInviteDto.endAddress,
                                                suggestStartAfter: new Date(createRidderInviteDto.suggestStartAfter),
                                                suggestEndedAt: new Date(createRidderInviteDto.suggestEndedAt)
                                            }).returning({
                                                id: ridderInvite_schema_1.RidderInviteTable.id,
                                                orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                                                createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                                                status: ridderInvite_schema_1.RidderInviteTable.status
                                            })];
                                    case 3:
                                        responseOfCreatingRidderInvite = _a.sent();
                                        if (!responseOfCreatingRidderInvite || responseOfCreatingRidderInvite.length === 0) {
                                            throw exceptions_1.ClientCreateRidderInviteException;
                                        }
                                        return [4 /*yield*/, this.passengerNotification.createPassengerNotificationByUserId(notificationTemplate_1.NotificationTemplateOfCreatingRidderInvite(inviterName, responseOfSelectingPurchaseOrder[0].passengerId, responseOfCreatingRidderInvite[0].id))];
                                    case 4:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreatePassengerNotificationException;
                                        }
                                        return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0) }, responseOfCreatingRidderInvite[0])]];
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
    // for specifying the details of the other invites
    RidderInviteService.prototype.getRidderInviteById = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            inviteBriefDescription: ridderInvite_schema_1.RidderInviteTable.briefDescription,
                            suggestStartCord: ridderInvite_schema_1.RidderInviteTable.startCord,
                            suggestEndCord: ridderInvite_schema_1.RidderInviteTable.endCord,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            inviteCreatedAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            inviteUdpatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            inviteStatus: ridderInvite_schema_1.RidderInviteTable.status,
                            initPrice: purchaseOrder_schema_1.PurchaseOrderTable.initPrice,
                            startCord: purchaseOrder_schema_1.PurchaseOrderTable.startCord,
                            endCord: purchaseOrder_schema_1.PurchaseOrderTable.endCord,
                            startAddress: purchaseOrder_schema_1.PurchaseOrderTable.startAddress,
                            endAddress: purchaseOrder_schema_1.PurchaseOrderTable.endAddress,
                            description: purchaseOrder_schema_1.PurchaseOrderTable.description,
                            startAfter: purchaseOrder_schema_1.PurchaseOrderTable.startAfter,
                            endedAt: purchaseOrder_schema_1.PurchaseOrderTable.endedAt,
                            orderCreatedAt: purchaseOrder_schema_1.PurchaseOrderTable.createdAt,
                            orderUpdatedAt: purchaseOrder_schema_1.PurchaseOrderTable.updatedAt,
                            creatorName: passenger_schema_1.PassengerTable.userName,
                            isOnline: passengerInfo_schema_1.PassengerInfoTable.isOnline,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            phoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder_schema_1.PurchaseOrderTable.id))
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id), drizzle_orm_1.or(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, userId), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, userId))))
                            .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                            .leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Search RidderInvite operations used by Ridder ================= */
    RidderInviteService.prototype.searchPaginationRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else { // specify before join -> faster
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.desc(ridderInvite_schema_1.RidderInviteTable.updatedAt))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchAboutToStartRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else { // specify before join -> faster
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.asc(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchSimilarTimeRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, purchaseOrder_schema_1.PurchaseOrderTable.startAfter, ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, purchaseOrder_schema_1.PurchaseOrderTable.endedAt)).limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchCurAdjacentRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            distance: drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["ST_Distance(\n            ", ",\n            ", "\n          )"], ["ST_Distance(\n            ", ",\n            ", "\n          )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchDestAdjacentRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            distance: drizzle_orm_1.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["ST_Distance(\n            ", ",\n            ", "\n          )"], ["ST_Distance(\n            ", ",\n            ", "\n          )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchSimilarRouteRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            receiverName: passenger_schema_1.PassengerTable.userName,
                            avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            RDV: drizzle_orm_1.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "], ["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, receiverName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n            ST_Distance(\n              ", ",\n              ", "\n          )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          - ST_Distance(\n              ", ",\n              ", "\n            )\n          "], ["\n            ST_Distance(\n              ", ",\n              ", "\n          )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          - ST_Distance(\n              ", ",\n              ", "\n            )\n          "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    RidderInviteService.prototype.searchBetterFirstRidderInvitesByInviterId = function (inviterId, receiverName, limit, offset, searchPriorities) {
        if (receiverName === void 0) { receiverName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var timeQuery, aboutToStartQuery, routeQuery, startQuery, destQuery, updatedAtQuery, spaceResponseField, sortMap, searchQueries, query;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
                        spaceResponseField = {};
                        timeQuery = drizzle_orm_1.sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                      ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                      ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, purchaseOrder_schema_1.PurchaseOrderTable.startAfter, ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, purchaseOrder_schema_1.PurchaseOrderTable.endedAt);
                        aboutToStartQuery = drizzle_orm_1.sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter);
                        startQuery = drizzle_orm_1.sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord);
                        destQuery = drizzle_orm_1.sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord);
                        routeQuery = drizzle_orm_1.sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "], ["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord);
                        updatedAtQuery = drizzle_orm_1.sql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), ridderInvite_schema_1.RidderInviteTable.updatedAt);
                        spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };
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
                        return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _b.sent();
                        query = this.db.select(__assign({ id: ridderInvite_schema_1.RidderInviteTable.id, orderId: ridderInvite_schema_1.RidderInviteTable.orderId, suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress, suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress, receiverName: ridder_schema_1.RidderTable.userName, avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl, suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice, suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, suggesEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt, updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt }, spaceResponseField)).from(ridderInvite_schema_1.RidderInviteTable);
                        if (receiverName) {
                            query.leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, receiverName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId))
                                .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, purchaseOrder_schema_1.PurchaseOrderTable.creatorId));
                        }
                        (_a = query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))).orderBy.apply(_a, searchQueries).limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================= Search RidderInvite operations used by Ridders ================= */
    /* ================= Search RidderInvite operations used by Passengers ================= */
    RidderInviteService.prototype.searchPaginationRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.desc(ridderInvite_schema_1.RidderInviteTable.updatedAt))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchAboutToStartRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.asc(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchSimilarTimeRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, purchaseOrder_schema_1.PurchaseOrderTable.startAfter, ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, purchaseOrder_schema_1.PurchaseOrderTable.endedAt)).limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchCurAdjacentRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            manhattanDistance: drizzle_orm_1.sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["ST_Distance(\n            ", ",\n            ", "\n          )"], ["ST_Distance(\n            ", ",\n            ", "\n          )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchDestAdjacentRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            manhattanDistance: drizzle_orm_1.sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["ST_Distance(\n        ", ",\n        ", "\n      )"], ["ST_Distance(\n        ", ",\n        ", "\n      )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["ST_Distance(\n            ", ",\n            ", "\n          )"], ["ST_Distance(\n            ", ",\n            ", "\n          )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService.prototype.searchSimilarRouteRidderInvitesByReceverId = function (receiverId, inviterName, limit, offset) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _a.sent();
                        query = this.db.select({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            orderId: ridderInvite_schema_1.RidderInviteTable.orderId,
                            suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                            suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                            inviterName: ridder_schema_1.RidderTable.userName,
                            avatorUrl: ridderInfo_schema_1.RidderInfoTable.avatorUrl,
                            suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                            createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt,
                            updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt,
                            status: ridderInvite_schema_1.RidderInviteTable.status,
                            RDV: drizzle_orm_1.sql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "], ["\n        ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      + ST_Distance(\n          ", ",\n          ", "\n        )\n      - ST_Distance(\n          ", ",\n          ", "\n        )\n      "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord)
                        }).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(ridder_schema_1.RidderTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(ridder_schema_1.RidderTable, drizzle_orm_1.eq(ridder_schema_1.RidderTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        query.leftJoin(ridderInfo_schema_1.RidderInfoTable, drizzle_orm_1.eq(ridderInfo_schema_1.RidderInfoTable.userId, ridder_schema_1.RidderTable.id))
                            .orderBy(drizzle_orm_1.sql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n            ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          - ST_Distance(\n              ", ",\n              ", "\n            )\n          "], ["\n            ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          + ST_Distance(\n              ", ",\n              ", "\n            )\n          - ST_Distance(\n              ", ",\n              ", "\n            )\n          "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord))
                            .limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    RidderInviteService.prototype.searchBetterFirstRidderInvitesByReceiverId = function (receiverId, inviterName, limit, offset, searchPriorities) {
        if (inviterName === void 0) { inviterName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var timeQuery, aboutToStartQuery, routeQuery, startQuery, destQuery, updatedAtQuery, spaceResponseField, sortMap, searchQueries, query;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeQuery = undefined, aboutToStartQuery = undefined, routeQuery = undefined, startQuery = undefined, destQuery = undefined, updatedAtQuery = undefined;
                        spaceResponseField = {};
                        timeQuery = drizzle_orm_1.sql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                    ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"], ["ABS(EXTRACT(EPOCH FROM (", " - ", "))) +\n                    ABS(EXTRACT(EPOCH FROM (", " - ", "))) ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, purchaseOrder_schema_1.PurchaseOrderTable.startAfter, ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, purchaseOrder_schema_1.PurchaseOrderTable.endedAt);
                        aboutToStartQuery = drizzle_orm_1.sql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), ridderInvite_schema_1.RidderInviteTable.suggestStartAfter);
                        startQuery = drizzle_orm_1.sql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["ST_Distance(\n      ", ",\n      ", "\n    )"], ["ST_Distance(\n      ", ",\n      ", "\n    )"])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord);
                        destQuery = drizzle_orm_1.sql(templateObject_26 || (templateObject_26 = __makeTemplateObject(["ST_Distance(\n      ", ",\n      ", "\n    )"], ["ST_Distance(\n      ", ",\n      ", "\n    )"])), purchaseOrder_schema_1.PurchaseOrderTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord);
                        routeQuery = drizzle_orm_1.sql(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n      ST_Distance(\n        ", ",\n        ", "\n      )\n    + ST_Distance(\n        ", ",\n        ", "\n      )\n    + ST_Distance(\n        ", ",\n        ", "\n      )\n    - ST_Distance(\n        ", ",\n        ", "\n      )\n    "], ["\n      ST_Distance(\n        ", ",\n        ", "\n      )\n    + ST_Distance(\n        ", ",\n        ", "\n      )\n    + ST_Distance(\n        ", ",\n        ", "\n      )\n    - ST_Distance(\n        ", ",\n        ", "\n      )\n    "])), purchaseOrder_schema_1.PurchaseOrderTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.startCord, ridderInvite_schema_1.RidderInviteTable.endCord, ridderInvite_schema_1.RidderInviteTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord, purchaseOrder_schema_1.PurchaseOrderTable.startCord, purchaseOrder_schema_1.PurchaseOrderTable.endCord);
                        updatedAtQuery = drizzle_orm_1.sql(templateObject_28 || (templateObject_28 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), ridderInvite_schema_1.RidderInviteTable.updatedAt);
                        spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };
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
                        return [4 /*yield*/, this.updateExpiredRidderInvites()];
                    case 1:
                        _b.sent();
                        query = this.db.select(__assign({ id: ridderInvite_schema_1.RidderInviteTable.id, orderId: ridderInvite_schema_1.RidderInviteTable.orderId, suggestStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress, suggestEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress, inviterName: passenger_schema_1.PassengerTable.userName, avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl, suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice, suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, suggesEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, createdAt: ridderInvite_schema_1.RidderInviteTable.createdAt, updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt, status: ridderInvite_schema_1.RidderInviteTable.status }, spaceResponseField)).from(ridderInvite_schema_1.RidderInviteTable)
                            .leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite_schema_1.RidderInviteTable.orderId));
                        if (inviterName) {
                            query.leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, ridderInvite_schema_1.RidderInviteTable.userId))
                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId), drizzle_orm_1.like(passenger_schema_1.PassengerTable.userName, inviterName + "%")));
                        }
                        else {
                            query.where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, receiverId))
                                .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(passenger_schema_1.PassengerTable.id, ridderInvite_schema_1.RidderInviteTable.userId));
                        }
                        (_a = query.leftJoin(passengerInfo_schema_1.PassengerInfoTable, drizzle_orm_1.eq(passengerInfo_schema_1.PassengerInfoTable.userId, passenger_schema_1.PassengerTable.id))).orderBy.apply(_a, searchQueries).limit(limit)
                            .offset(offset);
                        return [4 /*yield*/, query];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================= Search RidderInvite operations used by Passengers ================= */
    /* ================================= Get operations ================================= */
    /* ================================= Update operations ================================= */
    /* ================= Update detail operations used by Ridder ================= */
    RidderInviteService.prototype.updateRidderInviteById = function (id, inviterId, // for validating the current user is the owner to that invite
    inviterName, updateRidderInviteDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var newStartCord, newEndCord, ridderInvite, responseOfSelectingConfictRidderInvites, _a, startAfter, endedAt, _b, startAfter, endedAt, _c, startAfter, endedAt, responseOfUpdatingRidderInvite, responseOfCreatingNotification;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    newStartCord = (updateRidderInviteDto.startCordLongitude !== undefined
                                        && updateRidderInviteDto.startCordLatitude !== undefined)
                                        ? { x: updateRidderInviteDto.startCordLongitude, y: updateRidderInviteDto.startCordLatitude }
                                        : undefined;
                                    newEndCord = (updateRidderInviteDto.endCordLongitude !== undefined
                                        && updateRidderInviteDto.endCordLatitude !== undefined)
                                        ? { x: updateRidderInviteDto.endCordLongitude, y: updateRidderInviteDto.endCordLatitude }
                                        : undefined;
                                    return [4 /*yield*/, tx.select({
                                            passengerId: passenger_schema_1.PassengerTable.id,
                                            suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                                            suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt
                                        }).from(ridderInvite_schema_1.RidderInviteTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).leftJoin(purchaseOrder_schema_1.PurchaseOrderTable, drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.orderId, purchaseOrder_schema_1.PurchaseOrderTable.id))
                                            .leftJoin(passenger_schema_1.PassengerTable, drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.creatorId, passenger_schema_1.PassengerTable.id))];
                                case 1:
                                    ridderInvite = _d.sent();
                                    if (!ridderInvite || ridderInvite.length === 0)
                                        throw exceptions_1.ClientInviteNotFoundException;
                                    responseOfSelectingConfictRidderInvites = undefined;
                                    if (!(updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt)) return [3 /*break*/, 3];
                                    _a = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)], startAfter = _a[0], endedAt = _a[1];
                                    if (startAfter >= endedAt)
                                        throw exceptions_1.ClientEndBeforeStartException;
                                    return [4 /*yield*/, tx.select({
                                            id: ridderInvite_schema_1.RidderInviteTable.id
                                        }).from(ridderInvite_schema_1.RidderInviteTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.not(drizzle_orm_1.lte(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter))), drizzle_orm_1.not(drizzle_orm_1.gte(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt)))))];
                                case 2:
                                    responseOfSelectingConfictRidderInvites = _d.sent();
                                    return [3 /*break*/, 7];
                                case 3:
                                    if (!(updateRidderInviteDto.suggestStartAfter && !updateRidderInviteDto.suggestEndedAt)) return [3 /*break*/, 5];
                                    _b = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(ridderInvite[0].suggestEndedAt)], startAfter = _b[0], endedAt = _b[1];
                                    if (startAfter >= endedAt)
                                        throw exceptions_1.ClientEndBeforeStartException;
                                    return [4 /*yield*/, tx.select({
                                            id: ridderInvite_schema_1.RidderInviteTable.id
                                        }).from(ridderInvite_schema_1.RidderInviteTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.not(drizzle_orm_1.lte(ridderInvite_schema_1.RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter)))))];
                                case 4:
                                    responseOfSelectingConfictRidderInvites = _d.sent();
                                    return [3 /*break*/, 7];
                                case 5:
                                    if (!(!updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt)) return [3 /*break*/, 7];
                                    _c = [new Date(ridderInvite[0].suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)], startAfter = _c[0], endedAt = _c[1];
                                    if (startAfter >= endedAt)
                                        throw exceptions_1.ClientEndBeforeStartException;
                                    return [4 /*yield*/, tx.select({
                                            id: ridderInvite_schema_1.RidderInviteTable.id
                                        }).from(ridderInvite_schema_1.RidderInviteTable)
                                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.not(drizzle_orm_1.gte(ridderInvite_schema_1.RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt)))))];
                                case 6:
                                    responseOfSelectingConfictRidderInvites = _d.sent();
                                    _d.label = 7;
                                case 7: return [4 /*yield*/, tx.update(ridderInvite_schema_1.RidderInviteTable).set(__assign(__assign(__assign(__assign(__assign(__assign({ briefDescription: updateRidderInviteDto.briefDescription, suggestPrice: updateRidderInviteDto.suggestPrice }, (newStartCord
                                        ? { startCord: drizzle_orm_1.sql(templateObject_29 || (templateObject_29 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newStartCord.x, newStartCord.y) }
                                        : {})), (newEndCord
                                        ? { endCord: drizzle_orm_1.sql(templateObject_30 || (templateObject_30 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), newEndCord.x, newEndCord.y) }
                                        : {})), { startAddress: updateRidderInviteDto.startAddress, endAddress: updateRidderInviteDto.endAddress }), (updateRidderInviteDto.suggestStartAfter
                                        ? { suggestStartAfter: new Date(updateRidderInviteDto.suggestStartAfter) }
                                        : {})), (updateRidderInviteDto.suggestEndedAt
                                        ? { suggestEndedAt: new Date(updateRidderInviteDto.suggestEndedAt) }
                                        : {})), { updatedAt: new Date(), status: updateRidderInviteDto.status })).where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING"))).returning({
                                        id: ridderInvite_schema_1.RidderInviteTable.id,
                                        status: ridderInvite_schema_1.RidderInviteTable.status
                                    })];
                                case 8:
                                    responseOfUpdatingRidderInvite = _d.sent();
                                    if (!responseOfUpdatingRidderInvite || responseOfUpdatingRidderInvite.length === 0) {
                                        throw exceptions_1.ClientInviteNotFoundException;
                                    }
                                    return [4 /*yield*/, this.passengerNotification.createPassengerNotificationByUserId((updateRidderInviteDto.status && updateRidderInviteDto.status === "CANCEL")
                                            ? notificationTemplate_1.NotificationTemplateOfCancelingRidderInvite(inviterName, ridderInvite[0].passengerId, responseOfUpdatingRidderInvite[0].id)
                                            : notificationTemplate_1.NotificationTemplateOfUpdatingRidderInvite(inviterName, ridderInvite[0].passengerId, responseOfUpdatingRidderInvite[0].id))];
                                case 9:
                                    responseOfCreatingNotification = _d.sent();
                                    if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                        throw exceptions_1.ClientCreatePassengerNotificationException;
                                    }
                                    return [2 /*return*/, [__assign({ hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0) }, responseOfUpdatingRidderInvite[0])]];
                            }
                        });
                    }); })];
            });
        });
    };
    /* ================= Update detail operations used by Ridder ================= */
    /* ================= Accept or Reject operations used by Passenger ================= */
    RidderInviteService.prototype.decideRidderInviteById = function (id, receiverId, receiverName, decideRidderInviteDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var ridderInvite, responseOfRejectingRidderInvite, responseOfCreatingNotification;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.query.RidderInviteTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")),
                            "with": {
                                inviter: {
                                    columns: {
                                        id: true
                                    }
                                },
                                order: {
                                    columns: {
                                        id: true,
                                        creatorId: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        ridderInvite = _b.sent();
                        if (!ridderInvite || !ridderInvite.order)
                            throw exceptions_1.ClientInviteNotFoundException;
                        if (receiverId !== ((_a = ridderInvite === null || ridderInvite === void 0 ? void 0 : ridderInvite.order) === null || _a === void 0 ? void 0 : _a.creatorId))
                            throw exceptions_1.ClientUserHasNoAccessException;
                        if (!(decideRidderInviteDto.status === "ACCEPTED")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var responseOfDecidingRidderInvite, responseOfRejectingOtherRidderInvites, responseOfCreatingNotificationToRejectOthers, responseOfDeletingPurchaseOrder, responseOfCreatingOrder, responseOfCreatingNotification;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                                                status: decideRidderInviteDto.status,
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id))
                                                .returning({
                                                inviterId: ridderInvite_schema_1.RidderInviteTable.userId,
                                                inviterStartCord: ridderInvite_schema_1.RidderInviteTable.startCord,
                                                inviterEndCord: ridderInvite_schema_1.RidderInviteTable.endCord,
                                                inviterStartAddress: ridderInvite_schema_1.RidderInviteTable.startAddress,
                                                inviterEndAddress: ridderInvite_schema_1.RidderInviteTable.endAddress,
                                                suggestPrice: ridderInvite_schema_1.RidderInviteTable.suggestPrice,
                                                suggestStartAfter: ridderInvite_schema_1.RidderInviteTable.suggestStartAfter,
                                                suggestEndedAt: ridderInvite_schema_1.RidderInviteTable.suggestEndedAt,
                                                inviterDescription: ridderInvite_schema_1.RidderInviteTable.briefDescription,
                                                inviteStatus: ridderInvite_schema_1.RidderInviteTable.status
                                            })];
                                        case 1:
                                            responseOfDecidingRidderInvite = _a.sent();
                                            if (!responseOfDecidingRidderInvite || responseOfDecidingRidderInvite.length === 0) {
                                                throw exceptions_1.ClientInviteNotFoundException;
                                            }
                                            return [4 /*yield*/, tx.update(ridderInvite_schema_1.RidderInviteTable).set({
                                                    status: "REJECTED",
                                                    updatedAt: new Date()
                                                }).where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.orderId, ridderInvite.order.id), drizzle_orm_1.ne(ridderInvite_schema_1.RidderInviteTable.id, id))).returning({
                                                    id: ridderInvite_schema_1.RidderInviteTable.id,
                                                    userId: ridderInvite_schema_1.RidderInviteTable.userId
                                                })];
                                        case 2:
                                            responseOfRejectingOtherRidderInvites = _a.sent();
                                            if (!(responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfRejectingOtherRidderInvites.map(function (content) {
                                                    return notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite(receiverName, receiverName + " has found a better invite to start his/her travel", content.userId, content.id);
                                                }))];
                                        case 3:
                                            responseOfCreatingNotificationToRejectOthers = _a.sent();
                                            if (!responseOfCreatingNotificationToRejectOthers
                                                || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherRidderInvites.length) {
                                                throw exceptions_1.ClientCreateRidderNotificationException;
                                            }
                                            _a.label = 4;
                                        case 4: return [4 /*yield*/, tx.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
                                                status: "RESERVED",
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.and(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, ridderInvite.order.id), drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"))).returning({
                                                receiverId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
                                                isUrgent: purchaseOrder_schema_1.PurchaseOrderTable.isUrgent,
                                                receiverDescription: purchaseOrder_schema_1.PurchaseOrderTable.description,
                                                orderStatus: purchaseOrder_schema_1.PurchaseOrderTable.status
                                            })];
                                        case 5:
                                            responseOfDeletingPurchaseOrder = _a.sent();
                                            if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                                                throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                            }
                                            return [4 /*yield*/, tx.insert(order_schema_1.OrderTable).values({
                                                    ridderId: responseOfDecidingRidderInvite[0].inviterId,
                                                    passengerId: responseOfDeletingPurchaseOrder[0].receiverId,
                                                    prevOrderId: "PurchaseOrder" + " " + ridderInvite.order.id,
                                                    finalPrice: responseOfDecidingRidderInvite[0].suggestPrice,
                                                    passengerDescription: responseOfDeletingPurchaseOrder[0].receiverDescription,
                                                    ridderDescription: responseOfDecidingRidderInvite[0].inviterDescription,
                                                    finalStartCord: drizzle_orm_1.sql(templateObject_31 || (templateObject_31 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDecidingRidderInvite[0].inviterStartCord.x, responseOfDecidingRidderInvite[0].inviterStartCord.y),
                                                    finalEndCord: drizzle_orm_1.sql(templateObject_32 || (templateObject_32 = __makeTemplateObject(["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"], ["ST_SetSRID(ST_MakePoint(", ", ", "), 4326)"])), responseOfDecidingRidderInvite[0].inviterEndCord.x, responseOfDecidingRidderInvite[0].inviterEndCord.y),
                                                    finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                                                    finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
                                                    startAfter: responseOfDecidingRidderInvite[0].suggestStartAfter,
                                                    endedAt: responseOfDecidingRidderInvite[0].suggestEndedAt
                                                }).returning({
                                                    id: order_schema_1.OrderTable.id,
                                                    finalPrice: order_schema_1.OrderTable.finalPrice,
                                                    startAfter: order_schema_1.OrderTable.startAfter,
                                                    endedAt: order_schema_1.OrderTable.endedAt,
                                                    status: order_schema_1.OrderTable.passengerStatus
                                                })];
                                        case 6:
                                            responseOfCreatingOrder = _a.sent();
                                            if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
                                                throw exceptions_1.ClientCreateOrderException;
                                            }
                                            return [4 /*yield*/, this.ridderNotification.createRidderNotificationByUserId(notificationTemplate_1.NotificationTemplateOfAcceptingRidderInvite(receiverName, ridderInvite.inviter.id, responseOfCreatingOrder[0].id))];
                                        case 7:
                                            responseOfCreatingNotification = _a.sent();
                                            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                                throw exceptions_1.ClientCreateRidderNotificationException;
                                            }
                                            return [2 /*return*/, [{
                                                        orderId: responseOfCreatingOrder[0].id,
                                                        status: responseOfDecidingRidderInvite[0].inviteStatus,
                                                        price: responseOfCreatingOrder[0].finalPrice,
                                                        finalStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
                                                        finalEndCord: responseOfDecidingRidderInvite[0].inviterEndCord,
                                                        finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
                                                        finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
                                                        startAfter: responseOfCreatingOrder[0].startAfter,
                                                        endedAt: responseOfCreatingOrder[0].endedAt,
                                                        orderStatus: responseOfCreatingOrder[0].status
                                                    }]];
                                    }
                                });
                            }); })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        if (!(decideRidderInviteDto.status === "REJECTED")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.db.update(ridderInvite_schema_1.RidderInviteTable).set({
                                status: decideRidderInviteDto.status,
                                updatedAt: new Date()
                            }).where(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id))
                                .returning({
                                id: ridderInvite_schema_1.RidderInviteTable.id,
                                ridderId: ridderInvite_schema_1.RidderInviteTable.userId,
                                status: ridderInvite_schema_1.RidderInviteTable.status,
                                updatedAt: ridderInvite_schema_1.RidderInviteTable.updatedAt
                            })];
                    case 4:
                        responseOfRejectingRidderInvite = _b.sent();
                        if (!responseOfRejectingRidderInvite || responseOfRejectingRidderInvite.length === 0) {
                            throw exceptions_1.ClientInviteNotFoundException;
                        }
                        return [4 /*yield*/, this.ridderNotification.createRidderNotificationByUserId(notificationTemplate_1.NotificationTemplateOfRejectingRiddererInvite(receiverName, decideRidderInviteDto.rejectReason, responseOfRejectingRidderInvite[0].ridderId, responseOfRejectingRidderInvite[0].id))];
                    case 5:
                        responseOfCreatingNotification = _b.sent();
                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                            throw exceptions_1.ClientCreateRidderNotificationException;
                        }
                        return [2 /*return*/, [{
                                    status: responseOfRejectingRidderInvite[0].status
                                }]];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Accept or Reject operations used by Passenger ================= */
    /* ================================= Update operations ================================= */
    /* ================================= Delete operations ================================= */
    RidderInviteService.prototype.deleteRidderInviteById = function (id, inviterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db["delete"](ridderInvite_schema_1.RidderInviteTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.id, id), drizzle_orm_1.eq(ridderInvite_schema_1.RidderInviteTable.userId, inviterId), drizzle_orm_1.ne(ridderInvite_schema_1.RidderInviteTable.status, "CHECKING")))
                            .returning({
                            id: ridderInvite_schema_1.RidderInviteTable.id,
                            status: ridderInvite_schema_1.RidderInviteTable.status
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RidderInviteService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], RidderInviteService);
    return RidderInviteService;
}());
exports.RidderInviteService = RidderInviteService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32;
