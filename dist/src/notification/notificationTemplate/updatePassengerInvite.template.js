"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfUpdatingPassengerInvite = void 0;
const NotificationTemplateOfUpdatingPassengerInvite = (passengerName, ridderId, passengerInviteId) => ({
    userId: ridderId,
    title: `${passengerName} has updated his/her invite`,
    description: `There's some changes on the invite which was created by ${passengerName} relates to your supply order`,
    notificationType: "PassengerInvite",
    linkId: passengerInviteId,
});
exports.NotificationTemplateOfUpdatingPassengerInvite = NotificationTemplateOfUpdatingPassengerInvite;
//# sourceMappingURL=updatePassengerInvite.template.js.map