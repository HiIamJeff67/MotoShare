"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfChangingOrderStatus = void 0;
const NotificationTemplateOfChangingOrderStatus = (editorName, receiverId, orderId, prevStatus, curStatus) => ({
    userId: receiverId,
    title: `${editorName} has modified the status on your order`,
    description: `One of the status of the ungoing order which was between you and ${editorName} has changed from ${prevStatus} to ${curStatus}`,
    notificationType: "Order",
    linkId: orderId,
});
exports.NotificationTemplateOfChangingOrderStatus = NotificationTemplateOfChangingOrderStatus;
//# sourceMappingURL=statusChangeOnOrder.template.js.map