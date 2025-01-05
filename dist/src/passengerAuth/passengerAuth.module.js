"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const passengerAuth_service_1 = require("./passengerAuth.service");
const passengerAuth_controller_1 = require("./passengerAuth.controller");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const email_module_1 = require("../email/email.module");
let PassengerAuthModule = class PassengerAuthModule {
};
exports.PassengerAuthModule = PassengerAuthModule;
exports.PassengerAuthModule = PassengerAuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [passengerAuth_controller_1.PassengerAuthController],
        providers: [passengerAuth_service_1.PassengerAuthService],
        imports: [drizzle_module_1.DrizzleModule, email_module_1.EmailModule],
    })
], PassengerAuthModule);
//# sourceMappingURL=passengerAuth.module.js.map