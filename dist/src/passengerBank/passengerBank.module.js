"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerBankModule = void 0;
const common_1 = require("@nestjs/common");
const passengerBank_service_1 = require("./passengerBank.service");
const passengerBank_controller_1 = require("./passengerBank.controller");
const stripe_module_1 = require("../stripe/stripe.module");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const notification_module_1 = require("../notification/notification.module");
let PassengerBankModule = class PassengerBankModule {
};
exports.PassengerBankModule = PassengerBankModule;
exports.PassengerBankModule = PassengerBankModule = __decorate([
    (0, common_1.Module)({
        controllers: [passengerBank_controller_1.PassengerBankController],
        providers: [passengerBank_service_1.PassengerBankService],
        imports: [drizzle_module_1.DrizzleModule, stripe_module_1.StripeModule, notification_module_1.NotificationModule]
    })
], PassengerBankModule);
//# sourceMappingURL=passengerBank.module.js.map