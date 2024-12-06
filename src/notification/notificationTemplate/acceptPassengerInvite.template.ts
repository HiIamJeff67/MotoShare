import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfAcceptingPassengerInvite = (
    ridderName: string, 
    passengerId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has accepted your invite`, 
    description: `${ridderName} has accepted your invite, your ungoing order was created in the below, please mind the start time and the address`, 
    notificationType: "Order", 
    linkId: orderId,
});