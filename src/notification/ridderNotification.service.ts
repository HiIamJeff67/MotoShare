import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { NotificationType } from '../types/notification.type';
import { and, desc, eq } from 'drizzle-orm';
import { RidderTable, RidderInfoTable, RidderNotificationTable } from '../drizzle/schema/schema';
import { Client } from 'pg';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { ClientCreateRidderNotificationException } from '../exceptions';
import { NotificationInterface } from '../interfaces';

@Injectable()
export class RidderNotificationService {
    // private pgClient: Client;

    constructor(
        private config: ConfigService, 
        private gateway: NotificationGateway, 
        @Inject(DRIZZLE) private db: DrizzleDB, 
    ) {
        // this.pgClient = new Client({
        //     connectionString: this.config.get("DATABASE_URL"), 
        // });
        // this.pgClient.connect();
        // this.listenToPassengerNotificationsFromPgNotify();
    }

    /* ================================= Pg Notify Listener ================================= */
    // since neon won't let free plan user using pg_notify for longer than 5 minutes, 
    // we apply notify on create operation manually

    // private listenToRidderNotificationsFromPgNotify() {
    //     this.pgClient.query('LISTEN ridder_notifications');
    //     this.pgClient.on('notification', (msg) => {
    //         console.log(msg);
    //         if (msg && msg.payload) {
    //             const payload = JSON.parse(msg.payload);
    //             this.gateway.notifyRidder(payload.userId, payload);
    //         }
    //     });
    // }
    /* ================================= Pg Notify Listener ================================= */


    /* ================================= Create operations ================================= */
    async createRidderNotificationByUserId(
        userId: string, 
        title: string, 
        description: string = "", 
        notificationType: NotificationType, 
        linkId: string, 
    ) {
        const responseOfCreatingRidderNotification = await this.db.insert(RidderNotificationTable).values({
            userId: userId, 
            title: title, 
            description: description, 
            notificationType: notificationType, 
            linkId: linkId, 
            isRead: false, 
        }).returning();
        if (!responseOfCreatingRidderNotification || responseOfCreatingRidderNotification.length === 0) {
            throw ClientCreateRidderNotificationException;
        }

        // we apply trigger manually here
        this.gateway.notifyRidder(userId, {
            id: responseOfCreatingRidderNotification[0].id, 
            userId: responseOfCreatingRidderNotification[0].userId, 
            title: responseOfCreatingRidderNotification[0].title, 
            description: responseOfCreatingRidderNotification[0].description, 
            notificationType: responseOfCreatingRidderNotification[0].notificationType, 
            linkId: responseOfCreatingRidderNotification[0].linkId, 
            isRead: responseOfCreatingRidderNotification[0].isRead, 
            createdAt: responseOfCreatingRidderNotification[0].createdAt, 
        } as NotificationInterface);

        return responseOfCreatingRidderNotification;
    }
    /* ================================= Create operations ================================= */


    /* ================================= Get operations ================================= */
    // for getting the details of one specific ridder notification
    async getRidderNotificationById(id: string, userId: string) {
        return await this.db.select({
            id: RidderNotificationTable.id, 
            userName: RidderTable.userName, 
            avatorUrl: RidderInfoTable.avatorUrl, 
            title: RidderNotificationTable.title, 
            description: RidderNotificationTable.description, 
            notificationType: RidderNotificationTable.notificationType, 
            linkId: RidderNotificationTable.linkId, 
            isRead: RidderNotificationTable.isRead, 
            createdAt: RidderNotificationTable.createdAt, 
        }).from(RidderNotificationTable)
          .where(and(
            eq(RidderNotificationTable.id, id), 
            eq(RidderNotificationTable.userId, userId), 
          )).leftJoin(RidderTable, eq(RidderNotificationTable.userId, RidderTable.id))
            .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId));
    }

    /* ================================= Search operations ================================= */
    async searchPaginationRidderNotifications(
        userId: string, 
        limit: number, 
        offset: number, 
    ) {
        return await this.db.select({
            id: RidderNotificationTable.id, 
            title: RidderNotificationTable.title, 
            notificationType: RidderNotificationTable.notificationType, 
            isRead: RidderNotificationTable.isRead, 
            createdAt: RidderNotificationTable.createdAt, 
        }).from(RidderNotificationTable)
          .where(eq(RidderNotificationTable.userId, userId))
          .orderBy(desc(RidderNotificationTable.createdAt))
          .limit(limit)
          .offset(offset);
    }
    /* ================================= Search operations ================================= */

    /* ================================= Get operations ================================= */


    /* ================================= Update operations ================================= */
    async updateToReadStatusRidderNotification(
        id: string, 
        userId: string, 
    ) {
        return await this.db.update(RidderNotificationTable).set({
            isRead: true, 
        }).where(and(
            eq(RidderNotificationTable.id, id), 
            eq(RidderNotificationTable.userId, userId), 
            // eq(RidderNotificationTable.isRead, false), 
        )).returning({
            id: RidderNotificationTable.id, 
        });
    }
    /* ================================= Update operations ================================= */


    /* ================================= Delete operations ================================= */
    async deleteRidderNotification(id: string, userId: string) {
        return await this.db.delete(RidderNotificationTable)
            .where(and(
                eq(RidderNotificationTable.id, id), 
                eq(RidderNotificationTable.userId, userId), 
            )).returning({
                id: RidderNotificationTable.id, 
            });
    }
    /* ================================= Delete operations ================================= */
}
