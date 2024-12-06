import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCreatingPassengerInvite = ( 
    passengerName: string, 
    ridderId: string, 
    passengerInviteId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has invited you`, 
    description: `You received an invite from ${passengerName} in the below supply order`, 
    notificationType: "PassengerInvite", 
    linkId: passengerInviteId, 
});