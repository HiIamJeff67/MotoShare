import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfDirectlyStartOrder = (
    editorName: string, 
    receiverId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: receiverId, 
    title: `${editorName} has directly started your order`, 
    description: `${editorName} has directly started your order, please mind the start time and address`, 
    notificationType: "Order", 
    linkId: orderId, 
});