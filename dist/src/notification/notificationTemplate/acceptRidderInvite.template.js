"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfAcceptingRidderInvite = void 0;
const NotificationTemplateOfAcceptingRidderInvite = (passengerName, ridderId, orderId) => ({
    userId: ridderId,
    title: `${passengerName} has accepted your invite`,
    description: `${passengerName} has accepted your invite, your ungoing order was created in the below, please mind the start time and the address`,
    notificationType: "Order",
    linkId: orderId,
});
exports.NotificationTemplateOfAcceptingRidderInvite = NotificationTemplateOfAcceptingRidderInvite;
//# sourceMappingURL=acceptRidderInvite.template.js.map