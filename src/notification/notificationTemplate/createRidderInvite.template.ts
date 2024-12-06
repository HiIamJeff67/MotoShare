import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCreatingRidderInvite = ( 
    ridderName: string, 
    passengerId: string, 
    ridderInviteId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has invited you`, 
    description: `You received an invite from ${ridderName} in the below purchase order`, 
    notificationType: "RidderInvite", 
    linkId: ridderInviteId, 
});