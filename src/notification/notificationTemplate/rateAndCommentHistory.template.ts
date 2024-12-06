import { NotificationTemplateInterface } from "../../interfaces";
import { StarRatingType } from "../../types";

export const NotificationTemplateOfRatingAndCommentingHistory = (
    editorName: string, 
    receiverId: string, 
    historyId: string, 
    starRating: StarRatingType = "0", 
    comment: string = "", 
): NotificationTemplateInterface => {
    const description = `
        ${starRating && `${editorName} has rated a ${starRating} score on the ended order`}
        ${comment && `${starRating && ", also "}${editorName} has made a comment on the ended order`}
         which was between you and ${editorName} in the below history`;

    return {
        userId: receiverId, 
        title: `${editorName} has rated or made a comment on the ended order`, 
        description: description, 
        notificationType: "History", 
        linkId: historyId, 
    }
};