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
exports.PassengerRecordController = void 0;
const common_1 = require("@nestjs/common");
const passengerRecord_service_1 = require("./passengerRecord.service");
const store_passengerRecord_dto_1 = require("./dto/store-passengerRecord.dto");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const interfaces_1 = require("../interfaces");
const exceptions_1 = require("../exceptions");
const enums_1 = require("../enums");
let PassengerRecordController = class PassengerRecordController {
    constructor(passengerRecordService) {
        this.passengerRecordService = passengerRecordService;
    }
    async storeSearchRecordByUserId(passenger, storePassengerRecordDto, response) {
        try {
            const res = await this.passengerRecordService.storeSearchRecordByUserId(passenger.id, storePassengerRecordDto);
            if (!res || res.length === 0)
                throw exceptions_1.ClientStoreSearchRecordsException;
            response.status(enums_1.HttpStatusCode.Ok).send({
                storedAt: new Date(),
                ...res[0],
            });
        }
        catch (error) {
            if (!(error instanceof common_1.UnauthorizedException
                || error instanceof common_1.ForbiddenException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    async getSearchRecordsByUserId(passenger, response) {
        try {
            const res = await this.passengerRecordService.getSearchRecordsByUserId(passenger.id);
            if (!res || res.length === 0)
                throw exceptions_1.ClientPassengerRecordNotFoundException;
            response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
        }
        catch (error) {
            console.log(error);
            if (!(error instanceof common_1.UnauthorizedException)) {
                error = exceptions_1.ClientUnknownException;
            }
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
};
exports.PassengerRecordController = PassengerRecordController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('storeSearchRecordByUserId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType,
        store_passengerRecord_dto_1.StorePassengerRecordDto, Object]),
    __metadata("design:returntype", Promise)
], PassengerRecordController.prototype, "storeSearchRecordByUserId", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Get)('getSearchRecordsByUserId'),
    __param(0, (0, decorator_1.Passenger)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interfaces_1.PassengerType, Object]),
    __metadata("design:returntype", Promise)
], PassengerRecordController.prototype, "getSearchRecordsByUserId", null);
exports.PassengerRecordController = PassengerRecordController = __decorate([
    (0, common_1.Controller)('passengerRecord'),
    __metadata("design:paramtypes", [passengerRecord_service_1.PassengerRecordService])
], PassengerRecordController);
//# sourceMappingURL=passengerRecord.controller.js.map