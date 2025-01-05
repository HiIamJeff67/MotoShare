"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingRidderInvite = void 0;
const NotificationTemplateOfUpdatingRidderInvite = (ridderName, passengerId, ridderInviteId) => ({
    userId: passengerId,
    title: `${ridderName} has updated his/her invite`,
    description: `
        There's some changes on the invite which was 
        created by ${ridderName} relates to your purchase order`,
    notificationType: "RidderInvite",
    linkId: ridderInviteId,
});
exports.NotificationTemplateOfUpdatingRidderInvite = NotificationTemplateOfUpdatingRidderInvite;
//# sourceMappingURL=updateRidderInvite.template.js.map