"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCancelingOrder = void 0;
const NotificationTemplateOfCancelingOrder = (editorName, receiverId, historyId) => ({
    userId: receiverId,
    title: `${editorName} has canceled the order`,
    description: `There's a cancellation on the order which is between you and ${editorName}, hence the order was turned to a history`,
    notificationType: "History",
    linkId: historyId,
});
exports.NotificationTemplateOfCancelingOrder = NotificationTemplateOfCancelingOrder;
//# sourceMappingURL=cancelOrder.template.js.map