"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PassengerBankController = void 0;
var common_1 = require("@nestjs/common");
var decorator_1 = require("../auth/decorator");
var guard_1 = require("../auth/guard");
var enums_1 = require("../enums");
var utils_1 = require("../utils");
var exceptions_1 = require("../exceptions");
var PassengerBankController = /** @class */ (function () {
    function PassengerBankController(passengerBankService) {
        this.passengerBankService = passengerBankService;
    }
    PassengerBankController.prototype.getMyBalance = function (passenger, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.passengerBankService.getMyBalacne(passenger.id)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPassengerBankNotFoundException;
                        response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        response.status(error_1.status).send({
                            "case": error_1["case"],
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PassengerBankController.prototype.createPaymentIntentForAddingBalanceByUserId = function (passenger, createPaymentIntentDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utils_1.toNumber(createPaymentIntentDto.amount) <= 0) {
                            throw exceptions_1.ApiNonPositiveAmountDetectedException;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.passengerBankService.createPaymentIntentForAddingBalance(passenger.id, passenger.userName, passenger.email, utils_1.toNumber(createPaymentIntentDto.amount))];
                    case 2:
                        res = _a.sent();
                        response.status(enums_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        response.status(error_2.status).send({
                            "case": error_2["case"],
                            message: error_2.message
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PassengerBankController.prototype.payToFinishOrderById = function (passenger, id, createPaymentIntentDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utils_1.toNumber(createPaymentIntentDto.amount) <= 0) {
                            throw exceptions_1.ApiNonPositiveAmountDetectedException;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.passengerBankService.payToFinishOrderById(id, passenger.id, passenger.userName, utils_1.toNumber(createPaymentIntentDto.amount))];
                    case 2:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ApiPaymentIntentNotFinishedException;
                        response.status(enums_1.HttpStatusCode.Ok).send(res[0]);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        response.status(error_3.status).send({
                            "case": error_3["case"],
                            message: error_3.message
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('/getMyBalance'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Res())
    ], PassengerBankController.prototype, "getMyBalance");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('/createPaymentIntentForAddingBalanceByUserId'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Body()),
        __param(2, common_1.Res())
    ], PassengerBankController.prototype, "createPaymentIntentForAddingBalanceByUserId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Post('/payToFinishOrderById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], PassengerBankController.prototype, "payToFinishOrderById");
    PassengerBankController = __decorate([
        common_1.Controller('passengerBank')
    ], PassengerBankController);
    return PassengerBankController;
}());
exports.PassengerBankController = PassengerBankController;
