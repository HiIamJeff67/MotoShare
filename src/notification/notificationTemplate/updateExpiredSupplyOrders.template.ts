import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingExpiredSupplyOrders = (
    ridderId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `Your supply order has expired`, 
    description: `The status of your supply order has been set to expired at ${new Date()}`, 
    notificationType: "SupplyOrder", 
    linkId: orderId, 
});