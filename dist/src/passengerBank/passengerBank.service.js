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
exports.PassengerBankService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../stripe/constants");
const stripe_1 = require("stripe");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerBank_schema_1 = require("../drizzle/schema/passengerBank.schema");
const config_1 = require("@nestjs/config");
const exceptions_1 = require("../exceptions");
const drizzle_orm_1 = require("drizzle-orm");
let PassengerBankService = class PassengerBankService {
    constructor(config, stripe, db) {
        this.config = config;
        this.stripe = stripe;
        this.db = db;
    }
    async listStripeCostomers() {
        return this.stripe.customers.list();
    }
    async getPassengerBankByUserId(userId) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerBank = await tx.select({
                customerId: passengerBank_schema_1.PassengerBankTable.customerId,
            }).from(passengerBank_schema_1.PassengerBankTable)
                .where((0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.userId, userId))
                .limit(1);
            let customerId = null;
            if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
                const customer = await this.stripe.customers.create();
                customerId = customer.id;
                const responseOfCreatingPassengerBank = await tx.insert(passengerBank_schema_1.PassengerBankTable).values({
                    customerId: customer.id,
                    userId: userId,
                }).returning({
                    balance: passengerBank_schema_1.PassengerBankTable.balance,
                });
                if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
                    throw exceptions_1.ClientCreatePassengerBankException;
                }
            }
            else {
                customerId = responseOfSelectingPassengerBank[0].customerId;
            }
            const ephemeralKey = await this.stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: '2024-12-18.acacia' });
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: 100 * 100,
                currency: 'usd',
                customer: customerId,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customerId,
                publishableKey: this.config.get("STRIPE_PK_API_KEY"),
            };
        });
    }
};
exports.PassengerBankService = PassengerBankService;
exports.PassengerBankService = PassengerBankService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.STRIPE_CLIENT)),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        stripe_1.default, Object])
], PassengerBankService);
//# sourceMappingURL=passengerBank.service.js.map