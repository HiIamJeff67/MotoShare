import { DrizzleDB } from '../drizzle/types/drizzle';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateInterface } from '../interfaces';
export declare class RidderNotificationService {
    private config;
    private gateway;
    private db;
    constructor(config: ConfigService, gateway: NotificationGateway, db: DrizzleDB);
    createRidderNotificationByUserId(content: NotificationTemplateInterface): Promise<{
        title: string;
        description: string | null;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        linkId: string | null;
    }[]>;
    createMultipleRidderNotificationsByUserId(data: NotificationTemplateInterface[]): Promise<{
        title: string;
        description: string | null;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        linkId: string | null;
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
    updateRidderNotificationToReadStatus(id: string, userId: string): Promise<{
        id: string;
    }[]>;
    deleteRidderNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
}
