import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerBankService {
    private stripe;
    private db;
    constructor(stripe: Stripe, db: DrizzleDB);
    listStripeCostomers(): Promise<Stripe.Response<Stripe.ApiList<Stripe.Customer>>>;
}
