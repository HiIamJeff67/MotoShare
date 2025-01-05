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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const toUTCPlusN_1 = require("../utils/toUTCPlusN");
let EmailService = class EmailService {
    constructor(config, mailer) {
        this.config = config;
        this.mailer = mailer;
    }
    async sendWelcomeEmail(to, userName) {
        return await this.mailer.sendMail({
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
                currentYear: ((0, toUTCPlusN_1.toUTCPlusN)(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(),
            }
        });
    }
    async sendValidationEamil(to, payload) {
        return await this.mailer.sendMail({
            to: to,
            subject: 'MotoShare Authentication Code',
            template: './validatedEmail',
            context: {
                ...payload,
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                currentYear: ((0, toUTCPlusN_1.toUTCPlusN)(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(),
            },
        });
    }
    async sendReportEmailToDeveloper(userRole, sendReportEmailDto, to) {
        return await this.mailer.sendMail({
            from: sendReportEmailDto.email,
            to: to ?? this.config.get("GOOGLE_GMAIL"),
            subject: `The Report of ${userRole} from MotoShare`,
            template: './reportEmail',
            context: {
                userName: sendReportEmailDto.userName,
                userEmail: sendReportEmailDto.email,
                subject: sendReportEmailDto.subject,
                content: sendReportEmailDto.content,
                submitTime: (0, toUTCPlusN_1.toUTCPlusN)(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET"))),
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                currentYear: ((0, toUTCPlusN_1.toUTCPlusN)(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(),
            },
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map