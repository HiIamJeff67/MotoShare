"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCancelingSupplyOrder = void 0;
const NotificationTemplateOfCancelingSupplyOrder = (ridderName, passengerId, orderId) => ({
    userId: passengerId,
    title: `${ridderName} has canceled his/her purchase order`,
    description: `There's a cancellation on the purchase order which was created by ${ridderName} relates to your invite`,
    notificationType: "SupplyOrder",
    linkId: orderId,
});
exports.NotificationTemplateOfCancelingSupplyOrder = NotificationTemplateOfCancelingSupplyOrder;
//# sourceMappingURL=cancelSupplyOrder.template.js.map