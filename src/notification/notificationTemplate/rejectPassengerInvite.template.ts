import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfRejectingPassengerInvite = (
    ridderName: string, 
    rejectReason: string | undefined, 
    passengerId: string, 
    passengerInviteId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has rejected your invite`, 
    description: `${ridderName} has rejected your invite${rejectReason && `, reasons from ${ridderName} : ${rejectReason}`}`, 
    notificationType: "PassengerInvite", 
    linkId: passengerInviteId, 
});