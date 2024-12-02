import { DrizzleDB } from '../drizzle/types/drizzle';
import { NotificationType } from '../types/notification.type';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
export declare class RidderNotificationService {
    private config;
    private gateway;
    private db;
    constructor(config: ConfigService, gateway: NotificationGateway, db: DrizzleDB);
    createRidderNotificationByUserId(userId: string, title: string, description: string | undefined, notificationType: NotificationType, linkId: string): Promise<{
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        id: string;
        userId: string;
        title: string;
        description: string | null;
        linkId: string | null;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    getRidderNotificationById(id: string, userId: string): Promise<{
        id: string;
        userName: string | null;
        avatorUrl: string | null;
        title: string;
        description: string | null;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        linkId: string | null;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    searchPaginationRidderNotifications(userId: string, limit: number, offset: number): Promise<{
        id: string;
        title: string;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        isRead: boolean;
        createdAt: Date;
    }[]>;
    updateToReadStatusRidderNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
    deleteRidderNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
}
