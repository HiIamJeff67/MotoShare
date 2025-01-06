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
exports.WebhookService = void 0;
var common_1 = require("@nestjs/common");
var constants_1 = require("../stripe/constants");
var drizzle_module_1 = require("../drizzle/drizzle.module");
var passengerBank_schema_1 = require("../drizzle/schema/passengerBank.schema");
var drizzle_orm_1 = require("drizzle-orm");
var exceptions_1 = require("../exceptions");
var ridderBank_schema_1 = require("../drizzle/schema/ridderBank.schema");
var WebhookService = /** @class */ (function () {
    function WebhookService(stripe, db) {
        this.stripe = stripe;
        this.db = db;
    }
    /* ================================= Receive Stripe operation ================================= */
    WebhookService.prototype.receiveSucceededStripePaymentIntent = function (paymentIntent) {
        return __awaiter(this, void 0, void 0, function () {
            var userRole, amount, customerId, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userRole = paymentIntent.metadata.userRole;
                        amount = paymentIntent.amount;
                        customerId = paymentIntent.customer;
                        response = undefined;
                        _a = userRole;
                        switch (_a) {
                            case "Passenger": return [3 /*break*/, 1];
                            case "Ridder": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, this._updatePassengerBank(customerId, amount)];
                    case 2:
                        response = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        response = this._updateRidderBank(customerId, amount);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    /* ================================= Receive Stripe operation ================================= */
    /* ================================= Update Database operation ================================= */
    WebhookService.prototype._updatePassengerBank = function (customerId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingPassengerBank, currentBalance, newBalance;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            balance: passengerBank_schema_1.PassengerBankTable.balance
                                        }).from(passengerBank_schema_1.PassengerBankTable)
                                            .where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.customerId, customerId))];
                                    case 1:
                                        responseOfSelectingPassengerBank = _a.sent();
                                        if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
                                            throw exceptions_1.ClientPassengerBankNotFoundException;
                                        }
                                        currentBalance = responseOfSelectingPassengerBank[0].balance;
                                        newBalance = currentBalance + amount;
                                        return [4 /*yield*/, tx.update(passengerBank_schema_1.PassengerBankTable).set({
                                                balance: newBalance,
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.eq(passengerBank_schema_1.PassengerBankTable.customerId, customerId))
                                                .returning({
                                                balance: passengerBank_schema_1.PassengerBankTable.balance
                                            })];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhookService.prototype._updateRidderBank = function (customerId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingRidderBank, currentBalance, newBalance;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
                                            balance: ridderBank_schema_1.RidderBankTable.balance
                                        }).from(ridderBank_schema_1.RidderBankTable)
                                            .where(drizzle_orm_1.eq(ridderBank_schema_1.RidderBankTable.customerId, customerId))];
                                    case 1:
                                        responseOfSelectingRidderBank = _a.sent();
                                        if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
                                            throw exceptions_1.ClientRidderBankNotFoundException;
                                        }
                                        currentBalance = responseOfSelectingRidderBank[0].balance;
                                        newBalance = currentBalance + amount;
                                        return [4 /*yield*/, tx.update(ridderBank_schema_1.RidderBankTable).set({
                                                balance: newBalance,
                                                updatedAt: new Date()
                                            }).where(drizzle_orm_1.eq(ridderBank_schema_1.RidderBankTable.customerId, customerId))
                                                .returning({
                                                balance: ridderBank_schema_1.RidderBankTable.balance
                                            })];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Update Database operation ================================= */
    /* ================================= Refund back to Stripe operation ================================= */
    /* ================================= Refund back to Stripe operation ================================= */
    /* ================================= Handle Webhook operation ================================= */
    WebhookService.prototype.handleStripeWebhook = function (body, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var endpointSecret, event, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
                        if (!endpointSecret)
                            throw exceptions_1.ApiEndpointEnvVarNotFoundException;
                        event = this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
                        response = undefined;
                        _a = event.type;
                        switch (_a) {
                            case 'payment_intent.succeeded': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.receiveSucceededStripePaymentIntent(event.data.object)];
                    case 2:
                        response = _b.sent();
                        return [3 /*break*/, 4];
                    case 3: throw exceptions_1.ApiStripeWebhookUnhandleExcpetion;
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    WebhookService = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(constants_1.STRIPE_CLIENT)),
        __param(1, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], WebhookService);
    return WebhookService;
}());
exports.WebhookService = WebhookService;
