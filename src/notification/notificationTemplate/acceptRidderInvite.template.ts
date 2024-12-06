import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfAcceptingRidderInvite = (
    passengerName: string, 
    ridderId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has accepted your invite`, 
    description: `${passengerName} has accepted your invite, your ungoing order was created in the below, please mind the start time and the address`, 
    notificationType: "Order", 
    linkId: orderId,
});