import { NotificationTemplateInterface } from "../../interfaces";
import { OrderStatusType } from "../../types";

export const NotificationTemplateOfChangingOrderStatus = (
    editorName: string, 
    receiverId: string, 
    orderId: string, 
    prevStatus: OrderStatusType, 
    curStatus: OrderStatusType, 
): NotificationTemplateInterface => ({
    userId: receiverId, 
    title: `${editorName} has modified the status on your order`, 
    description: `One of the status of the ungoing order which was between you and ${editorName} has changed from ${prevStatus} to ${curStatus}`, 
    notificationType: "Order", 
    linkId: orderId, 
});