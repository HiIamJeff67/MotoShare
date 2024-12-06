import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingRidderInvite = (
    ridderName: string, 
    passengerId: string, 
    ridderInviteId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has updated his/her invite`, 
    description: `
        There's some changes on the invite which was 
        created by ${ridderName} relates to your purchase order`, 
    notificationType: "RidderInvite", 
    linkId: ridderInviteId, 
});