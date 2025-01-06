import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class WebhookService {
    private stripe;
    private db;
    constructor(stripe: Stripe, db: DrizzleDB);
    receiveSucceededStripePaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<any>;
    private _updatePassengerBank;
    private _updateRidderBank;
    handleStripeWebhook(buffer: Buffer, signature: string): Promise<any>;
}
