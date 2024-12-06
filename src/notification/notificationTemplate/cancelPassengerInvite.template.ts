import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCancelingPassengerInvite = (
    passengerName: string, 
    ridderId: string, 
    passengerInviteId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has canceled his/her invite`, 
    description: `There's a cancellation on the invite which was created by ${passengerName} relates to your supply order`, 
    notificationType: "PassengerInvite", 
    linkId: passengerInviteId, 
});