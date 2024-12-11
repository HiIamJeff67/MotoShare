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
exports.CronService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const purchaseOrder_schema_1 = require("../drizzle/schema/purchaseOrder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema/schema");
const exceptions_1 = require("../exceptions");
const history_schema_1 = require("../drizzle/schema/history.schema");
const timeCalculator_1 = require("../utils/timeCalculator");
const passenerNotification_service_1 = require("../notification/passenerNotification.service");
const ridderNotification_service_1 = require("../notification/ridderNotification.service");
const notificationTemplate_1 = require("../notification/notificationTemplate");
let CronService = class CronService {
    constructor(config, passengerNotification, ridderNotification, db) {
        this.config = config;
        this.passengerNotification = passengerNotification;
        this.ridderNotification = ridderNotification;
        this.db = db;
    }
    async signInPassengerAdmin() {
        const adminUserName = this.config.get("PASSENGER_ADMIN_USERNAME");
        if (!adminUserName)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("passengerAdmin's userName");
        const adminEmail = this.config.get("PASSENGER_ADMIN_EMAIL");
        if (!adminEmail)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("passengerAdmin's email");
        const adminPassword = this.config.get("PASSENGER_ADMIN_PASSWORD");
        if (!adminPassword)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("passengerAdmin's password");
        const response = await this.db.select({
            id: schema_1.PassengerTable.id,
            hash: schema_1.PassengerTable.password,
        }).from(schema_1.PassengerTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PassengerTable.userName, adminUserName), (0, drizzle_orm_1.eq)(schema_1.PassengerTable.email, adminEmail)))
            .limit(1);
        if (!response || response.length === 0)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("passengerAdmin's userName or email");
        const user = response[0];
        const pwMatches = await bcrypt.compare(adminPassword, user.hash);
        delete user.hash;
        if (!pwMatches)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("passengerAdmin's password");
        return {
            isAdmin: true,
        };
    }
    async signInRidderAdmin() {
        const adminUserName = this.config.get("RIDDER_ADMIN_USERNAME");
        if (!adminUserName)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("ridderAdmin's userName");
        const adminEmail = this.config.get("RIDDER_ADMIN_EMAIL");
        if (!adminEmail)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("ridderAdmin's email");
        const adminPassword = this.config.get("RIDDER_ADMIN_PASSWORD");
        if (!adminPassword)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("ridderAdmin's password");
        const response = await this.db.select({
            id: schema_1.RidderTable.id,
            hash: schema_1.RidderTable.password,
        }).from(schema_1.RidderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.RidderTable.userName, adminUserName), (0, drizzle_orm_1.eq)(schema_1.RidderTable.email, adminEmail)))
            .limit(1);
        if (!response || response.length === 0)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("ridderAdmin's userName or email");
        const user = response[0];
        const pwMatches = await bcrypt.compare(adminPassword, user.hash);
        delete user.hash;
        if (!pwMatches)
            throw (0, exceptions_1.ServerExtractAdminAccountEnvVariableException)("ridderAdmin's password");
        return {
            isAdmin: true,
        };
    }
    async createPurchaseOrdersByPeriodicPurchaseOrders() {
        return this.db.transaction(async (tx) => {
            const responseOfSelectingPeriodicPurchaseOrders = await tx.select({
                id: schema_1.PeriodicPurchaseOrderTable.id,
                creatorId: schema_1.PeriodicPurchaseOrderTable.creatorId,
                scheduledDay: schema_1.PeriodicPurchaseOrderTable.scheduledDay,
                initPrice: schema_1.PeriodicPurchaseOrderTable.initPrice,
                startCord: schema_1.PeriodicPurchaseOrderTable.startCord,
                endCord: schema_1.PeriodicPurchaseOrderTable.endCord,
                startAddress: schema_1.PeriodicPurchaseOrderTable.startAddress,
                endAddress: schema_1.PeriodicPurchaseOrderTable.endAddress,
                startAfter: schema_1.PeriodicPurchaseOrderTable.startAfter,
                endedAt: schema_1.PeriodicPurchaseOrderTable.endedAt,
                isUrgent: schema_1.PeriodicPurchaseOrderTable.isUrgent,
                autoAccept: schema_1.PeriodicPurchaseOrderTable.autoAccept,
            }).from(schema_1.PeriodicPurchaseOrderTable);
            if (responseOfSelectingPeriodicPurchaseOrders && responseOfSelectingPeriodicPurchaseOrders.length !== 0) {
                const responseOfCreatingPurchaseOrders = await tx.insert(purchaseOrder_schema_1.PurchaseOrderTable).values(responseOfSelectingPeriodicPurchaseOrders.map((content) => {
                    return {
                        creatorId: content.creatorId,
                        description: "This is a purchaseOrder which automatically generated by user's periodicPurchaseOrder",
                        initPrice: content.initPrice,
                        startCord: content.startCord,
                        endCord: content.endCord,
                        startAddress: content.startAddress,
                        endAddress: content.endAddress,
                        startAfter: new Date((0, timeCalculator_1.ISOStringToDateOnly)((0, timeCalculator_1.addDays)((0, timeCalculator_1.daysOfWeekToNumber)(content.scheduledDay)).toISOString()) + "T" +
                            (0, timeCalculator_1.ISOStringToTimeOnlyString)(content.startAfter.toISOString()) + "Z"),
                        endedAt: new Date((0, timeCalculator_1.ISOStringToDateOnly)((0, timeCalculator_1.addDays)((0, timeCalculator_1.daysOfWeekToNumber)(content.scheduledDay)).toISOString()) + "T" +
                            (0, timeCalculator_1.ISOStringToTimeOnlyString)(content.endedAt.toISOString()) + "Z"),
                        isUrgent: content.isUrgent,
                        autoAccept: content.autoAccept,
                    };
                })).returning({
                    id: purchaseOrder_schema_1.PurchaseOrderTable.id,
                });
                if (!responseOfCreatingPurchaseOrders
                    || responseOfCreatingPurchaseOrders.length !== responseOfSelectingPeriodicPurchaseOrders.length) {
                    throw exceptions_1.ClientCreatePurchaseOrderException;
                }
                return responseOfSelectingPeriodicPurchaseOrders.map((value, index) => {
                    return {
                        periodicPurchaseOrderId: value.id,
                        purchaseOrderId: responseOfCreatingPurchaseOrders[index].id,
                    };
                });
            }
            return responseOfSelectingPeriodicPurchaseOrders.map(({ id }) => ({ id }));
        });
    }
    async createSupplyOrdersByPeriodicSupplyOrders() {
        return this.db.transaction(async (tx) => {
            const responseOfSelectingPeriodicSupplyOrders = await tx.select({
                id: schema_1.PeriodicSupplyOrderTable.id,
                creatorId: schema_1.PeriodicSupplyOrderTable.creatorId,
                scheduledDay: schema_1.PeriodicSupplyOrderTable.scheduledDay,
                initPrice: schema_1.PeriodicSupplyOrderTable.initPrice,
                startCord: schema_1.PeriodicSupplyOrderTable.startCord,
                endCord: schema_1.PeriodicSupplyOrderTable.endCord,
                startAddress: schema_1.PeriodicSupplyOrderTable.startAddress,
                endAddress: schema_1.PeriodicSupplyOrderTable.endAddress,
                startAfter: schema_1.PeriodicSupplyOrderTable.startAfter,
                endedAt: schema_1.PeriodicSupplyOrderTable.endedAt,
                tolerableRDV: schema_1.PeriodicSupplyOrderTable.tolerableRDV,
                autoAccept: schema_1.PeriodicSupplyOrderTable.autoAccept,
            }).from(schema_1.PeriodicSupplyOrderTable);
            if (responseOfSelectingPeriodicSupplyOrders && responseOfSelectingPeriodicSupplyOrders.length !== 0) {
                const responseOfCreatingSupplyOrders = await tx.insert(schema_1.SupplyOrderTable).values(responseOfSelectingPeriodicSupplyOrders.map((content) => {
                    return {
                        creatorId: content.creatorId,
                        description: "This is a supplyOrder which automatically generated by user's periodicSupplyOrder",
                        initPrice: content.initPrice,
                        startCord: content.startCord,
                        endCord: content.endCord,
                        startAddress: content.startAddress,
                        endAddress: content.endAddress,
                        startAfter: new Date((0, timeCalculator_1.ISOStringToDateOnly)((0, timeCalculator_1.addDays)((0, timeCalculator_1.daysOfWeekToNumber)(content.scheduledDay)).toISOString()) +
                            (0, timeCalculator_1.ISOStringToTimeOnlyString)(content.startAfter.toISOString())),
                        endedAt: new Date((0, timeCalculator_1.ISOStringToDateOnly)((0, timeCalculator_1.addDays)((0, timeCalculator_1.daysOfWeekToNumber)(content.scheduledDay)).toISOString()) +
                            (0, timeCalculator_1.ISOStringToTimeOnlyString)(content.endedAt.toISOString())),
                        isUrgent: content.tolerableRDV,
                        autoAccept: content.autoAccept,
                    };
                })).returning({
                    id: schema_1.SupplyOrderTable.id,
                });
                if (!responseOfCreatingSupplyOrders
                    || responseOfCreatingSupplyOrders.length !== responseOfSelectingPeriodicSupplyOrders.length) {
                    throw exceptions_1.ClientCreateSupplyOrderException;
                }
                return responseOfSelectingPeriodicSupplyOrders.map((value, index) => {
                    return {
                        periodicSupplyOrderId: value.id,
                        supplyOrderId: responseOfCreatingSupplyOrders[index].id,
                    };
                });
            }
            return responseOfSelectingPeriodicSupplyOrders.map(({ id }) => ({ id }));
        });
    }
    async updateToExpiredPurchaseOrders() {
        const responseOfUpdatingExpiredPurchaseOrders = await this.db.update(purchaseOrder_schema_1.PurchaseOrderTable).set({
            status: "EXPIRED",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "POSTED"), (0, drizzle_orm_1.lte)(purchaseOrder_schema_1.PurchaseOrderTable.startAfter, new Date()))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
            creatorId: purchaseOrder_schema_1.PurchaseOrderTable.creatorId,
        });
        if (responseOfUpdatingExpiredPurchaseOrders && responseOfUpdatingExpiredPurchaseOrders.length !== 0) {
            const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfUpdatingExpiredPurchaseOrders.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingExpiredPurchaseOrders)(content.creatorId, content.id);
            }));
            if (!responseOfCreatingNotification
                || responseOfCreatingNotification.length !== responseOfUpdatingExpiredPurchaseOrders.length) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
        }
        return responseOfUpdatingExpiredPurchaseOrders.map(({ id }) => ({ id }));
    }
    async updateToExpiredSupplyOrders() {
        const responseOfUpdatingExpiredSupplyOrders = await this.db.update(schema_1.SupplyOrderTable).set({
            status: "EXPIRED",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.SupplyOrderTable.status, "POSTED"), (0, drizzle_orm_1.lte)(schema_1.SupplyOrderTable.startAfter, new Date()))).returning({
            id: schema_1.SupplyOrderTable.id,
            creatorId: schema_1.SupplyOrderTable.creatorId,
        });
        if (responseOfUpdatingExpiredSupplyOrders && responseOfUpdatingExpiredSupplyOrders.length !== 0) {
            const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfUpdatingExpiredSupplyOrders.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingExpiredSupplyOrders)(content.creatorId, content.id);
            }));
            if (!responseOfCreatingNotification
                || responseOfCreatingNotification.length !== responseOfUpdatingExpiredSupplyOrders.length) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
        }
        return responseOfUpdatingExpiredSupplyOrders.map(({ id }) => ({ id }));
    }
    async updateToExpiredPassengerInvites() {
        const responseOfUpdatingExpiredPassengerInvites = await this.db.update(schema_1.PassengerInviteTable).set({
            status: "CANCEL",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PassengerInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lte)(schema_1.PassengerInviteTable.suggestStartAfter, new Date()))).returning({
            id: schema_1.PassengerInviteTable.id,
            userId: schema_1.PassengerInviteTable.userId,
        });
        if (responseOfUpdatingExpiredPassengerInvites && responseOfUpdatingExpiredPassengerInvites.length !== 0) {
            const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfUpdatingExpiredPassengerInvites.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingExpiredPassengerInvites)(content.userId, content.id);
            }));
            if (!responseOfCreatingNotification
                || responseOfCreatingNotification.length !== responseOfUpdatingExpiredPassengerInvites.length) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
        }
        return responseOfUpdatingExpiredPassengerInvites.map(({ id }) => ({ id }));
    }
    async updateToExpiredRidderInvites() {
        const responseOfUpdatingToExpiredRidderInvites = await this.db.update(schema_1.RidderInviteTable).set({
            status: "CANCEL",
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.RidderInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lte)(schema_1.RidderInviteTable.suggestStartAfter, new Date()))).returning({
            id: schema_1.RidderInviteTable.id,
            userId: schema_1.RidderInviteTable.userId,
        });
        if (responseOfUpdatingToExpiredRidderInvites && responseOfUpdatingToExpiredRidderInvites.length !== 0) {
            const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfUpdatingToExpiredRidderInvites.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingExpiredRidderInvites)(content.userId, content.id);
            }));
            if (!responseOfCreatingNotification
                || responseOfCreatingNotification.length !== responseOfUpdatingToExpiredRidderInvites.length) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
        }
        return responseOfUpdatingToExpiredRidderInvites.map(({ id }) => ({ id }));
    }
    async updateToStartedOrders() {
        const responseOfUpdatingStartedOrders = await this.db.update(schema_1.OrderTable).set({
            passengerStatus: "STARTED",
            ridderStatus: "STARTED",
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.OrderTable.passengerStatus, "UNSTARTED"), (0, drizzle_orm_1.eq)(schema_1.OrderTable.ridderStatus, "UNSTARTED"), (0, drizzle_orm_1.lte)(schema_1.OrderTable.startAfter, new Date()))).returning({
            id: schema_1.OrderTable.id,
            passengerId: schema_1.OrderTable.passengerId,
            ridderId: schema_1.OrderTable.ridderId,
        });
        if (responseOfUpdatingStartedOrders && responseOfUpdatingStartedOrders.length !== 0) {
            const responseOfCreatingPassengerNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(responseOfUpdatingStartedOrders.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingStartedOrders)(content.passengerId, content.id);
            }));
            if (!responseOfCreatingPassengerNotification
                || responseOfCreatingPassengerNotification.length !== responseOfUpdatingStartedOrders.length) {
                throw exceptions_1.ClientCreatePassengerNotificationException;
            }
            const responseOfCreatingRidderNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(responseOfUpdatingStartedOrders.map((content) => {
                return (0, notificationTemplate_1.NotificationTemplateOfUpdatingStartedOrders)(content.ridderId, content.id);
            }));
            if (!responseOfCreatingRidderNotification
                || responseOfCreatingRidderNotification.length !== responseOfUpdatingStartedOrders.length) {
                throw exceptions_1.ClientCreateRidderNotificationException;
            }
        }
        return responseOfUpdatingStartedOrders.map(({ id }) => ({ id }));
    }
    async deleteExpiredPurchaseOrders() {
        return await this.db.delete(purchaseOrder_schema_1.PurchaseOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(purchaseOrder_schema_1.PurchaseOrderTable.status, "EXPIRED"), (0, drizzle_orm_1.lte)(purchaseOrder_schema_1.PurchaseOrderTable.endedAt, (0, timeCalculator_1.addDays)(7)))).returning({
            id: purchaseOrder_schema_1.PurchaseOrderTable.id,
        });
    }
    async deleteExpiredSupplyOrders() {
        return await this.db.delete(schema_1.SupplyOrderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.SupplyOrderTable.status, "EXPIRED"), (0, drizzle_orm_1.lte)(schema_1.SupplyOrderTable.endedAt, (0, timeCalculator_1.addDays)(7)))).returning({
            id: schema_1.SupplyOrderTable.id,
        });
    }
    async deleteExpiredPassengerInvites() {
        return await this.db.delete(schema_1.PassengerInviteTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.PassengerInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lte)(schema_1.PassengerInviteTable.suggestEndedAt, (0, timeCalculator_1.addDays)(7)))).returning({
            id: schema_1.PassengerInviteTable.id,
        });
    }
    async deleteExpiredRidderInvites() {
        return await this.db.delete(schema_1.RidderInviteTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.RidderInviteTable.status, "CHECKING"), (0, drizzle_orm_1.lte)(schema_1.RidderInviteTable.suggestEndedAt, (0, timeCalculator_1.addDays)(7)))).returning({
            id: schema_1.RidderInviteTable.id,
        });
    }
    async deleteExpiredOrders() {
        return await this.db.transaction(async (tx) => {
            const responseOfDeletingOrders = await tx.delete(schema_1.OrderTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.OrderTable.passengerStatus, "FINISHED"), (0, drizzle_orm_1.ne)(schema_1.OrderTable.ridderStatus, "FINISHED"), (0, drizzle_orm_1.lte)(schema_1.OrderTable.endedAt, new Date()))).returning({
                passengerId: schema_1.OrderTable.passengerId,
                ridderId: schema_1.OrderTable.ridderId,
                prevOrderId: schema_1.OrderTable.prevOrderId,
                finalPrice: schema_1.OrderTable.finalPrice,
                passengerDescription: schema_1.OrderTable.passengerDescription,
                ridderDescription: schema_1.OrderTable.ridderDescription,
                finalStartCord: schema_1.OrderTable.finalStartCord,
                finalEndCord: schema_1.OrderTable.finalEndCord,
                finalStartAddress: schema_1.OrderTable.finalStartAddress,
                finalEndAddress: schema_1.OrderTable.finalEndAddress,
                startAfter: schema_1.OrderTable.startAfter,
                endedAt: schema_1.OrderTable.endedAt,
            });
            if (responseOfDeletingOrders && responseOfDeletingOrders.length !== 0) {
                const responseOfCreatingHistories = await tx.insert(history_schema_1.HistoryTable).values({
                    ridderId: responseOfDeletingOrders[0].ridderId,
                    passengerId: responseOfDeletingOrders[0].passengerId,
                    prevOrderId: responseOfDeletingOrders[0].prevOrderId,
                    finalPrice: responseOfDeletingOrders[0].finalPrice,
                    passengerDescription: responseOfDeletingOrders[0].passengerDescription,
                    ridderDescription: responseOfDeletingOrders[0].ridderDescription,
                    finalStartCord: responseOfDeletingOrders[0].finalStartCord,
                    finalEndCord: responseOfDeletingOrders[0].finalEndCord,
                    finalStartAddress: responseOfDeletingOrders[0].finalStartAddress,
                    finalEndAddress: responseOfDeletingOrders[0].finalEndAddress,
                    startAfter: responseOfDeletingOrders[0].startAfter,
                    endedAt: responseOfDeletingOrders[0].endedAt,
                    status: "EXPIRED",
                }).returning({
                    historyId: history_schema_1.HistoryTable.id,
                    historyStatus: history_schema_1.HistoryTable.status,
                });
                if (!responseOfCreatingHistories
                    || responseOfCreatingHistories.length !== responseOfDeletingOrders.length) {
                    throw exceptions_1.ClientCreateHistoryException;
                }
                return [{
                        ...responseOfCreatingHistories,
                    }];
            }
            return [{
                    ...responseOfDeletingOrders,
                }];
        });
    }
    async deleteExpiredPassengerNotifications() {
        return await this.db.delete(schema_1.PassengerNotificationTable)
            .where((0, drizzle_orm_1.lte)(schema_1.PassengerNotificationTable.createdAt, (0, timeCalculator_1.addDays)(-14)))
            .returning({
            id: schema_1.PassengerNotificationTable.id,
        });
    }
    async deleteExpiredRidderNotifications() {
        return await this.db.delete(schema_1.RidderNotificationTable)
            .where((0, drizzle_orm_1.lte)(schema_1.RidderNotificationTable.createdAt, (0, timeCalculator_1.addDays)(-14)))
            .returning({
            id: schema_1.RidderNotificationTable.id,
        });
    }
};
exports.CronService = CronService;
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        passenerNotification_service_1.PassengerNotificationService,
        ridderNotification_service_1.RidderNotificationService, Object])
], CronService);
//# sourceMappingURL=cron.service.js.map