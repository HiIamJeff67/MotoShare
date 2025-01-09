import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { and, asc, desc, eq } from 'drizzle-orm';
import { PassengerTable, PassengerInfoTable, PassengerNotificationTable } from '../drizzle/schema/schema';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { ClientCreatePassengerNotificationException } from '../exceptions';
import { NotificationInterface, NotificationTemplateInterface } from '../interfaces';

@Injectable()
export class PassengerNotificationService {
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

    // private listenToPassengerNotificationsFromPgNotify() {
    //     this.pgClient.query('LISTEN passenger_notifications');
    //     this.pgClient.on('notification', (msg) => {
    //         console.log(msg);
    //         if (msg && msg.payload) {
    //             const payload = JSON.parse(msg.payload);
    //             this.gateway.notifyPassenger(payload.userId, payload);
    //         }
    //     });
    // }
    /* ================================= Pg Notify Listener ================================= */


    /* ================================= Create operations ================================= */
    async createPassengerNotificationByUserId(content: NotificationTemplateInterface) {
        const responseOfCreatingPassengerNotification = await this.db.insert(PassengerNotificationTable).values({
            userId: content.userId, 
            title: content.title, 
            description: content.description, 
            notificationType: content.notificationType, 
            linkId: content.linkId, 
            isRead: false, 
        }).returning();
        if (!responseOfCreatingPassengerNotification || responseOfCreatingPassengerNotification.length === 0) {
            throw ClientCreatePassengerNotificationException;
        }

        // we apply trigger manually here
        this.gateway.notifyPassenger(content.userId, {
            id: responseOfCreatingPassengerNotification[0].id, 
            userId: responseOfCreatingPassengerNotification[0].userId, 
            title: responseOfCreatingPassengerNotification[0].title, 
            description: responseOfCreatingPassengerNotification[0].description, 
            notificationType: responseOfCreatingPassengerNotification[0].notificationType, 
            linkId: responseOfCreatingPassengerNotification[0].linkId, 
            isRead: responseOfCreatingPassengerNotification[0].isRead, 
            createdAt: responseOfCreatingPassengerNotification[0].createdAt, 
        } as NotificationInterface);

        return [{
            title: responseOfCreatingPassengerNotification[0].title, 
            description: responseOfCreatingPassengerNotification[0].description, 
            notificationType: responseOfCreatingPassengerNotification[0].notificationType, 
            linkId: responseOfCreatingPassengerNotification[0].linkId, 
        }];
    }

    async createMultiplePassengerNotificationByUserId(data: NotificationTemplateInterface[]) {
        const responseOfCreatingPassengerNotification = await this.db.insert(PassengerNotificationTable).values(
            data.map((content: NotificationTemplateInterface) => ({ ...content, isRead: false }))
        ).returning();
        if (!responseOfCreatingPassengerNotification || responseOfCreatingPassengerNotification.length !== data.length) {
            throw ClientCreatePassengerNotificationException;
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
            } as NotificationInterface);
        });

        return responseOfCreatingPassengerNotification.map(
            ({ title, description, notificationType, linkId }) => ({ title, description, notificationType, linkId })
        );
    }
    /* ================================= Create operations ================================= */

    
    /* ================================= Get operations ================================= */
    // for getting the details of one specific passenger notification
    async getPassengerNotificationById(id: string, userId: string) {
        return await this.db.select({
            id: PassengerNotificationTable.id, 
            userName: PassengerTable.userName, 
            avatorUrl: PassengerInfoTable.avatorUrl, 
            title: PassengerNotificationTable.title, 
            description: PassengerNotificationTable.description, 
            notificationType: PassengerNotificationTable.notificationType, 
            linkId: PassengerNotificationTable.linkId, 
            isRead: PassengerNotificationTable.isRead, 
            createdAt: PassengerNotificationTable.createdAt, 
        }).from(PassengerNotificationTable)
          .where(and(
            eq(PassengerNotificationTable.id, id), 
            eq(PassengerNotificationTable.userId, userId), 
          )).leftJoin(PassengerTable, eq(PassengerNotificationTable.userId, PassengerTable.id))
            .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId));
    }

    /* ================================= Search operations ================================= */
    async searchPaginationPassengerNotifications(
        userId: string, 
        limit: number, 
        offset: number, 
    ) {
        return await this.db.select({
            id: PassengerNotificationTable.id, 
            title: PassengerNotificationTable.title, 
            notificationType: PassengerNotificationTable.notificationType, 
            isRead: PassengerNotificationTable.isRead, 
            createdAt: PassengerNotificationTable.createdAt, 
        }).from(PassengerNotificationTable)
          .where(eq(PassengerNotificationTable.userId, userId))
          .orderBy(
            // since isRead is a boolean value, and true means '1', false means '0', so we sort it in descending order
            desc(PassengerNotificationTable.isRead), 
            desc(PassengerNotificationTable.createdAt), 
          )
          .limit(limit)
          .offset(offset);
    }
    /* ================================= Search operations ================================= */

    /* ================================= Get operations ================================= */


    /* ================================= Update operations ================================= */
    async updatePassengerNotificationToReadStatus(
        id: string, 
        userId: string, 
    ) {
        return await this.db.update(PassengerNotificationTable).set({
            isRead: true, 
        }).where(and(
            eq(PassengerNotificationTable.id, id), 
            eq(PassengerNotificationTable.userId, userId), 
            eq(PassengerNotificationTable.isRead, false), 
        )).returning({
            id: PassengerNotificationTable.id, 
        });
    }
    /* ================================= Update operations ================================= */


    /* ================================= Delete operations ================================= */
    async deletePassengerNotification(id: string, userId: string) {
        return await this.db.delete(PassengerNotificationTable)
            .where(and(
                eq(PassengerNotificationTable.id, id), 
                eq(PassengerNotificationTable.userId, userId), 
            )).returning({
                id: PassengerNotificationTable.id, 
            });
    }
    /* ================================= Delete operations ================================= */
}
