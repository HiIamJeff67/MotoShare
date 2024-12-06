import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCancelingSupplyOrder = (
    ridderName: string, 
    passengerId: string, 
    orderId: string, 
): NotificationTemplateInterface => ({
    userId: passengerId, 
    title: `${ridderName} has canceled his/her purchase order`, 
    description: `There's a cancellation on the purchase order which was created by ${ridderName} relates to your invite`, 
    notificationType: "SupplyOrder", 
    linkId: orderId, 
});