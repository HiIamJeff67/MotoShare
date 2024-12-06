"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfRatingAndCommentingHistory = void 0;
const NotificationTemplateOfRatingAndCommentingHistory = (editorName, receiverId, historyId, starRating = "0", comment = "") => {
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
    };
};
exports.NotificationTemplateOfRatingAndCommentingHistory = NotificationTemplateOfRatingAndCommentingHistory;
//# sourceMappingURL=rateAndCommentHistory.template.js.map