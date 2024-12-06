import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingPassengerInvite = (
    passengerName: string, 
    ridderId: string, 
    passengerInviteId: string, 
): NotificationTemplateInterface => ({
    userId: ridderId, 
    title: `${passengerName} has updated his/her invite`, 
    description: `There's some changes on the invite which was created by ${passengerName} relates to your supply order`, 
    notificationType: "PassengerInvite", 
    linkId: passengerInviteId, 
});