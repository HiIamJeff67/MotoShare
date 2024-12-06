"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingExpiredRidderInvites = void 0;
const NotificationTemplateOfUpdatingExpiredRidderInvites = (ridderId, ridderInviteId) => ({
    userId: ridderId,
    title: `Your invite has expired`,
    description: `The status of your ridder invite has been set to expired at ${new Date()}`,
    notificationType: "RidderInvite",
    linkId: ridderInviteId,
});
exports.NotificationTemplateOfUpdatingExpiredRidderInvites = NotificationTemplateOfUpdatingExpiredRidderInvites;
//# sourceMappingURL=updateExpiredRidderInvites.template.js.map