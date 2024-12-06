import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfUpdatingExpiredPassengerInvites = (
    passengerId: string, 
    passengerInviteId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `Your invite has expired`, 
    description: `The status of your passenger invite has been set to expired at ${new Date()}`, 
    notificationType: "PassengerInvite", 
    linkId: passengerInviteId, 
});