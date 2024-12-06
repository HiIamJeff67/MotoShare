import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingExpiredRidderInvites = (
    ridderId: string, 
    ridderInviteId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `Your invite has expired`, 
    description: `The status of your ridder invite has been set to expired at ${new Date()}`, 
    notificationType: "RidderInvite", 
    linkId: ridderInviteId, 
});