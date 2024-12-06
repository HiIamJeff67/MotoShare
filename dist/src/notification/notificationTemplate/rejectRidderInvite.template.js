"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfRejectingRiddererInvite = void 0;
const NotificationTemplateOfRejectingRiddererInvite = (passengerName, rejectReason, ridderId, ridderInviteId) => ({
    userId: ridderId,
    title: `${passengerName} has rejected your invite`,
    description: `${passengerName} has rejected your invite, reasons from ${passengerName} : ${rejectReason}`,
    notificationType: "RidderInvite",
    linkId: ridderInviteId,
});
exports.NotificationTemplateOfRejectingRiddererInvite = NotificationTemplateOfRejectingRiddererInvite;
//# sourceMappingURL=rejectRidderInvite.template.js.map