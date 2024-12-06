"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingExpiredPassengerInvites = void 0;
const NotificationTemplateOfUpdatingExpiredPassengerInvites = (passengerId, passengerInviteId) => ({
    userId: passengerId,
    title: `Your invite has expired`,
    description: `The status of your passenger invite has been set to expired at ${new Date()}`,
    notificationType: "PassengerInvite",
    linkId: passengerInviteId,
});
exports.NotificationTemplateOfUpdatingExpiredPassengerInvites = NotificationTemplateOfUpdatingExpiredPassengerInvites;
//# sourceMappingURL=updateExpiredPassengerInvites.template.js.map