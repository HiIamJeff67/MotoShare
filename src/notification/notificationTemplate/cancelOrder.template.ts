import { NotificationTemplateInterface } from "../../interfaces";

export const NotificationTemplateOfCancelingOrder = (
    editorName: string, 
    receiverId: string, 
    historyId: string, 
): NotificationTemplateInterface => ({
    userId: receiverId, 
    title: `${editorName} has canceled the order`, 
    description: `There's a cancellation on the order which is between you and ${editorName}, hence the order was turned to a history`, 
    notificationType: "History", 
    linkId: historyId, 
});