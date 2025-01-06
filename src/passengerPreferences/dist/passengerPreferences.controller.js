"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PassengerPreferencesController = void 0;
var common_1 = require("@nestjs/common");
var guard_1 = require("../auth/guard");
var decorator_1 = require("../auth/decorator");
var exceptions_1 = require("../exceptions");
var enums_1 = require("../enums");
var utils_1 = require("../utils");
var constants_1 = require("../constants");
var PassengerPreferencesController = /** @class */ (function () {
    function PassengerPreferencesController(passengerPreferencesService) {
        this.passengerPreferencesService = passengerPreferencesService;
    }
    /* ================================= Create operations ================================= */
    PassengerPreferencesController.prototype.createMyPreferenceByUserName = function (passenger, preferenceUserName, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        if (!preferenceUserName) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.passengerPreferencesService.createPassengerPreferenceByPreferenceUserName(passenger.id, preferenceUserName)];
                    case 1:
                        res = _c.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientCreatePassengerPreferenceException;
                        response.status(enums_1.HttpStatusCode.Ok).send({
                            createdAt: new Date()
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _c.sent();
                        response.status((_a = error_1.status) !== null && _a !== void 0 ? _a : 500).send({
                            "case": (_b = error_1["case"]) !== null && _b !== void 0 ? _b : "E-C-999",
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================================= Create operations ================================= */
    /* ================================= Search operations ================================= */
    PassengerPreferencesController.prototype.searchMyPaginationPreferences = function (passenger, preferenceUserName, limit, offset, response) {
        if (preferenceUserName === void 0) { preferenceUserName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (utils_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (utils_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.passengerPreferencesService.searchPaginationPassengerPreferences(passenger.id, preferenceUserName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPassengerPreferenceNotFoundException;
                        response.status(enums_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (!(error_2 instanceof common_1.UnauthorizedException
                            || error_2 instanceof common_1.NotAcceptableException
                            || error_2 instanceof common_1.NotFoundException)) {
                            error_2 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_2.status).send(__assign({}, error_2.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================================= Search operations ================================= */
    /* ================================= Delete operations ================================= */
    PassengerPreferencesController.prototype.deleteMyPreferenceByUserName = function (passenger, preferenceUserName, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!preferenceUserName) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.passengerPreferencesService.deletePassengerPreferenceByUserIdAndPreferenceUserId(passenger.id, preferenceUserName)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPassengerPreferenceNotFoundException;
                        response.status(enums_1.HttpStatusCode.Ok).send({
                            deletedAt: new Date()
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (!(error_3 instanceof common_1.UnauthorizedException
                            || error_3 instanceof common_1.BadRequestException
                            || error_3 instanceof common_1.NotFoundException)) {
                            error_3 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_3.status).send(__assign({}, error_3.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Post('createMyPreferenceByUserName'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('preferenceUserName')),
        __param(2, common_1.Res())
    ], PassengerPreferencesController.prototype, "createMyPreferenceByUserName");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('searchMyPaginationPreferences'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('preferenceUserName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], PassengerPreferencesController.prototype, "searchMyPaginationPreferences");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Delete('deleteMyPreferenceByUserName'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('preferenceUserName')),
        __param(2, common_1.Res())
    ], PassengerPreferencesController.prototype, "deleteMyPreferenceByUserName");
    PassengerPreferencesController = __decorate([
        common_1.Controller('passengerPreferences')
    ], PassengerPreferencesController);
    return PassengerPreferencesController;
}());
exports.PassengerPreferencesController = PassengerPreferencesController;
