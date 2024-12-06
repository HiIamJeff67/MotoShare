import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCancelingPurchaseOrder = (
    passengerName: string, 
    ridderId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has canceled his/her purchase order`, 
    description: `There's a cancellation on the purchase order which was created by ${passengerName} relates to your invite`, 
    notificationType: "PurchaseOrder", 
    linkId: orderId, 
});