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
const order_schema_1 = require("../drizzle/schema/order.schema");
const purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
const supplyOrder_schema_1 = require("../drizzle/schema/supplyOrder.schema");
const history_schema_1 = require("../drizzle/schema/history.schema");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const notificationTemplate_1 = require("../notification/notificationTemplate");
const passengerBank_schema_1 = require("../drizzle/schema/passengerBank.schema");
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
    async _payToFinishOrderById(id, userId, userName, amount) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidderBank = await tx.select({
                balance: ridderBank_schema_1.RidderBankTable.balance,
            }).from(ridderBank_schema_1.RidderBankTable)
                .where((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.userId, userId))
                .limit(1);
            if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
                throw exceptions_1.ClientRidderBankNotFoundException;
            }
            if (responseOfSelectingRidderBank[0].balance < amount) {
                throw exceptions_1.ClientRidderBalanceNotEnoughtException;
            }
            const newRidderBalance = responseOfSelectingRidderBank[0].balance - amount;
            const responseOfDecreasingRidderBank = await tx.update(ridderBank_schema_1.RidderBankTable).set({
                balance: newRidderBalance,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(ridderBank_schema_1.RidderBankTable.userId, userId))
                .returning({
                balance: ridderBank_schema_1.RidderBankTable.balance,
            });
            if (!responseOfDecreasingRidderBank || responseOfDecreasingRidderBank.length === 0) {
                throw exceptions_1.ApiPaymentIntentNotFinishedException;
            }
            const responseOfDeletingOrder = await tx.delete(order_schema_1.OrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(order_schema_1.OrderTable.id, id), (0, drizzle_orm_1.or)((0, drizzle_orm_1.ne)(order_schema_1.OrderTable.passengerStatus, "FINISHED"), (0, drizzle_orm_1.ne)(order_schema_1.OrderTable.ridderStatus, "FINISHED"))))
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
                endedAt: order_schema_1.OrderTable.endedAt,
            });
            if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
                throw exceptions_1.ClientOrderNotFoundException;
            }
            const prevOrderData = responseOfDeletingOrder[0].prevOrderId.split(" ");
            if (!prevOrderData || prevOrderData.length !== 2) {
                throw exceptions_1.ApiPrevOrderIdFormException;
            }
            const [type, prevOrderId] = prevOrderData;
            if (type === "Passenger") {
                const responseOfDeletingPurchaseOrder = await tx.delete(purchaseOrder_schema_1.PurchaseOrderTable)
                    .where((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.id, prevOrderId))
                    .returning({
                    id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                });
                if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
                    throw exceptions_1.ClientPurchaseOrderNotFoundException;
                }
            }
            else if (type === "Ridder") {
                const responseOfDeletingSupplyOrder = await tx.delete(supplyOrder_schema_1.SupplyOrderTable)
                    .where((0, drizzle_orm_1.eq)(supplyOrder_schema_1.SupplyOrderTable.id, prevOrderId))
                    .returning({
                    id: supplyOrder_schema_1.SupplyOrderTable.id,
                });
                if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                    throw exceptions_1.ClientSupplyOrderNotFoundException;
                }
            }
            else {
                throw exceptions_1.ApiPrevOrderIdFormException;
            }
            const responseOfCreatingHistory = await tx.insert(history_schema_1.HistoryTable).values({
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
                status: "FINISHED",
            }).returning({
                historId: history_schema_1.HistoryTable.id,
                historyStatus: history_schema_1.HistoryTable.status,
            });
            if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
                throw exceptions_1.ClientCreateHistoryException;
            }
            const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId((0, notificationTemplate_1.NotificationTemplateOfCreatingHistory)(userName, responseOfDeletingOrder[0].passengerId, responseOfCreatingHistory[0].historId));
            if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
            const responseOfSelectingPassengerBank = await tx.select({
                balance: passengerBank_schema_1.PassengerBankTable.balance,
            }).from(passengerBank_schema_1.PassengerBankTable)
                .where((0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.userId, responseOfDeletingOrder[0].passengerId));
            if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
                throw exceptions_1.ClientRidderBankNotFoundException;
            }
            const newPassengerBalance = responseOfSelectingPassengerBank[0].balance + amount;
            const responseOfIncreasingPassengerBank = await tx.update(ridderBank_schema_1.RidderBankTable).set({
                balance: newPassengerBalance,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerBank_schema_1.PassengerBankTable.userId, responseOfDeletingOrder[0].passengerId))
                .returning({
                balance: passengerBank_schema_1.PassengerBankTable.balance,
            });
            if (!responseOfIncreasingPassengerBank || responseOfIncreasingPassengerBank.length === 0) {
                throw exceptions_1.ApiPaymentIntentNotFinishedException;
            }
            return [{
                    userBalance: responseOfDecreasingRidderBank[0].balance,
                }];
        });
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
    async payToFinishOrderById(id, userId, userName, amount) {
        return this._payToFinishOrderById(id, userId, userName, amount);
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