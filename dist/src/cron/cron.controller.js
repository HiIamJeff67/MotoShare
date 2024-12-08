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
let CronController = class CronController {
    constructor(cronService) {
        this.cronService = cronService;
    }
    async createPurchaseOrdersByPeriodicPurchaseOrders(response) {
        try {
            const res = await this.cronService.createPurchaseOrdersByPeriodicPurchaseOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfPeriodicPurchaseOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async createSupplyOrdersByPeriodicSupplyOrders(response) {
        try {
            const res = await this.cronService.createSupplyOrdersByPeriodicSupplyOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                numberOfPeriodicSupplyOrders: res.length,
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async createPeriodicCronJobsWorkflow(response) {
        try {
            const responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders = await this.cronService.createPurchaseOrdersByPeriodicPurchaseOrders();
            const responseOfCreatingSupplyOrdersByPeriodicSupplyOrders = await this.cronService.createSupplyOrdersByPeriodicSupplyOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                message: "All the specified Cron Jobs are done",
                jobs: {
                    createPurchaseOrdersByPeriodicPurchaseOrders: Boolean(responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders),
                    createSupplyOrdersByPeriodicSupplyOrders: Boolean(responseOfCreatingSupplyOrdersByPeriodicSupplyOrders),
                },
                dataCounts: {
                    numberOfPeriodicPurchaseOrders: responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders.length,
                    numberOfPeriodicSupplyOrders: responseOfCreatingSupplyOrdersByPeriodicSupplyOrders.length,
                },
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
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
    async updateCronJobsWorkflow(response) {
        try {
            const responseOfUpdatingToExpiredPurchaseOrders = await this.cronService.updateToExpiredPurchaseOrders();
            const responseOfUpdatingToExpiredSupplyOrders = await this.cronService.updateToExpiredSupplyOrders();
            const responseOfUpdatingToExpiredPassengerInvites = await this.cronService.updateToExpiredPassengerInvites();
            const responseOfUpdatingToExpiredRidderInvites = await this.cronService.updateToExpiredRidderInvites();
            const responseOfUpdatingToStatedOrders = await this.cronService.updateToStartedOrders();
            response.status(enums_1.HttpStatusCode.Ok).send({
                updatedAt: new Date(),
                message: "All the specified Cron Jobs are done",
                jobs: {
                    updateToExpiredPurchaseOrders: Boolean(responseOfUpdatingToExpiredPurchaseOrders),
                    updateToExpiredSupplyOrders: Boolean(responseOfUpdatingToExpiredSupplyOrders),
                    updateToExpiredPassengerInvites: Boolean(responseOfUpdatingToExpiredPassengerInvites),
                    updateToExpiredRidderInvites: Boolean(responseOfUpdatingToExpiredRidderInvites),
                    updateToStartedOrders: Boolean(responseOfUpdatingToStatedOrders),
                },
                dataCounts: {
                    numberOfExpiredPurchaseOrders: responseOfUpdatingToExpiredPurchaseOrders.length,
                    numberOfExpiredSupplyOrders: responseOfUpdatingToExpiredSupplyOrders.length,
                    numberOfExpiredPassengerInvites: responseOfUpdatingToExpiredPassengerInvites.length,
                    numberOfExpiredRidderInvites: responseOfUpdatingToExpiredRidderInvites.length,
                    numberOfStartedOrders: responseOfUpdatingToStatedOrders.length,
                },
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
    async deleteCronJobsWorkflow(response) {
        try {
            const responseOfDeletingExpiredPurchaseOrders = await this.cronService.deleteExpiredPurchaseOrders();
            const responseOfDeletingExpiredSupplyOrders = await this.cronService.deleteExpiredSupplyOrders();
            const responseOfDeletingExpiredPassengerInvites = await this.cronService.deleteExpiredPassengerInvites();
            const responseOfDeletingExpiredRidderInvites = await this.cronService.deleteExpiredRidderInvites();
            const responseOfDeletingExpiredOrders = await this.cronService.deleteExpiredOrders();
            const responseOfDeletingExpiredPassengerNotifications = await this.cronService.deleteExpiredPassengerNotifications();
            const responseOfDeletingExpiredRidderNotifications = await this.cronService.deleteExpiredRidderNotifications();
            response.status(enums_1.HttpStatusCode.Ok).send({
                deletedAt: new Date(),
                message: "All the specified Cron Jobs are done",
                jobs: {
                    deleteExpiredPurchaseOrders: Boolean(responseOfDeletingExpiredPurchaseOrders),
                    deleteExpiredSupplyOrders: Boolean(responseOfDeletingExpiredSupplyOrders),
                    deleteExpiredPassengerInvites: Boolean(responseOfDeletingExpiredPassengerInvites),
                    deleteExpiredRidderInvites: Boolean(responseOfDeletingExpiredRidderInvites),
                    deleteExpiredOrders: Boolean(responseOfDeletingExpiredOrders),
                    deleteExpiredPassengerNotifications: Boolean(responseOfDeletingExpiredPassengerNotifications),
                    deleteExpiredRidderNotifications: Boolean(responseOfDeletingExpiredRidderNotifications),
                },
                dataCount: {
                    numberOfExpiredPurchaseOrders: responseOfDeletingExpiredPurchaseOrders.length,
                    numberOfExpiredSupplyOrders: responseOfDeletingExpiredSupplyOrders.length,
                    numberOfExpiredPassengerInvites: responseOfDeletingExpiredPassengerInvites.length,
                    numberOfExpiredRidderInvites: responseOfDeletingExpiredRidderInvites.length,
                    numberOfStartedOrders: responseOfDeletingExpiredOrders.length,
                    numberOfExpiredPassengerNotifications: responseOfDeletingExpiredPassengerNotifications.length,
                    numberOfExpiredRidderNotifications: responseOfDeletingExpiredRidderNotifications.length,
                },
            });
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async mainCronJobWorkflowDaily(response) {
        try {
            await this.updateCronJobsWorkflow(response);
            await this.deleteCronJobsWorkflow(response);
        }
        catch (error) {
            response.status(error.status).send(error.response);
        }
    }
    async mainCronJobWorkflowWeekly(response) {
        try {
            await this.createPeriodicCronJobsWorkflow(response);
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
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "createPurchaseOrdersByPeriodicPurchaseOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "createSupplyOrdersByPeriodicSupplyOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "createPeriodicCronJobsWorkflow", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredPurchaseOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredSupplyOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredPassengerInvites", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToExpiredRidderInvites", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateToStartedOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "updateCronJobsWorkflow", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredPurchaseOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredSupplyOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredPassengerInvites", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredRidderInvites", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteExpiredOrders", null);
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "deleteCronJobsWorkflow", null);
__decorate([
    (0, common_1.Get)('mainCronJobWorkflowDaily'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "mainCronJobWorkflowDaily", null);
__decorate([
    (0, common_1.Get)('mainCronJobWorkflowWeekly'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronController.prototype, "mainCronJobWorkflowWeekly", null);
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