"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const passenerNotification_service_1 = require("./passenerNotification.service");
const notification_gateway_1 = require("./notification.gateway");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const ridderNotification_service_1 = require("./ridderNotification.service");
const passengerNotification_controller_1 = require("./passengerNotification.controller");
const ridderNotification_controller_1 = require("./ridderNotification.controller");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [drizzle_module_1.DrizzleModule],
        controllers: [
            passengerNotification_controller_1.PassengerNotificationController,
            ridderNotification_controller_1.RidderNotificationController
        ],
        providers: [
            notification_gateway_1.NotificationGateway,
            passenerNotification_service_1.PassengerNotificationService,
            ridderNotification_service_1.RidderNotificationService
        ],
        exports: [
            passenerNotification_service_1.PassengerNotificationService,
            ridderNotification_service_1.RidderNotificationService
        ],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map