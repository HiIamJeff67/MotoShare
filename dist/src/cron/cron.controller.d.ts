import { CronService } from './cron.service';
import { Response } from 'express';
export declare class CronController {
    private readonly cronService;
    constructor(cronService: CronService);
    test(response: Response): void;
}
