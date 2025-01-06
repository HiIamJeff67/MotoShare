"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerBankService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../stripe/constants");
const stripe_1 = require("stripe");
const drizzle_module_1 = require("../drizzle/drizzle.module");
let PassengerBankService = class PassengerBankService {
    constructor(stripe, db) {
        this.stripe = stripe;
        this.db = db;
    }
    async listStripeCostomers() {
        return this.stripe.customers.list();
    }
};
exports.PassengerBankService = PassengerBankService;
exports.PassengerBankService = PassengerBankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.STRIPE_CLIENT)),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [stripe_1.default, Object])
], PassengerBankService);
//# sourceMappingURL=passengerBank.service.js.map