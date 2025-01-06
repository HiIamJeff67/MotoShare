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
var PassengerBankService = /** @class */ (function () {
    function PassengerBankService(config, stripe, db) {
        this.config = config;
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
    PassengerBankService.prototype.getPassengerBankByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var responseOfSelectingPassengerBank, customerId, customer, responseOfCreatingPassengerBank, ephemeralKey, paymentIntent;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.select({
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
                                                    userRole: "Passenger"
                                                }
                                            })];
                                    case 2:
                                        customer = _a.sent();
                                        customerId = customer.id;
                                        return [4 /*yield*/, tx.insert(passengerBank_schema_1.PassengerBankTable).values({
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
                                    case 5: return [4 /*yield*/, this.stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: '2024-12-18.acacia' })];
                                    case 6:
                                        ephemeralKey = _a.sent();
                                        return [4 /*yield*/, this.stripe.paymentIntents.create({
                                                amount: 100 * 100,
                                                currency: 'usd',
                                                customer: customerId,
                                                automatic_payment_methods: {
                                                    enabled: true
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
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PassengerBankService = __decorate([
        common_1.Injectable(),
        __param(1, common_1.Inject(constants_1.STRIPE_CLIENT)),
        __param(2, common_1.Inject(drizzle_module_1.DRIZZLE))
    ], PassengerBankService);
    return PassengerBankService;
}());
exports.PassengerBankService = PassengerBankService;
