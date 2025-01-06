import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class RidderBankService {
    private stripe;
    private db;
    constructor(stripe: Stripe, db: DrizzleDB);
}
