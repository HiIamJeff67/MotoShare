"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCancelingRidderInvite = void 0;
const NotificationTemplateOfCancelingRidderInvite = (ridderName, passengerId, ridderInviteId) => ({
    userId: passengerId,
    title: `${ridderName} has canceled his/her invite`,
    description: `There's a cancellation on the invite which was created by ${ridderName} relates to your purchase order`,
    notificationType: "RidderInvite",
    linkId: ridderInviteId,
});
exports.NotificationTemplateOfCancelingRidderInvite = NotificationTemplateOfCancelingRidderInvite;
//# sourceMappingURL=cancelRidderInvite.template.js.map