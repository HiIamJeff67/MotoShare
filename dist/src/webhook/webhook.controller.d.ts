import { Response } from 'express';
import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleStripeWebhook(signature: string, body: Buffer, res: Response): Promise<void>;
}
