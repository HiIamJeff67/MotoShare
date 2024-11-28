import { CronService } from './cron.service';
import { Response } from 'express';
export declare class CronController {
    private readonly cronService;
    constructor(cronService: CronService);
    updateToExpiredPurchaseOrders(response: Response): Promise<void>;
    updateToExpiredSupplyOrders(response: Response): Promise<void>;
    updateToExpiredPassengerInvites(response: Response): Promise<void>;
    updateToExpiredRidderInvites(response: Response): Promise<void>;
    updateToStartedOrders(response: Response): Promise<void>;
    deleteExpiredPurchaseOrders(response: Response): Promise<void>;
    deleteExpiredSupplyOrders(response: Response): Promise<void>;
    deleteExpiredPassengerInvites(response: Response): Promise<void>;
    deleteExpiredRidderInvites(response: Response): Promise<void>;
    deleteExpiredOrders(response: Response): Promise<void>;
    test(response: Response): void;
}
