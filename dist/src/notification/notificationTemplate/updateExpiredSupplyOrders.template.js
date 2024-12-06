"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingExpiredSupplyOrders = void 0;
const NotificationTemplateOfUpdatingExpiredSupplyOrders = (ridderId, orderId) => ({
    userId: ridderId,
    title: `Your supply order has expired`,
    description: `The status of your supply order has been set to expired at ${new Date()}`,
    notificationType: "SupplyOrder",
    linkId: orderId,
});
exports.NotificationTemplateOfUpdatingExpiredSupplyOrders = NotificationTemplateOfUpdatingExpiredSupplyOrders;
//# sourceMappingURL=updateExpiredSupplyOrders.template.js.map