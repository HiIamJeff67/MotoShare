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
exports.CronController = void 0;
const common_1 = require("@nestjs/common");
const cron_service_1 = require("./cron.service");
const enums_1 = require("../enums");
const cronAuth_decorator_1 = require("../decorators/cronAuth.decorator");
let CronController = class CronController {
    constructor(cronService) {
        this.cronService = cronService;
    }
    async updateToExpiredPurchaseOrders(response) {
        try {
            const res = await this.cronService.updateToExpiredPurchaseOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfExpiredPurchaseOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async updateToExpiredSupplyOrders(response) {
        try {
            const res = await this.cronService.updateToExpiredSupplyOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfExpiredSupplyOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async updateToExpiredPassengerInvites(response) {
        try {
            const res = await this.cronService.updateToExpiredPassengerInvites();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfExpiredPassengerInvites: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async updateToExpiredRidderInvites(response) {
        try {
            const res = await this.cronService.updateToExpiredRidderInvites();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfExpiredRidderInvites: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async updateToStartedOrders(response) {
        try {
            const res = await this.cronService.updateToStartedOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfStartedOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async deleteExpiredPurchaseOrders(response) {
        try {
            const res = await this.cronService.deleteExpiredPurchaseOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                numberOfDeletedPurchaseOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async deleteExpiredSupplyOrders(response) {
        try {
            const res = await this.cronService.deleteExpiredSupplyOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                numberOfDeletedSupplyOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async deleteExpiredPassengerInvites(response) {
        try {
            const res = await this.cronService.deleteExpiredPassengerInvites();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfDeletedPassengerInvites: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async deleteExpiredRidderInvites(response) {
        try {
            const res = await this.cronService.deleteExpiredRidderInvites();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfDeletedRidderInvites: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async deleteExpiredOrders(response) {
        try {
            const res = await this.cronService.deleteExpiredOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfDeletedOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    test(response) {
        response.status(200).send({ context: "Hello Vercel Cron" });
    }
};
exports.CronController = CronController;
__decorate([
    (0, common_1.Get)('/updateToExpiredPurchaseOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('/updateToExpiredSupplyOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredSupplyOrders", null);
__decorate([
    (0, common_1.Get)('/updateToExpiredPassengerInvites'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredPassengerInvites", null);
__decorate([
    (0, common_1.Get)('/updateToExpiredRidderInvites'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredRidderInvites", null);
__decorate([
    (0, common_1.Get)('/updateToStartedOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToStartedOrders", null);
__decorate([
    (0, common_1.Get)('/deleteExpiredPurchaseOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('/deleteExpiredSupplyOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredSupplyOrders", null);
__decorate([
    (0, common_1.Get)('/deleteExpiredPassengerInvites'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredPassengerInvites", null);
__decorate([
    (0, common_1.Get)('/deleteExpiredRidderInvites'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredRidderInvites", null);
__decorate([
    (0, common_1.Get)('/deleteExpiredOrders'),
    (0, cronAuth_decorator_1.CronAuth)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredOrders", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "test", null);
exports.CronController = CronController = __decorate([
    (0, common_1.Controller)('api/cron'),
    __metadata("design:paramtypes", [cron_service_1.CronService])
], CronController);
//# sourceMappingURL=cron.controller.js.map