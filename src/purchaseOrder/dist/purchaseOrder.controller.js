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
exports.PurchaseOrderController = void 0;
var common_1 = require("@nestjs/common");
var HttpStatusCode_enum_1 = require("../enums/HttpStatusCode.enum");
var exceptions_1 = require("../exceptions");
var guard_1 = require("../auth/guard");
var decorator_1 = require("../auth/decorator");
var constants_1 = require("../constants");
var stringParser_1 = require("../utils/stringParser");
var types_1 = require("../types");
var PurchaseOrderController = /** @class */ (function () {
    function PurchaseOrderController(purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }
    /* ================================= Create operations ================================= */
    PurchaseOrderController.prototype.createPurchaseOrder = function (passenger, createPurchaseOrderDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.purchaseOrderService.createPurchaseOrderByCreatorId(passenger.id, createPurchaseOrderDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientCreatePurchaseOrderException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ createdAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (!(error_1 instanceof common_1.ForbiddenException
                            || error_1 instanceof common_1.UnauthorizedException
                            || error_1 instanceof common_1.NotFoundException)) {
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
    // use this route to get detail of a puchase order by the given purchaseOrderId
    PurchaseOrderController.prototype.getPurchaseOrderById = function (id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.getPurchaseOrderById(id)];
                    case 1:
                        res = _a.sent();
                        if (!res)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
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
    /* ================= Search operations ================= */
    PurchaseOrderController.prototype.searchMyPurchaseOrders = function (passenger, limit, offset, isAutoAccept, response) {
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchPurchaseOrdersByCreatorId(passenger.id, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (!(error_3 instanceof common_1.UnauthorizedException
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
    PurchaseOrderController.prototype.searchPaginationPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchPaginationPurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (!(error_4 instanceof common_1.NotFoundException
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
    PurchaseOrderController.prototype.searchAboutToStartPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchAboutToStartPurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept))];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (!(error_5 instanceof common_1.NotFoundException
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
    PurchaseOrderController.prototype.searchSimliarTimePurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarTimePurchaseOrderDto, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchSimliarTimePurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept), getSimilarTimePurchaseOrderDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        if (!(error_6 instanceof common_1.NotFoundException
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
    PurchaseOrderController.prototype.searchCurAdjacentPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchCurAdjacentPurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept), getAdjacentPurchaseOrdersDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        if (!(error_7 instanceof common_1.NotFoundException
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
    PurchaseOrderController.prototype.searchDestAdjacentPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getAdjacentPurchaseOrdersDto, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchDestAdjacentPurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept), getAdjacentPurchaseOrdersDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        if (!(error_8 instanceof common_1.NotFoundException
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
    PurchaseOrderController.prototype.searchSimilarRoutePurchaseOrders = function (creatorName, limit, offset, isAutoAccept, getSimilarRoutePurchaseOrdersDto, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchSimilarRoutePurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept), getSimilarRoutePurchaseOrdersDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        if (!(error_9 instanceof common_1.NotFoundException
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
    /* ================= Search operations ================= */
    /* ================= Powerful Search operations ================= */
    PurchaseOrderController.prototype.searchBetterFirstPurchaseOrders = function (creatorName, limit, offset, isAutoAccept, searchPriorities, getBetterPurchaseOrderDto, response) {
        if (creatorName === void 0) { creatorName = undefined; }
        if (limit === void 0) { limit = "10"; }
        if (offset === void 0) { offset = "0"; }
        if (isAutoAccept === void 0) { isAutoAccept = "false"; }
        if (searchPriorities === void 0) { searchPriorities = "RTSDU"; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (stringParser_1.toNumber(limit, true) > constants_1.MAX_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitTooLargeException(constants_1.MAX_SEARCH_LIMIT);
                        }
                        if (stringParser_1.toNumber(limit, true) < constants_1.MIN_SEARCH_LIMIT) {
                            throw exceptions_1.ApiSearchingLimitLessThanZeroException(constants_1.MIN_SEARCH_LIMIT);
                        }
                        if (!types_1.SearchPriorityTypes.includes(searchPriorities)) {
                            throw exceptions_1.ApiWrongSearchPriorityTypeException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.searchBetterFirstPurchaseOrders(creatorName, stringParser_1.toNumber(limit, true), stringParser_1.toNumber(offset, true), stringParser_1.toBoolean(isAutoAccept), getBetterPurchaseOrderDto, searchPriorities)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(res);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        if (!(error_10 instanceof common_1.NotFoundException
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
    /* ================================= Get operations ================================= */
    /* ================================= Update operations ================================= */
    PurchaseOrderController.prototype.updateMyPurchaseOrderById = function (passenger, id, updatePurchaseOrderDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.updatePurchaseOrderById(id, passenger.id, updatePurchaseOrderDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ updatedAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        if (!(error_11 instanceof common_1.BadRequestException
                            || error_11 instanceof common_1.UnauthorizedException
                            || error_11 instanceof common_1.NotFoundException
                            || error_11 instanceof common_1.ForbiddenException)) {
                            error_11 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_11.status).send(__assign({}, error_11.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
    PurchaseOrderController.prototype.startPurchaseOrderWithoutInvite = function (ridder, id, acceptAutoAcceptPurchaseOrderDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.startPurchaseOrderWithoutInvite(id, ridder.id, ridder.userName, acceptAutoAcceptPurchaseOrderDto)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientCreateOrderException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ createdAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        if (!(error_12 instanceof common_1.BadRequestException
                            || error_12 instanceof common_1.UnauthorizedException
                            || error_12 instanceof common_1.NotFoundException
                            || error_12 instanceof common_1.ForbiddenException)) {
                            error_12 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_12.status).send(__assign({}, error_12.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
    /* ================================= Update operations ================================= */
    /* ================================= Delete operations ================================= */
    PurchaseOrderController.prototype.cancelMyPurchaseOrderById = function (passenger, id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.cancelPurchaseOrderById(id, passenger.id, passenger.userName)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ canceled: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        if (!(error_13 instanceof common_1.BadRequestException
                            || error_13 instanceof common_1.UnauthorizedException
                            || error_13 instanceof common_1.NotFoundException
                            || error_13 instanceof common_1.ForbiddenException)) {
                            error_13 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_13.status).send(__assign({}, error_13.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PurchaseOrderController.prototype.deleteMyPurchaseOrderById = function (passenger, id, response) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id) {
                            throw exceptions_1.ApiMissingParameterException;
                        }
                        return [4 /*yield*/, this.purchaseOrderService.deletePurchaseOrderById(id, passenger.id)];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            throw exceptions_1.ClientPurchaseOrderNotFoundException;
                        response.status(HttpStatusCode_enum_1.HttpStatusCode.Ok).send(__assign({ deletedAt: new Date() }, res[0]));
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        if (!(error_14 instanceof common_1.BadRequestException
                            || error_14 instanceof common_1.UnauthorizedException
                            || error_14 instanceof common_1.NotFoundException)) {
                            error_14 = exceptions_1.ClientUnknownException;
                        }
                        response.status(error_14.status).send(__assign({}, error_14.response));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Post('createPurchaseOrder'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Body()),
        __param(2, common_1.Res())
    ], PurchaseOrderController.prototype, "createPurchaseOrder");
    __decorate([
        common_1.UseGuards(new guard_1.AnyGuard([guard_1.JwtPassengerGuard, guard_1.JwtRidderGuard])),
        common_1.Get('getPurchaseOrderById'),
        __param(0, common_1.Query('id')),
        __param(1, common_1.Res())
    ], PurchaseOrderController.prototype, "getPurchaseOrderById");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Get('searchMyPurchaseOrders') // get the purchaseOrder of the passenger
        ,
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Res())
    ], PurchaseOrderController.prototype, "searchMyPurchaseOrders");
    __decorate([
        common_1.Get('searchPaginationPurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Res())
    ], PurchaseOrderController.prototype, "searchPaginationPurchaseOrders");
    __decorate([
        common_1.Get('searchAboutToStartPurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Res())
    ], PurchaseOrderController.prototype, "searchAboutToStartPurchaseOrders");
    __decorate([
        common_1.Post('searchSimliarTimePurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Body()),
        __param(5, common_1.Res())
    ], PurchaseOrderController.prototype, "searchSimliarTimePurchaseOrders");
    __decorate([
        common_1.Post('searchCurAdjacentPurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Body()),
        __param(5, common_1.Res())
    ], PurchaseOrderController.prototype, "searchCurAdjacentPurchaseOrders");
    __decorate([
        common_1.Post('searchDestAdjacentPurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Body()),
        __param(5, common_1.Res())
    ], PurchaseOrderController.prototype, "searchDestAdjacentPurchaseOrders");
    __decorate([
        common_1.Post('searchSimilarRoutePurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Body()),
        __param(5, common_1.Res())
    ], PurchaseOrderController.prototype, "searchSimilarRoutePurchaseOrders");
    __decorate([
        common_1.Post('searchBetterFirstPurchaseOrders'),
        __param(0, common_1.Query('creatorName')),
        __param(1, common_1.Query('limit')),
        __param(2, common_1.Query('offset')),
        __param(3, common_1.Query('isAutoAccept')),
        __param(4, common_1.Query('searchPriorities')),
        __param(5, common_1.Body()),
        __param(6, common_1.Res())
    ], PurchaseOrderController.prototype, "searchBetterFirstPurchaseOrders");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Patch('updateMyPurchaseOrderById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], PurchaseOrderController.prototype, "updateMyPurchaseOrderById");
    __decorate([
        common_1.UseGuards(guard_1.JwtRidderGuard),
        common_1.Post('startPurchaseOrderWithoutInvite'),
        __param(0, decorator_1.Ridder()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Body()),
        __param(3, common_1.Res())
    ], PurchaseOrderController.prototype, "startPurchaseOrderWithoutInvite");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Delete('cancelMyPurchaseOrderById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Res())
    ], PurchaseOrderController.prototype, "cancelMyPurchaseOrderById");
    __decorate([
        common_1.UseGuards(guard_1.JwtPassengerGuard),
        common_1.Delete('deleteMyPurchaseOrderById'),
        __param(0, decorator_1.Passenger()),
        __param(1, common_1.Query('id')),
        __param(2, common_1.Res())
    ], PurchaseOrderController.prototype, "deleteMyPurchaseOrderById");
    PurchaseOrderController = __decorate([
        common_1.Controller('purchaseOrder')
    ], PurchaseOrderController);
    return PurchaseOrderController;
}());
exports.PurchaseOrderController = PurchaseOrderController;
