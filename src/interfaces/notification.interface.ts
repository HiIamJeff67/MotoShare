import { NotificationType } from "../types/notification.type"

export interface NotificationInterface {
    id: string
    userId: string
    title: string
    description: string | null
    notificationType: NotificationType
    linkId: string | null
    isRead: boolean
    createdAt: Date
}