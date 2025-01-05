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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const enums_1 = require("../enums");
const guard_1 = require("../auth/guard");
const send_reportEmail_dto_1 = require("./dto/send-reportEmail.dto");
let EmailController = class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendPassengerReportEmailToDeveloper(sendReportEmailDto, response) {
        try {
            const res = await this.emailService.sendReportEmailToDeveloper("Passenger", sendReportEmailDto);
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error.status).send(error);
        }
    }
    async sendRidderReportEmailToDeveloper(sendReportEmailDto, response) {
        try {
            const res = await this.emailService.sendReportEmailToDeveloper("Ridder", sendReportEmailDto);
            response.status(enums_1.HttpStatusCode.Ok).send(res);
        }
        catch (error) {
            response.status(error.status).send(error);
        }
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtPassengerGuard),
    (0, common_1.Post)('passenger/sendReportEmailToDeveloper'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_reportEmail_dto_1.SendReportEmailDto, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendPassengerReportEmailToDeveloper", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.JwtRidderGuard),
    (0, common_1.Post)('ridder/sendReportEmailToDeveloper'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_reportEmail_dto_1.SendReportEmailDto, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendRidderReportEmailToDeveloper", null);
exports.EmailController = EmailController = __decorate([
    (0, common_1.Controller)('/email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
;
//# sourceMappingURL=email.controller.js.map