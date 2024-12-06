"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCancelingPurchaseOrder = void 0;
const NotificationTemplateOfCancelingPurchaseOrder = (passengerName, ridderId, orderId) => ({
    userId: ridderId,
    title: `${passengerName} has canceled his/her purchase order`,
    description: `There's a cancellation on the purchase order which was created by ${passengerName} relates to your invite`,
    notificationType: "PurchaseOrder",
    linkId: orderId,
});
exports.NotificationTemplateOfCancelingPurchaseOrder = NotificationTemplateOfCancelingPurchaseOrder;
//# sourceMappingURL=cancelPurchaseOrder.template.js.map