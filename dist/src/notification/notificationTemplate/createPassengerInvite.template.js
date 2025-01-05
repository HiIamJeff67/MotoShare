"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateOfCreatingPassengerInvite = void 0;
const NotificationTemplateOfCreatingPassengerInvite = (passengerName, ridderId, passengerInviteId) => ({
    userId: ridderId,
    title: `${passengerName} has invited you`,
    description: `You received an invite from ${passengerName} in the below supply order`,
    notificationType: "PassengerInvite",
    linkId: passengerInviteId,
});
exports.NotificationTemplateOfCreatingPassengerInvite = NotificationTemplateOfCreatingPassengerInvite;
//# sourceMappingURL=createPassengerInvite.template.js.map