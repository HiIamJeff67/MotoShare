import { DrizzleDB } from '../drizzle/types/drizzle';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateInterface } from '../interfaces';
export declare class PassengerNotificationService {
    private config;
    private gateway;
    private db;
    constructor(config: ConfigService, gateway: NotificationGateway, db: DrizzleDB);
    createPassengerNotificationByUserId(content: NotificationTemplateInterface): Promise<{
        title: string;
        description: string | null;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        linkId: string | null;
    }[]>;
    createMultiplePassengerNotificationByUserId(data: NotificationTemplateInterface[]): Promise<{
        title: string;
        description: string | null;
        notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
        linkId: string | null;
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
    updatePassengerNotificationToReadStatus(id: string, userId: string): Promise<{
        id: string;
    }[]>;
    deletePassengerNotification(id: string, userId: string): Promise<{
        id: string;
    }[]>;
}
