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
exports.RidderNotificationService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema/schema");
const notification_gateway_1 = require("./notification.gateway");
const config_1 = require("@nestjs/config");
const exceptions_1 = require("../exceptions");
let RidderNotificationService = class RidderNotificationService {
    constructor(config, gateway, db) {
        this.config = config;
        this.gateway = gateway;
        this.db = db;
    }
    async createRidderNotificationByUserId(content) {
        const responseOfCreatingRidderNotification = await this.db.insert(schema_1.RidderNotificationTable).values({
            userId: content.userId,
            title: content.title,
            description: content.description,
            notificationType: content.notificationType,
            linkId: content.linkId,
            isRead: false,
        }).returning();
        if (!responseOfCreatingRidderNotification || responseOfCreatingRidderNotification.length === 0) {
            throw exceptions_1.ClientCreateRidderNotificationException;
        }
        this.gateway.notifyRidder(content.userId, {
            id: responseOfCreatingRidderNotification[0].id,
            userId: responseOfCreatingRidderNotification[0].userId,
            title: responseOfCreatingRidderNotification[0].title,
            description: responseOfCreatingRidderNotification[0].description,
            notificationType: responseOfCreatingRidderNotification[0].notificationType,
            linkId: responseOfCreatingRidderNotification[0].linkId,
            isRead: responseOfCreatingRidderNotification[0].isRead,
            createdAt: responseOfCreatingRidderNotification[0].createdAt,
        });
        return [{
                title: responseOfCreatingRidderNotification[0].title,
                description: responseOfCreatingRidderNotification[0].description,
                notificationType: responseOfCreatingRidderNotification[0].notificationType,
                linkId: responseOfCreatingRidderNotification[0].linkId,
            }];
    }
    async createMultipleRidderNotificationsByUserId(data) {
        const responseOfCreatingRidderNotification = await this.db.insert(schema_1.RidderNotificationTable).values(data.map((content) => ({ ...content, isRead: false }))).returning();
        if (!responseOfCreatingRidderNotification || responseOfCreatingRidderNotification.length !== data.length) {
            throw exceptions_1.ClientCreateRidderNotificationException;
        }
        responseOfCreatingRidderNotification.map((content) => {
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
        return responseOfCreatingRidderNotification.map(({ title, description, notificationType, linkId }) => ({ title, description, notificationType, linkId }));
    }
    async getRidderNotificationById(id, userId) {
        return await this.db.select({
            id: schema_1.RidderNotificationTable.id,
            userName: schema_1.RidderTable.userName,
            avatorUrl: schema_1.RidderInfoTable.avatorUrl,
            title: schema_1.RidderNotificationTable.title,
            description: schema_1.RidderNotificationTable.description,
            notificationType: schema_1.RidderNotificationTable.notificationType,
            linkId: schema_1.RidderNotificationTable.linkId,
            isRead: schema_1.RidderNotificationTable.isRead,
            createdAt: schema_1.RidderNotificationTable.createdAt,
        }).from(schema_1.RidderNotificationTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.userId, userId))).leftJoin(schema_1.RidderTable, (0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.userId, schema_1.RidderTable.id))
            .leftJoin(schema_1.RidderInfoTable, (0, drizzle_orm_1.eq)(schema_1.RidderTable.id, schema_1.RidderInfoTable.userId));
    }
    async searchPaginationRidderNotifications(userId, limit, offset) {
        return await this.db.select({
            id: schema_1.RidderNotificationTable.id,
            title: schema_1.RidderNotificationTable.title,
            notificationType: schema_1.RidderNotificationTable.notificationType,
            isRead: schema_1.RidderNotificationTable.isRead,
            createdAt: schema_1.RidderNotificationTable.createdAt,
        }).from(schema_1.RidderNotificationTable)
            .where((0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.RidderNotificationTable.createdAt))
            .limit(limit)
            .offset(offset);
    }
    async updateRidderNotificationToReadStatus(id, userId) {
        return await this.db.update(schema_1.RidderNotificationTable).set({
            isRead: true,
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.userId, userId))).returning({
            id: schema_1.RidderNotificationTable.id,
        });
    }
    async deleteRidderNotification(id, userId) {
        return await this.db.delete(schema_1.RidderNotificationTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.id, id), (0, drizzle_orm_1.eq)(schema_1.RidderNotificationTable.userId, userId))).returning({
            id: schema_1.RidderNotificationTable.id,
        });
    }
};
exports.RidderNotificationService = RidderNotificationService;
exports.RidderNotificationService = RidderNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        notification_gateway_1.NotificationGateway, Object])
], RidderNotificationService);
//# sourceMappingURL=ridderNotification.service.js.map