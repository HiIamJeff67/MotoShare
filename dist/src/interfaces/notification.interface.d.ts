import { NotificationType } from "../types/notification.type";
export interface NotificationTemplateInterface {
    userId: string;
    title: string;
    description: string | null;
    notificationType: NotificationType;
    linkId: string;
}
export interface NotificationInterface {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    notificationType: NotificationType;
    linkId: string;
    isRead: boolean;
    createdAt: Date;
}
