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
exports.PassengerBankController = void 0;
const common_1 = require("@nestjs/common");
const passengerBank_service_1 = require("./passengerBank.service");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const guard_1 = require("../auth/guard");
const enums_1 = require("../enums");
let PassengerBankController = class PassengerBankController {
    constructor(passengerBankService) {
        this.passengerBankService = passengerBankService;
    }
    listCostomers() {
        return this.passengerBankService.listStripeCostomers();
    }
    async getCustomerId(passenger, response) {
        try {
            const res = await this.passengerBankService.getPassengerBankByUserId(passenger.id);
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            console.log(error);
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
};
exports.PassengerBankController = PassengerBankController;
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PassengerBankController.prototype, "listCostomers", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('/getCustomerId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerBankController.prototype, "getCustomerId", null);
exports.PassengerBankController = PassengerBankController = __decorate([
    (0, common_1.Controller)('passengerBank'),
    __metadata("design:paramtypes", [passengerBank_service_1.PassengerBankService])
], PassengerBankController);
//# sourceMappingURL=passengerBank.controller.js.map