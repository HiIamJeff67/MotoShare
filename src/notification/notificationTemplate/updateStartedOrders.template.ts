import { NotificationTemplateInterface } from "../../interfaces";
import { UserRoleType } from "../../types";

export const NotificationTemplateOfUpdatingStartedOrders = (
    userId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: userId, 
    title: `Your order has expired`, 
    description: `The status of your ungoing order has been set to expired at ${new Date()}`, 
    notificationType: "Order", 
    linkId: orderId, 
});