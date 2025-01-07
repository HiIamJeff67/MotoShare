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
const create_passengerBank_dto_1 = require("./dto/create-passengerBank.dto");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const guard_1 = require("../auth/guard");
const enums_1 = require("../enums");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
let PassengerBankController = class PassengerBankController {
    constructor(passengerBankService) {
        this.passengerBankService = passengerBankService;
    }
    async getMyBalance(passenger, response) {
        try {
            const res = await this.passengerBankService.getMyBalacne(passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerBankNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
    async createPaymentIntentForAddingBalanceByUserId(passenger, createPaymentIntentDto, response) {
        if ((0, utils_1.toNumber)(createPaymentIntentDto.amount) <= 0) {
            throw exceptions_1.ApiNonPositiveAmountDetectedException;
        }
        try {
            const res = await this.passengerBankService.createPaymentIntentForAddingBalance(passenger.id, passenger.userName, passenger.email, (0, utils_1.toNumber)(createPaymentIntentDto.amount));
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
    async payToFinishOrderById(passenger, createPaymentIntentDto, response) {
        if ((0, utils_1.toNumber)(createPaymentIntentDto.amount) <= 0) {
            throw exceptions_1.ApiNonPositiveAmountDetectedException;
        }
        try {
            const res = await this.passengerBankService.payToFinishOrderById(passenger.id, passenger.userName, passenger.email, (0, utils_1.toNumber)(createPaymentIntentDto.amount));
            if (!res || res.length === 0)
                throw exceptions_1.ApiPaymentIntentNotFinishedException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
};
exports.PassengerBankController = PassengerBankController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('/getMyBalance'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerBankController.prototype, "getMyBalance", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('/createPaymentIntentForAddingBalanceByUserId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        create_passengerBank_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerBankController.prototype, "createPaymentIntentForAddingBalanceByUserId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('/payToFinishOrderById'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        create_passengerBank_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerBankController.prototype, "payToFinishOrderById", null);
exports.PassengerBankController = PassengerBankController = __decorate([
    (0, common_1.Controller)('passengerBank'),
    __metadata("design:paramtypes", [passengerBank_service_1.PassengerBankService])
], PassengerBankController);
//# sourceMappingURL=passengerBank.controller.js.map