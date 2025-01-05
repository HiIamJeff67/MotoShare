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
exports.PassengerNotificationService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema/schema");
const notification_gateway_1 = require("./notification.gateway");
const config_1 = require("@nestjs/config");
const exceptions_1 = require("../exceptions");
let PassengerNotificationService = class PassengerNotificationService {
    constructor(config, gateway, db) {
        this.config = config;
        this.gateway = gateway;
        this.db = db;
    }
    async createPassengerNotificationByUserId(content) {
        const responseOfCreatingPassengerNotification = await this.db.insert(schema_1.PassengerNotificationTable).values({
            userId: content.userId,
            title: content.title,
            description: content.description,
            notificationType: content.notificationType,
            linkId: content.linkId,
            isRead: false,
        }).returning();
        if (!responseOfCreatingPassengerNotification || responseOfCreatingPassengerNotification.length === 0) {
            throw exceptions_1.ClientCreatePassengerNotificationException;
        }
        this.gateway.notifyPassenger(content.userId, {
            id: responseOfCreatingPassengerNotification[0].id,
            userId: responseOfCreatingPassengerNotification[0].userId,
            title: responseOfCreatingPassengerNotification[0].title,
            description: responseOfCreatingPassengerNotification[0].description,
            notificationType: responseOfCreatingPassengerNotification[0].notificationType,
            linkId: responseOfCreatingPassengerNotification[0].linkId,
            isRead: responseOfCreatingPassengerNotification[0].isRead,
            createdAt: responseOfCreatingPassengerNotification[0].createdAt,
        });
        return [{
                title: responseOfCreatingPassengerNotification[0].title,
                description: responseOfCreatingPassengerNotification[0].description,
                notificationType: responseOfCreatingPassengerNotification[0].notificationType,
                linkId: responseOfCreatingPassengerNotification[0].linkId,
            }];
    }
    async createMultiplePassengerNotificationByUserId(data) {
        const responseOfCreatingPassengerNotification = await this.db.insert(schema_1.PassengerNotificationTable).values(data.map((content) => ({ ...content, isRead: false }))).returning();
        if (!responseOfCreatingPassengerNotification || responseOfCreatingPassengerNotification.length !== data.length) {
            throw exceptions_1.ClientCreatePassengerNotificationException;
        }
        responseOfCreatingPassengerNotification.map((content) => {
            this.gateway.notifyRidder(content.userId, {
                id: content.id,
                userId: content.userId,
                title: content.title,
                description: content.description,
                notificationType: content.notificationType,
                linkId: content.linkId,
                isRead: content.isRead,
                createdAt: content.createdAt,
            });
        });
        return responseOfCreatingPassengerNotification.map(({ title, description, notificationType, linkId }) => ({ title, description, notificationType, linkId }));
    }
    async getPassengerNotificationById(id, userId) {
        return await this.db.select({
            id: schema_1.PassengerNotificationTable.id,
            userName: schema_1.PassengerTable.userName,
            avatorUrl: schema_1.PassengerInfoTable.avatorUrl,
            title: schema_1.PassengerNotificationTable.title,
            description: schema_1.PassengerNotificationTable.description,
            notificationType: schema_1.PassengerNotificationTable.notificationType,
            linkId: schema_1.PassengerNotificationTable.linkId,
            isRead: schema_1.PassengerNotificationTable.isRead,
            createdAt: schema_1.PassengerNotificationTable.createdAt,
        }).from(schema_1.PassengerNotificationTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.userId, userId))).leftJoin(schema_1.PassengerTable, (0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.userId, schema_1.PassengerTable.id))
            .leftJoin(schema_1.PassengerInfoTable, (0, drizzle_orm_1.eq)(schema_1.PassengerTable.id, schema_1.PassengerInfoTable.userId));
    }
    async searchPaginationPassengerNotifications(userId, limit, offset) {
        return await this.db.select({
            id: schema_1.PassengerNotificationTable.id,
            title: schema_1.PassengerNotificationTable.title,
            notificationType: schema_1.PassengerNotificationTable.notificationType,
            isRead: schema_1.PassengerNotificationTable.isRead,
            createdAt: schema_1.PassengerNotificationTable.createdAt,
        }).from(schema_1.PassengerNotificationTable)
            .where((0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.PassengerNotificationTable.createdAt))
            .limit(limit)
            .offset(offset);
    }
    async updatePassengerNotificationToReadStatus(id, userId) {
        return await this.db.update(schema_1.PassengerNotificationTable).set({
            isRead: true,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.userId, userId), (0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.isRead, false))).returning({
            id: schema_1.PassengerNotificationTable.id,
        });
    }
    async deletePassengerNotification(id, userId) {
        return await this.db.delete(schema_1.PassengerNotificationTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.PassengerNotificationTable.userId, userId))).returning({
            id: schema_1.PassengerNotificationTable.id,
        });
    }
};
exports.PassengerNotificationService = PassengerNotificationService;
exports.PassengerNotificationService = PassengerNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        notification_gateway_1.NotificationGateway, Object])
], PassengerNotificationService);
//# sourceMappingURL=passenerNotification.service.js.map