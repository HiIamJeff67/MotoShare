import { CronService } from './cron.service';
import { Response } from 'express';
export declare class CronController {
    private readonly cronService;
    constructor(cronService: CronService);
    private createPurchaseOrdersByPeriodicPurchaseOrders;
    private createSupplyOrdersByPeriodicSupplyOrders;
    private createPeriodicCronJobsWorkflow;
    private updateToExpiredPurchaseOrders;
    private updateToExpiredSupplyOrders;
    private updateToExpiredPassengerInvites;
    private updateToExpiredRidderInvites;
    private updateToStartedOrders;
    private updateCronJobsWorkflow;
    private deleteExpiredPurchaseOrders;
    private deleteExpiredSupplyOrders;
    private deleteExpiredPassengerInvites;
    private deleteExpiredRidderInvites;
    private deleteExpiredOrders;
    private deleteCronJobsWorkflow;
    mainCronJobWorkflowDaily(response: Response): Promise<void>;
    mainCronJobWorkflowWeekly(response: Response): Promise<void>;
    test(response: Response): void;
}
