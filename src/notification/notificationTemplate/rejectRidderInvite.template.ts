import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfRejectingRiddererInvite = (
    passengerName: string, 
    rejectReason: string, 
    ridderId: string, 
    ridderInviteId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has rejected your invite`, 
    description: `${passengerName} has rejected your invite, reasons from ${passengerName} : ${rejectReason}`, 
    notificationType: "RidderInvite", 
    linkId: ridderInviteId, 
});