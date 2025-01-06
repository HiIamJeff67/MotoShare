import { Response } from 'express';
import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleStripeWebhook(buffer: Buffer, response: Response, signature: string): Promise<void>;
}
