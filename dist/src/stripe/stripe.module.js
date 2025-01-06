"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StripeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const constants_1 = require("./constants");
let StripeModule = StripeModule_1 = class StripeModule {
    static forRoot(apiKey, config) {
        const stripe = new stripe_1.default(apiKey, config);
        const stripeProvider = {
            provide: constants_1.STRIPE_CLIENT,
            useValue: stripe,
        };
        return {
            module: StripeModule_1,
            providers: [stripeProvider],
            exports: [stripeProvider],
            global: true,
        };
    }
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = StripeModule_1 = __decorate([
    (0, common_1.Module)({})
], StripeModule);
//# sourceMappingURL=stripe.module.js.map