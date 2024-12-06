"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfAcceptingPassengerInvite = void 0;
const NotificationTemplateOfAcceptingPassengerInvite = (ridderName, passengerId, orderId) => ({
    userId: passengerId,
    title: `${ridderName} has accepted your invite`,
    description: `${ridderName} has accepted your invite, your ungoing order was created in the below, please mind the start time and the address`,
    notificationType: "Order",
    linkId: orderId,
});
exports.NotificationTemplateOfAcceptingPassengerInvite = NotificationTemplateOfAcceptingPassengerInvite;
//# sourceMappingURL=acceptPassengerInvite.template.js.map