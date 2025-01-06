import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { Request } from 'express';
export declare class WebhookService {
    private stripe;
    private db;
    constructor(stripe: Stripe, db: DrizzleDB);
    receiveSucceededStripePaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<any>;
    private _updatePassengerBank;
    private _updateRidderBank;
    handleStripeWebhook(request: Request, signature: string): Promise<any>;
}
