"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfDirectlyStartOrder = void 0;
const NotificationTemplateOfDirectlyStartOrder = (editorName, receiverId, orderId) => ({
    userId: receiverId,
    title: `${editorName} has directly started your order`,
    description: `${editorName} has directly started your order, please mind the start time and address`,
    notificationType: "Order",
    linkId: orderId,
});
exports.NotificationTemplateOfDirectlyStartOrder = NotificationTemplateOfDirectlyStartOrder;
//# sourceMappingURL=directlyStartOrder.template.js.map