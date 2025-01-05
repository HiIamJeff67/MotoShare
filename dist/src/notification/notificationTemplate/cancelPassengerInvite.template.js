"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCancelingPassengerInvite = void 0;
const NotificationTemplateOfCancelingPassengerInvite = (passengerName, ridderId, passengerInviteId) => ({
    userId: ridderId,
    title: `${passengerName} has canceled his/her invite`,
    description: `There's a cancellation on the invite which was created by ${passengerName} relates to your supply order`,
    notificationType: "PassengerInvite",
    linkId: passengerInviteId,
});
exports.NotificationTemplateOfCancelingPassengerInvite = NotificationTemplateOfCancelingPassengerInvite;
//# sourceMappingURL=cancelPassengerInvite.template.js.map