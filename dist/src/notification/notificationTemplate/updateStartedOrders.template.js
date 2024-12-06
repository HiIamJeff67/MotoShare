"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingStartedOrders = void 0;
const NotificationTemplateOfUpdatingStartedOrders = (userId, orderId) => ({
    userId: userId,
    title: `Your order has expired`,
    description: `The status of your ungoing order has been set to expired at ${new Date()}`,
    notificationType: "Order",
    linkId: orderId,
});
exports.NotificationTemplateOfUpdatingStartedOrders = NotificationTemplateOfUpdatingStartedOrders;
//# sourceMappingURL=updateStartedOrders.template.js.map