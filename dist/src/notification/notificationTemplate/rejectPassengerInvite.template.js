"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfRejectingPassengerInvite = void 0;
const NotificationTemplateOfRejectingPassengerInvite = (ridderName, rejectReason, passengerId, passengerInviteId) => ({
    userId: passengerId,
    title: `${ridderName} has rejected your invite`,
    description: `${ridderName} has rejected your invite${rejectReason && `, reasons from ${ridderName} : ${rejectReason}`}`,
    notificationType: "PassengerInvite",
    linkId: passengerInviteId,
});
exports.NotificationTemplateOfRejectingPassengerInvite = NotificationTemplateOfRejectingPassengerInvite;
//# sourceMappingURL=rejectPassengerInvite.template.js.map