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
exports.RidderBankController = void 0;
const common_1 = require("@nestjs/common");
const ridderBank_service_1 = require("./ridderBank.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const enums_1 = require("../enums");
const create_ridderBank_dto_1 = require("./dto/create-ridderBank.dto");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
let RidderBankController = class RidderBankController {
    constructor(ridderBankService) {
        this.ridderBankService = ridderBankService;
    }
    async getMyBalance(ridder, response) {
        try {
            const res = await this.ridderBankService.getMyBalacne(ridder.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientRidderBankNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
    async createPaymentIntentForAddingBalanceByUserId(ridder, createPaymentIntentDto, response) {
        if ((0, utils_1.toNumber)(createPaymentIntentDto.amount) <= 0) {
            throw exceptions_1.ApiNonPositiveAmountDetectedException;
        }
        try {
            const res = await this.ridderBankService.createPaymentIntentForAddingBalance(ridder.id, ridder.userName, ridder.email, (0, utils_1.toNumber)(createPaymentIntentDto.amount));
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error.status).send({
                case: error.case,
                message: error.message,
            });
        }
    }
    async payToFinishOrderById(ridder, createPaymentIntentDto, response) {
        if ((0, utils_1.toNumber)(createPaymentIntentDto.amount) <= 0) {
            throw exceptions_1.ApiNonPositiveAmountDetectedException;
        }
        try {
            const res = await this.ridderBankService.payToFinishOrderById(ridder.id, ridder.userName, ridder.email, (0, utils_1.toNumber)(createPaymentIntentDto.amount));
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
exports.RidderBankController = RidderBankController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('/getMyBalance'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType, Object]),
    __metadata("design:returntype", Promise)
], RidderBankController.prototype, "getMyBalance", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Get)('/createPaymentIntentForAddingBalanceByUserId'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        create_ridderBank_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], RidderBankController.prototype, "createPaymentIntentForAddingBalanceByUserId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('/payToFinishOrderById'),
    __param(0, (0, decorator_1.Ridder)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.RidderType,
        create_ridderBank_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], RidderBankController.prototype, "payToFinishOrderById", null);
exports.RidderBankController = RidderBankController = __decorate([
    (0, common_1.Controller)('ridderBank'),
    __metadata("design:paramtypes", [ridderBank_service_1.RidderBankService])
], RidderBankController);
//# sourceMappingURL=ridderBank.controller.js.map