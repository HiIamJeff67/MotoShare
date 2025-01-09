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
exports.RidderBankService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../stripe/constants");
const stripe_1 = require("stripe");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const config_1 = require("@nestjs/config");
const ridderBank_schema_1 = require("../drizzle/schema/ridderBank.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
let RidderBankService = class RidderBankService {
    constructor(config, passengerNotification, stripe, db) {
        this.config = config;
        this.passengerNotification = passengerNotification;
        this.stripe = stripe;
        this.db = db;
    }
    async _createPaymentIntentForAddingBalanceByUserId(userId, userName, email, amount) {
        const responseOfSelectingRidderBank = await this.db.select({
            customerId: ridderBank_schema_1.RidderBankTable.customerId,
        }).from(ridderBank_schema_1.RidderBankTable)
            .where((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.userId, userId))
            .limit(1);
        let customerId = null;
        if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
            const customer = await this.stripe.customers.create({
                metadata: {
                    userName: userName,
                    email: email,
                    userRole: "Ridder",
                }
            });
            customerId = customer.id;
            const responseOfCreatingRidderBank = await this.db.insert(ridderBank_schema_1.RidderBankTable).values({
                customerId: customer.id,
                userId: userId,
            }).returning({
                balance: ridderBank_schema_1.RidderBankTable.balance,
            });
            if (!responseOfCreatingRidderBank || responseOfCreatingRidderBank.length === 0) {
                throw exceptions_1.ClientCreateRidderBankException;
            }
        }
        else {
            customerId = responseOfSelectingRidderBank[0].customerId;
        }
        const ephemeralKey = await this.stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: constants_1.STRIPE_API_VERSION });
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount,
            currency: constants_1.STRIPE_CURRENCY_TYPE,
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userName: userName,
                email: email,
                userRole: "Ridder",
            }
        });
        return {
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customerId,
            publishableKey: this.config.get("STRIPE_PK_API_KEY"),
        };
    }
    async getMyBalacne(userId) {
        return await this.db.select({
            balance: ridderBank_schema_1.RidderBankTable.balance,
        }).from(ridderBank_schema_1.RidderBankTable)
            .where((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.userId, userId))
            .limit(1);
    }
    async createPaymentIntentForAddingBalance(userId, userName, email, amount) {
        return this._createPaymentIntentForAddingBalanceByUserId(userId, userName, email, amount);
    }
};
exports.RidderBankService = RidderBankService;
exports.RidderBankService = RidderBankService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(constants_1.STRIPE_CLIENT)),
    __param(3, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        passenerNotification_service_1.PassengerNotificationService,
        stripe_1.default, Object])
], RidderBankService);
//# sourceMappingURL=ridderBank.service.js.map