"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCreatingRidderInvite = void 0;
const NotificationTemplateOfCreatingRidderInvite = (ridderName, passengerId, ridderInviteId) => ({
    userId: passengerId,
    title: `${ridderName} has invited you`,
    description: `You received an invite from ${ridderName} in the below purchase order`,
    notificationType: "RidderInvite",
    linkId: ridderInviteId,
});
exports.NotificationTemplateOfCreatingRidderInvite = NotificationTemplateOfCreatingRidderInvite;
//# sourceMappingURL=createRidderInvite.template.js.map