import { DrizzleDB } from '../drizzle/types/drizzle';
import { NotificationType } from '../types/notification.type';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
export declare class PassengerNotificationService {
    private config;
    private gateway;
    private db;
    constructor(config: ConfigService, gateway: NotificationGateway, db: DrizzleDB);
    createPassengerNotificationByUserId(userId: string, title: string, description: string | undefined, notificationType: NotificationType, linkId: string): Promise<{
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        id: string;
        userId: string;
        title: string;
        description: string | null;
        linkId: string | null;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    getPassengerNotificationById(id: string, userId: string): Promise<{
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
    searchPaginationPassengerNotifications(userId: string, limit: number, offset: number): Promise<{
        id: string;
        title: string;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        isRead: boolean;
        createdAt: Date;
    }[]>;
    updateToReadStatusPassengerNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
    deletePassengerNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
}
