import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCancelingRidderInvite = (
    ridderName: string, 
    passengerId: string, 
    ridderInviteId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has canceled his/her invite`, 
    description: `There's a cancellation on the invite which was created by ${ridderName} relates to your purchase order`, 
    notificationType: "RidderInvite", 
    linkId: ridderInviteId, 
});