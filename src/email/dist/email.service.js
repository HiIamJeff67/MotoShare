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
exports.EmailService = void 0;
var common_1 = require("@nestjs/common");
var toUTCPlusN_1 = require("../utils/toUTCPlusN");
var EmailService = /** @class */ (function () {
    function EmailService(config, mailer) {
        this.config = config;
        this.mailer = mailer;
    }
    /* ================================= Send Welcome Email operations ================================= */
    EmailService.prototype.sendWelcomeEmail = function (to, userName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mailer.sendMail({
                            to: to,
                            subject: 'Welcome to MotoShare',
                            template: this.config.get("BACKEND_DEVELOPER")
                                && userName.includes(this.config.get("BACKEND_DEVELOPER"))
                                ? './bounsWelcomeEmail'
                                : './welcomeEmail',
                            context: {
                                userName: userName,
                                titleDecorationUrl: this.config.get("MOTOSHARE_DECORATION_1"),
                                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                                currentYear: (toUTCPlusN_1.toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear()
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Send Welcome Email operations ================================= */
    /* ================================= Send AuthCode(Validation) Email operations ================================= */
    EmailService.prototype.sendValidationEamil = function (to, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mailer.sendMail({
                            to: to,
                            subject: 'MotoShare Authentication Code',
                            template: './validatedEmail',
                            context: __assign(__assign({}, payload), { motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"), currentYear: (toUTCPlusN_1.toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear() })
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ================================= Send AuthCode(Validation) Email operations ================================= */
    /* ================================= Send Report(Feedback) Email operations ================================= */
    EmailService.prototype.sendReportEmailToDeveloper = function (userRole, sendReportEmailDto, to) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mailer.sendMail({
                            from: sendReportEmailDto.email,
                            to: to !== null && to !== void 0 ? to : this.config.get("GOOGLE_GMAIL"),
                            subject: "The Report of " + userRole + " from MotoShare",
                            template: './reportEmail',
                            context: {
                                userName: sendReportEmailDto.userName,
                                userEmail: sendReportEmailDto.email,
                                subject: sendReportEmailDto.subject,
                                content: sendReportEmailDto.content,
                                submitTime: toUTCPlusN_1.toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET"))),
                                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                                currentYear: (toUTCPlusN_1.toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear()
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EmailService = __decorate([
        common_1.Injectable()
    ], EmailService);
    return EmailService;
}());
exports.EmailService = EmailService;
