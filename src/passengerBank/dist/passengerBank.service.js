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
exports.PassengerBankService = void 0;
var common_1 = require("@nestjs/common");
var constants_1 = require("../stripe/constants");
var drizzle_module_1 = require("../drizzle/drizzle.module");
var passengerBank_schema_1 = require("../drizzle/schema/passengerBank.schema");
var exceptions_1 = require("../exceptions");
var drizzle_orm_1 = require("drizzle-orm");
var order_schema_1 = require("../drizzle/schema/order.schema");
var purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
var supplyOrder_schema_1 = require("../drizzle/schema/supplyOrder.schema");
var history_schema_1 = require("../drizzle/schema/history.schema");
var notificationTemplate_1 = require("../notification/notificationTemplate");
var ridderBank_schema_1 = require("../drizzle/schema/ridderBank.schema");
var PassengerBankService = /** @class */ (function () {
    function PassengerBankService(config, ridderNotification, stripe, db) {
        this.config = config;
        this.ridderNotification = ridderNotification;
        this.stripe = stripe;
        this.db = db;
    }
    PassengerBankService.prototype.listStripeCostomers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripe.customers.list()];
            });
        });
    };
    /* ================================= Create PaymentIntent operation ================================= */
    PassengerBankService.prototype._createPaymentIntentForAddingBalanceByUserId = function (userId, userName, email, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var responseOfSelectingPassengerBank, customerId, customer, responseOfCreatingPassengerBank, ephemeralKey, paymentIntent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            customerId: passengerBank_schema_1.PassengerBankTable.customerId
                        }).from(passengerBank_schema_1.PassengerBankTable)
                            .where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.userId, userId))
                            .limit(1)];
                    case 1:
                        responseOfSelectingPassengerBank = _a.sent();
                        customerId = null;
                        if (!(!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.stripe.customers.create({
                                metadata: {
                                    userName: userName,
                                    email: email,
                                    userRole: "Passenger"
                                }
                            })];
                    case 2:
                        customer = _a.sent();
                        customerId = customer.id;
                        return [4 /*yield*/, this.db.insert(passengerBank_schema_1.PassengerBankTable).values({
                                customerId: customer.id,
                                userId: userId
                            }).returning({
                                balance: passengerBank_schema_1.PassengerBankTable.balance
                            })];
                    case 3:
                        responseOfCreatingPassengerBank = _a.sent();
                        if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
                            throw exceptions_1.ClientCreatePassengerBankException;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        customerId = responseOfSelectingPassengerBank[0].customerId;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: constants_1.STRIPE_API_VERSION })];
                    case 6:
                        ephemeralKey = _a.sent();
                        return [4 /*yield*/, this.stripe.paymentIntents.create({
                                amount: amount,
                                currency: constants_1.STRIPE_CURRENCY_TYPE,
                                customer: customerId,
                                automatic_payment_methods: {
                                    enabled: true
                                },
                                metadata: {
                                    userName: userName,
                                    email: email,
                                    userRole: "Passenger"
                                }
                            })];
                    case 7:
                        paymentIntent = _a.sent();
                        return [2 /*return*/, {
                                paymentIntent: paymentIntent.client_secret,
                                ephemeralKey: ephemeralKey.secret,
                                customer: customerId,
                                publishableKey: this.config.get("STRIPE_PK_API_KEY")
                            }];
                }
            });
        });
    };
    /* ================================= Create PaymentIntent operation ================================= */
    /* ================================= Force to Finish Order by PaymentIntent operation ================================= */
    PassengerBankService.prototype._payToFinishOrderById = function (// transaction on passengerBank or ridderBank, not on the stripe
    id, userId, // decreasing the balance of the passenger, and increasing the balance of the ridder
    userName, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingPassengerBank, newPassengerBalance, responseOfDecreasingPassengerBank, responseOfDeletingOrder, prevOrderData, type, prevOrderId, responseOfDeletingPurchaseOrder, responseOfDeletingSupplyOrder, responseOfCreatingHistory, responseOfCreatingNotification, responseOfSelectingRidderBank, newRidderBalance, responseOfIncreasingRidderBank;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            balance: passengerBank_schema_1.PassengerBankTable.balance
                                        }).from(passengerBank_schema_1.PassengerBankTable)
                                            .where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.userId, userId))
                                            .limit(1)];
                                    case 1:
                                        responseOfSelectingPassengerBank = _a.sent();
                                        if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
                                            throw exceptions_1.ClientPassengerBankNotFoundException;
                                        }
                                        if (responseOfSelectingPassengerBank[0].balance < amount) {
                                            throw exceptions_1.ClientPassengerBalanceNotEnoughException;
                                        }
                                        newPassengerBalance = responseOfSelectingPassengerBank[0].balance - amount;
                                        return [4 /*yield*/, tx.update(passengerBank_schema_1.PassengerBankTable).set({
                                                balance: newPassengerBalance,
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.userId, userId))
                                                .returning({
                                                balance: passengerBank_schema_1.PassengerBankTable.balance
                                            })];
                                    case 2:
                                        responseOfDecreasingPassengerBank = _a.sent();
                                        if (!responseOfDecreasingPassengerBank || responseOfDecreasingPassengerBank.length === 0) {
                                            throw exceptions_1.ApiPaymentIntentNotFinishedException;
                                        }
                                        return [4 /*yield*/, tx["delete"](order_schema_1.OrderTable)
                                                .where(drizzle_orm_1.and(drizzle_orm_1.eq(order_schema_1.OrderTable.id, id), drizzle_orm_1.or(drizzle_orm_1.ne(order_schema_1.OrderTable.passengerStatus, "FINISHED"), drizzle_orm_1.ne(order_schema_1.OrderTable.ridderStatus, "FINISHED"))))
                                                .returning({
                                                passengerId: order_schema_1.OrderTable.passengerId,
                                                ridderId: order_schema_1.OrderTable.ridderId,
                                                prevOrderId: order_schema_1.OrderTable.prevOrderId,
                                                finalPrice: order_schema_1.OrderTable.finalPrice,
                                                passengerDescription: order_schema_1.OrderTable.passengerDescription,
                                                ridderDescription: order_schema_1.OrderTable.ridderDescription,
                                                finalStartCord: order_schema_1.OrderTable.finalStartCord,
                                                finalEndCord: order_schema_1.OrderTable.finalEndCord,
                                                finalStartAddress: order_schema_1.OrderTable.finalStartAddress,
                                                finalEndAddress: order_schema_1.OrderTable.finalEndAddress,
                                                startAfter: order_schema_1.OrderTable.startAfter,
                                                endedAt: order_schema_1.OrderTable.endedAt
                                            })];
                                    case 3:
                                        responseOfDeletingOrder = _a.sent();
                                        if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
                                            throw exceptions_1.ClientOrderNotFoundException;
                                        }
                                        prevOrderData = responseOfDeletingOrder[0].prevOrderId.split(" ");
                                        if (!prevOrderData || prevOrderData.length !== 2) {
                                            throw exceptions_1.ApiPrevOrderIdFormException;
                                        }
                                        type = prevOrderData[0], prevOrderId = prevOrderData[1];
                                        if (!(type === "Passenger")) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx["delete"](purchaseOrder_schema_1.PurchaseOrderTable)
                                                .where(drizzle_orm_1.eq(purchaseOrder_schema_1.PurchaseOrderTable.id, prevOrderId))
                                                .returning({
                                                id: purchaseOrder_schema_1.PurchaseOrderTable.id
                                            })];
                                    case 4:
                                        responseOfDeletingPurchaseOrder = _a.sent();
                                        if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                                        }
                                        return [3 /*break*/, 8];
                                    case 5:
                                        if (!(type === "Ridder")) return [3 /*break*/, 7];
                                        return [4 /*yield*/, tx["delete"](supplyOrder_schema_1.SupplyOrderTable)
                                                .where(drizzle_orm_1.eq(supplyOrder_schema_1.SupplyOrderTable.id, prevOrderId))
                                                .returning({
                                                id: supplyOrder_schema_1.SupplyOrderTable.id
                                            })];
                                    case 6:
                                        responseOfDeletingSupplyOrder = _a.sent();
                                        if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                                            throw exceptions_1.ClientSupplyOrderNotFoundException;
                                        }
                                        return [3 /*break*/, 8];
                                    case 7: throw exceptions_1.ApiPrevOrderIdFormException;
                                    case 8: return [4 /*yield*/, tx.insert(history_schema_1.HistoryTable).values({
                                            ridderId: responseOfDeletingOrder[0].ridderId,
                                            passengerId: responseOfDeletingOrder[0].passengerId,
                                            prevOrderId: responseOfDeletingOrder[0].prevOrderId,
                                            finalPrice: responseOfDeletingOrder[0].finalPrice,
                                            passengerDescription: responseOfDeletingOrder[0].passengerDescription,
                                            ridderDescription: responseOfDeletingOrder[0].ridderDescription,
                                            finalStartCord: responseOfDeletingOrder[0].finalStartCord,
                                            finalEndCord: responseOfDeletingOrder[0].finalEndCord,
                                            finalStartAddress: responseOfDeletingOrder[0].finalStartAddress,
                                            finalEndAddress: responseOfDeletingOrder[0].finalEndAddress,
                                            startAfter: responseOfDeletingOrder[0].startAfter,
                                            endedAt: responseOfDeletingOrder[0].endedAt,
                                            status: "FINISHED"
                                        }).returning({
                                            historId: history_schema_1.HistoryTable.id,
                                            historyStatus: history_schema_1.HistoryTable.status
                                        })];
                                    case 9:
                                        responseOfCreatingHistory = _a.sent();
                                        if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
                                            throw exceptions_1.ClientCreateHistoryException;
                                        }
                                        return [4 /*yield*/, this.ridderNotification.createRidderNotificationByUserId(notificationTemplate_1.NotificationTemplateOfCreatingHistory(userName, responseOfDeletingOrder[0].ridderId, responseOfCreatingHistory[0].historId))];
                                    case 10:
                                        responseOfCreatingNotification = _a.sent();
                                        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                                            throw exceptions_1.ClientCreateRidderNotificationException;
                                        }
                                        return [4 /*yield*/, tx.select({
                                                balance: ridderBank_schema_1.RidderBankTable.balance
                                            }).from(ridderBank_schema_1.RidderBankTable)
                                                .where(drizzle_orm_1.eq(ridderBank_schema_1.RidderBankTable.userId, responseOfDeletingOrder[0].ridderId))];
                                    case 11:
                                        responseOfSelectingRidderBank = _a.sent();
                                        if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
                                            throw exceptions_1.ClientRidderBankNotFoundException;
                                        }
                                        newRidderBalance = responseOfSelectingRidderBank[0].balance + amount;
                                        return [4 /*yield*/, tx.update(ridderBank_schema_1.RidderBankTable).set({
                                                balance: newRidderBalance,
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.eq(ridderBank_schema_1.RidderBankTable.userId, responseOfDeletingOrder[0].ridderId))
                                                .returning({
                                                balance: ridderBank_schema_1.RidderBankTable.balance
                                            })];
                                    case 12:
                                        responseOfIncreasingRidderBank = _a.sent();
                                        if (!responseOfIncreasingRidderBank || responseOfIncreasingRidderBank.length === 0) {
                                            throw exceptions_1.ApiPaymentIntentNotFinishedException;
                                        }
                                        return [2 /*return*/, [{
                                                    userBalance: responseOfDecreasingPassengerBank[0].balance
                                                }]];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Force to Finish Order by PaymentIntent operation ================================= */
    /* ================================= Get operation(public) ================================= */
    PassengerBankService.prototype.getMyBalacne = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select({
                            balance: passengerBank_schema_1.PassengerBankTable.balance
                        }).from(passengerBank_schema_1.PassengerBankTable)
                            .where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.userId, userId))
                            .limit(1)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Get operation(public) ================================= */
    /* ================================= Public Payment operation ================================= */
    PassengerBankService.prototype.createPaymentIntentForAddingBalance = function (userId, userName, email, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._createPaymentIntentForAddingBalanceByUserId(userId, userName, email, amount)];
            });
        });
    };
    PassengerBankService.prototype.payToFinishOrderById = function (id, userId, userName, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._payToFinishOrderById(id, userId, userName, amount)];
            });
        });
    };
    PassengerBankService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(constants_1.STRIPE_CLIENT)),
        __param(3, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], PassengerBankService);
    return PassengerBankService;
}());
exports.PassengerBankService = PassengerBankService;
