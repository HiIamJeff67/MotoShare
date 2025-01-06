import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
export declare class PassengerBankService {
    private config;
    private stripe;
    private db;
    constructor(config: ConfigService, stripe: Stripe, db: DrizzleDB);
    listStripeCostomers(): Promise<Stripe.Response<Stripe.ApiList<Stripe.Customer>>>;
    getPassengerBankByUserId(userId: string): Promise<{
        paymentIntent: string | null;
        ephemeralKey: string | undefined;
        customer: string;
        publishableKey: any;
    }>;
}
