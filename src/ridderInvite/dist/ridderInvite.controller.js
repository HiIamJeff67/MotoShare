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
exports.RidderInviteController = void 0;
var common_1 = require("@nestjs/common");
var HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
var exceptions_1 = require("../exceptions");
var guard_1 = require("../auth/guard");
var decorator_1 = require("../auth/decorator");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var types_1 = require("../types");
var RidderInviteController = /** @class */ (function () {
    function RidderInviteController(ridderInviteService) {
        this.ridderInviteService = ridderInviteService;
    }
    /* ================================= Create operations ================================= */
    RidderInviteController.prototype.createRidderInviteByOrderId = function (ridder, orderId, createRidderInviteDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!orderId) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.createRidderInviteByOrderId(ridder.id, ridder.userName, orderId, createRidderInviteDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientCreateRidderInviteException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Created).send(res[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (!(error_1 instanceof common_1.BadRequestException
                            || error_1 instanceof common_1.UnauthorizedException
                            || error_1 instanceof common_1.ForbiddenException)) {
                            error_1 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_1.status).send(__assign({}, error_1.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================================= Create operations ================================= */
    /* ================================= Get operations ================================= */
    RidderInviteController.prototype.getRidderInviteOfRidderById = function (ridder, id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.getRidderInviteById(id, ridder.id)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (!(error_2 instanceof common_1.BadRequestException
                            || error_2 instanceof common_1.UnauthorizedException
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
    RidderInviteController.prototype.getRidderInviteOfPassengerById = function (passenger, id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.getRidderInviteById(id, passenger.id)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (!(error_3 instanceof common_1.BadRequestException
                            || error_3 instanceof common_1.UnauthorizedException
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
    /* ================= Search RidderInvite operations used by Ridders ================= */
    RidderInviteController.prototype.searchPaginationRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4;
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
                        return [4 /*yield*/, this.ridderInviteService.searchPaginationRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (!(error_4 instanceof common_1.UnauthorizedException
                            || error_4 instanceof common_1.NotFoundException
                            || error_4 instanceof common_1.NotAcceptableException)) {
                            error_4 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_4.status).send(__assign({}, error_4.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchAboutToStartRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_5;
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
                        return [4 /*yield*/, this.ridderInviteService.searchAboutToStartRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (!(error_5 instanceof common_1.UnauthorizedException
                            || error_5 instanceof common_1.NotFoundException
                            || error_5 instanceof common_1.NotAcceptableException)) {
                            error_5 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_5.status).send(__assign({}, error_5.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchSimilarTimeRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_6;
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
                        return [4 /*yield*/, this.ridderInviteService.searchSimilarTimeRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        if (!(error_6 instanceof common_1.UnauthorizedException
                            || error_6 instanceof common_1.NotFoundException
                            || error_6 instanceof common_1.NotAcceptableException)) {
                            error_6 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_6.status).send(__assign({}, error_6.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchCurAdjacentRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_7;
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
                        return [4 /*yield*/, this.ridderInviteService.searchCurAdjacentRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        if (!(error_7 instanceof common_1.UnauthorizedException
                            || error_7 instanceof common_1.NotFoundException
                            || error_7 instanceof common_1.NotAcceptableException)) {
                            error_7 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_7.status).send(__assign({}, error_7.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchDestAdjacentRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_8;
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
                        return [4 /*yield*/, this.ridderInviteService.searchDestAdjacentRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        if (!(error_8 instanceof common_1.UnauthorizedException
                            || error_8 instanceof common_1.NotFoundException
                            || error_8 instanceof common_1.NotAcceptableException)) {
                            error_8 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_8.status).send(__assign({}, error_8.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchSimilarRouteRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_9;
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
                        return [4 /*yield*/, this.ridderInviteService.searchSimilarRouteRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        if (!(error_9 instanceof common_1.UnauthorizedException
                            || error_9 instanceof common_1.NotFoundException
                            || error_9 instanceof common_1.NotAcceptableException)) {
                            error_9 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_9.status).send(__assign({}, error_9.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    RidderInviteController.prototype.searchBetterFirstRidderInvitesByInviterId = function (ridder, receiverName, limit, offset, searchPriorities, response) {
        if (receiverName === void 0) { receiverName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (searchPriorities === void 0) { searchPriorities = "RTSDU"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_10;
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
                        if (!types_1.SearchPriorityTypes.includes(searchPriorities)) {
                            throw exceptions_1.ApiWrongSearchPriorityTypeException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.searchBetterFirstRidderInvitesByInviterId(ridder.id, receiverName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true), searchPriorities)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        if (!(error_10 instanceof common_1.UnauthorizedException
                            || error_10 instanceof common_1.NotFoundException
                            || error_10 instanceof common_1.NotAcceptableException
                            || error_10 instanceof common_1.BadRequestException)) {
                            error_10 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_10.status).send(__assign({}, error_10.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================= Search RidderInvite operations used by Ridders ================= */
    /* ================= Search RidderInvite operations used by Passengers ================= */
    RidderInviteController.prototype.searchPaginationRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_11;
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
                        return [4 /*yield*/, this.ridderInviteService.searchPaginationRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        if (!(error_11 instanceof common_1.UnauthorizedException
                            || error_11 instanceof common_1.NotFoundException
                            || error_11 instanceof common_1.NotAcceptableException)) {
                            error_11 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_11.status).send(__assign({}, error_11.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchAboutToStartRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_12;
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
                        return [4 /*yield*/, this.ridderInviteService.searchAboutToStartRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        if (!(error_12 instanceof common_1.UnauthorizedException
                            || error_12 instanceof common_1.NotFoundException
                            || error_12 instanceof common_1.NotAcceptableException)) {
                            error_12 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_12.status).send(__assign({}, error_12.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchSimilarTimeRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_13;
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
                        return [4 /*yield*/, this.ridderInviteService.searchSimilarTimeRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        if (!(error_13 instanceof common_1.UnauthorizedException
                            || error_13 instanceof common_1.NotFoundException
                            || error_13 instanceof common_1.NotAcceptableException)) {
                            error_13 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_13.status).send(__assign({}, error_13.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchCurAdjacentRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_14;
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
                        return [4 /*yield*/, this.ridderInviteService.searchCurAdjacentRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        if (!(error_14 instanceof common_1.UnauthorizedException
                            || error_14 instanceof common_1.NotFoundException
                            || error_14 instanceof common_1.NotAcceptableException)) {
                            error_14 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_14.status).send(__assign({}, error_14.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchDestAdjacentRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_15;
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
                        return [4 /*yield*/, this.ridderInviteService.searchDestAdjacentRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        if (!(error_15 instanceof common_1.UnauthorizedException
                            || error_15 instanceof common_1.NotFoundException
                            || error_15 instanceof common_1.NotAcceptableException)) {
                            error_15 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_15.status).send(__assign({}, error_15.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RidderInviteController.prototype.searchMySimilarRouteRidderInvitesByReceverId = function (passenger, inviterName, limit, offset, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_16;
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
                        return [4 /*yield*/, this.ridderInviteService.searchSimilarRouteRidderInvitesByReceverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        if (!(error_16 instanceof common_1.UnauthorizedException
                            || error_16 instanceof common_1.NotFoundException
                            || error_16 instanceof common_1.NotAcceptableException)) {
                            error_16 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_16.status).send(__assign({}, error_16.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    RidderInviteController.prototype.searchBetterFirstRidderInvitesByReceiverId = function (passenger, inviterName, limit, offset, searchPriorities, response) {
        if (inviterName === void 0) { inviterName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (searchPriorities === void 0) { searchPriorities = "RTSDU"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_17;
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
                        if (!types_1.SearchPriorityTypes.includes(searchPriorities)) {
                            throw exceptions_1.ApiWrongSearchPriorityTypeException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.searchBetterFirstRidderInvitesByReceiverId(passenger.id, inviterName, utils_1.toNumber(limit, true), utils_1.toNumber(offset, true), searchPriorities)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _a.sent();
                        if (!(error_17 instanceof common_1.UnauthorizedException
                            || error_17 instanceof common_1.NotFoundException
                            || error_17 instanceof common_1.NotAcceptableException
                            || error_17 instanceof common_1.BadRequestException)) {
                            error_17 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_17.status).send(__assign({}, error_17.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Powerful Search operations ================= */
    /* ================= Search RidderInvite operations used by Passengers ================= */
    /* ================================= Get operations ================================= */
    /* ================================= Update operations ================================= */
    /* ================= Update detail operations used by Ridder ================= */
    RidderInviteController.prototype.updateMyRidderInviteById = function (ridder, id, updateRidderInviteDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.updateRidderInviteById(id, ridder.id, ridder.userName, updateRidderInviteDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ updatedAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        console.log(error_18);
                        if (!(error_18 instanceof common_1.BadRequestException
                            || error_18 instanceof common_1.UnauthorizedException
                            || error_18 instanceof common_1.NotFoundException
                            || error_18 instanceof common_1.ConflictException
                            || error_18 instanceof common_1.NotFoundException)) {
                            error_18 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_18.status).send(__assign({}, error_18.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Update detail operations used by Passenger ================= */
    /* ================= Accept or Reject operations used by Ridder ================= */
    RidderInviteController.prototype.decidePassengerInviteById = function (passenger, id, decideRidderInviteDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.decideRidderInviteById(id, passenger.id, passenger.userName, decideRidderInviteDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ updatedAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        if (!(error_19 instanceof common_1.BadRequestException
                            || error_19 instanceof common_1.UnauthorizedException
                            || error_19 instanceof common_1.NotFoundException)) {
                            error_19 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_19.status).send(__assign({}, error_19.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================= Accept or Reject operations used by Ridder ================= */
    /* ================================= Update operations ================================= */
    /* ================================= Delete operations ================================= */
    RidderInviteController.prototype.deleteMyRidderInviteById = function (ridder, id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.ridderInviteService.deleteRidderInviteById(id, ridder.id)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientInviteNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ deletedAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        if (!(error_20 instanceof common_1.BadRequestException
                            || error_20 instanceof common_1.UnauthorizedException
                            || error_20 instanceof common_1.NotFoundException)) {
                            error_20 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_20.status).send(__assign({}, error_20.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Post('ridder/createRidderInviteByOrderId'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('orderId')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], RidderInviteController.prototype, "createRidderInviteByOrderId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/getMyRidderInviteById'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Res())
    ], RidderInviteController.prototype, "getRidderInviteOfRidderById");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/getMyRidderInviteById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Res())
    ], RidderInviteController.prototype, "getRidderInviteOfPassengerById");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMyPaginationRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchPaginationRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMyAboutToStartRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchAboutToStartRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMySimilarTimeRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchSimilarTimeRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMyCurAdjacentRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchCurAdjacentRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMyDestAdjacentRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchDestAdjacentRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMySimilarRouteRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchSimilarRouteRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Get('ridder/searchMyBetterFirstRidderInvites'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('receiverName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Query('searchPriorities')),
        __param(5, common_1.Res())
    ], RidderInviteController.prototype, "searchBetterFirstRidderInvitesByInviterId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMyPaginationRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchPaginationRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMyAboutToStartRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchAboutToStartRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMySimilarTimeRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchSimilarTimeRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMyCurAdjacentRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchCurAdjacentRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMyDestAdjacentRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchDestAdjacentRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMySimilarRouteRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Res())
    ], RidderInviteController.prototype, "searchMySimilarRouteRidderInvitesByReceverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('passenger/searchMyBetterFirstRidderInvites'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('inviterName')),
        __param(2, common_1.Query('limit')),
        __param(3, common_1.Query('offset')),
        __param(4, common_1.Query('searchPriorities')),
        __param(5, common_1.Res())
    ], RidderInviteController.prototype, "searchBetterFirstRidderInvitesByReceiverId");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Patch('ridder/updateMyRidderInviteById'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], RidderInviteController.prototype, "updateMyRidderInviteById");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Patch('passenger/decideRidderInviteById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], RidderInviteController.prototype, "decidePassengerInviteById");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Delete('ridder/deleteMyRidderInviteById'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Res())
    ], RidderInviteController.prototype, "deleteMyRidderInviteById");
    RidderInviteController = __decorate([
        common_1.Controller('ridderInvite')
    ], RidderInviteController);
    return RidderInviteController;
}());
exports.RidderInviteController = RidderInviteController;
