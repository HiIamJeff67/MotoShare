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
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const constants_1 = require("../stripe/constants");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerBank_schema_1 = require("../drizzle/schema/passengerBank.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const ridderBank_schema_1 = require("../drizzle/schema/ridderBank.schema");
let WebhookService = class WebhookService {
    constructor(stripe, db) {
        this.stripe = stripe;
        this.db = db;
    }
    async receiveSucceededStripePaymentIntent(paymentIntent) {
        const userRole = paymentIntent.metadata.userRole;
        const userId = paymentIntent.metadata.userId;
        const amount = paymentIntent.amount;
        const customerId = paymentIntent.customer;
        let response = undefined;
        switch (userRole) {
            case "Passenger":
                response = await this._updatePassengerBank(customerId, userId, amount);
                break;
            case "Ridder":
                response = this._updateRidderBank(customerId, userId, amount);
                break;
        }
        return response;
    }
    async _updatePassengerBank(customerId, userId, amount) {
        return await this.db.transaction(async (tx) => {
            let responseOfSelectingPassengerBank = await tx.select({
                balance: passengerBank_schema_1.PassengerBankTable.balance,
            }).from(passengerBank_schema_1.PassengerBankTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.customerId, customerId), (0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.userId, userId)));
            if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
                const responseOfCreatingPassengerBank = await tx.insert(passengerBank_schema_1.PassengerBankTable).values({
                    customerId: customerId,
                    userId: userId,
                    balance: amount,
                }).returning({
                    balance: passengerBank_schema_1.PassengerBankTable.balance,
                });
                if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
                    throw exceptions_1.ClientCreatePassengerBankException;
                }
                responseOfSelectingPassengerBank = responseOfCreatingPassengerBank;
            }
            return await tx.update(passengerBank_schema_1.PassengerBankTable).set({
                balance: (0, drizzle_orm_1.sql) `${responseOfSelectingPassengerBank[0].balance} + ${amount}`,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.customerId, customerId))
                .returning({
                balance: passengerBank_schema_1.PassengerBankTable.balance,
            });
        });
    }
    async _updateRidderBank(customerId, userId, amount) {
        return await this.db.transaction(async (tx) => {
            let responseOfSelectingRidderBank = await tx.select({
                balance: ridderBank_schema_1.RidderBankTable.balance,
            }).from(ridderBank_schema_1.RidderBankTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.customerId, customerId), (0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.userId, userId)));
            if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
                const responseOfCreatingRidderBank = await tx.insert(ridderBank_schema_1.RidderBankTable).values({
                    customerId: customerId,
                    userId: userId,
                    balance: amount,
                }).returning({
                    balance: ridderBank_schema_1.RidderBankTable.balance,
                });
                if (!responseOfCreatingRidderBank || responseOfCreatingRidderBank.length === 0) {
                    throw exceptions_1.ClientCreateRidderBankException;
                }
                responseOfSelectingRidderBank = responseOfCreatingRidderBank;
            }
            return await tx.update(ridderBank_schema_1.RidderBankTable).set({
                balance: responseOfSelectingRidderBank[0].balance + amount,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.customerId, customerId))
                .returning({
                balance: ridderBank_schema_1.RidderBankTable.balance,
            });
        });
    }
    async handleStripeWebhook(request, signature) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret)
            throw exceptions_1.ApiEndpointEnvVarNotFoundException;
        const event = this.stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
        let response = undefined;
        switch (event.type) {
            case 'payment_intent.succeeded':
                response = await this.receiveSucceededStripePaymentIntent(event.data.object);
                break;
            default:
                throw exceptions_1.ApiStripeWebhookUnhandleExcpetion;
        }
        return response;
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.STRIPE_CLIENT)),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [stripe_1.default, Object])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map