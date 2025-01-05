"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCreatingHistory = void 0;
const NotificationTemplateOfCreatingHistory = (editorName, receiverId, historyId) => ({
    userId: receiverId,
    title: `Your order between ${editorName} are ended`,
    description: `One of the status of the ungoing order which was between you and ${editorName}, since both the status of passenger and ridder was on finished state, so the order was turned to a history`,
    notificationType: "History",
    linkId: historyId,
});
exports.NotificationTemplateOfCreatingHistory = NotificationTemplateOfCreatingHistory;
//# sourceMappingURL=createHistory.template.js.map