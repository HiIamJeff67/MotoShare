import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingExpiredPurchaseOrders = (
    passengerId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `Your purchase order has expired`, 
    description: `The status of your purchase order has been set to expired at ${new Date()}`, 
    notificationType: "PurchaseOrder", 
    linkId: orderId, 
});