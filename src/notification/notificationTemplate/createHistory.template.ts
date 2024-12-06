import { NotificationTemplateInterface } from "../../interfaces";
import { OrderStatusType } from "../../types";

export const NotificationTemplateOfCreatingHistory = (
    editorName: string, 
    receiverId: string, 
    historyId: string, 
): NotificationTemplateInterface => ({
    userId: receiverId, 
    title: `Your order between ${editorName} are ended`, 
    description: `One of the status of the ungoing order which was between you and ${editorName}, since both the status of passenger and ridder was on finished state, so the order was turned to a history`, 
    notificationType: "History", 
    linkId: historyId, 
});