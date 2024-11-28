import { CronService } from './cron.service';
import { Response } from 'express';
export declare class CronController {
    private readonly cronService;
    constructor(cronService: CronService);
    private updateToExpiredPurchaseOrders;
    private updateToExpiredSupplyOrders;
    private updateToExpiredPassengerInvites;
    private updateToExpiredRidderInvites;
    private updateToStartedOrders;
    updateCronJobsWorkflow(response: Response): Promise<void>;
    private deleteExpiredPurchaseOrders;
    private deleteExpiredSupplyOrders;
    private deleteExpiredPassengerInvites;
    private deleteExpiredRidderInvites;
    private deleteExpiredOrders;
    deleteCronJobsWorkflow(response: Response): Promise<void>;
    test(response: Response): void;
}
