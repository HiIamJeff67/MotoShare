import { CronService } from './cron.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class CronController {
    private readonly configService;
    private readonly cronService;
    constructor(configService: ConfigService, cronService: CronService);
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
