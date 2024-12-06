"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingExpiredPurchaseOrders = void 0;
const NotificationTemplateOfUpdatingExpiredPurchaseOrders = (passengerId, orderId) => ({
    userId: passengerId,
    title: `Your purchase order has expired`,
    description: `The status of your purchase order has been set to expired at ${new Date()}`,
    notificationType: "PurchaseOrder",
    linkId: orderId,
});
exports.NotificationTemplateOfUpdatingExpiredPurchaseOrders = NotificationTemplateOfUpdatingExpiredPurchaseOrders;
//# sourceMappingURL=updateExpiredPurchaseOrders.template.js.map