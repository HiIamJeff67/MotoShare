import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { RidderNotificationService } from '../notification/ridderNotification.service';
export declare class PassengerBankService {
    private config;
    private ridderNotification;
    private stripe;
    private db;
    constructor(config: ConfigService, ridderNotification: RidderNotificationService, stripe: Stripe, db: DrizzleDB);
    private listStripeCostomers;
    private _createPaymentIntentForAddingBalanceByUserId;
    private _payToFinishOrderById;
    getMyBalacne(userId: string): Promise<{
        balance: number;
    }[]>;
    createPaymentIntentForAddingBalance(userId: string, userName: string, email: string, amount: number): Promise<{
        paymentIntent: string | null;
        ephemeralKey: string | undefined;
        customer: string;
        publishableKey: any;
    }>;
    payToFinishOrderById(userId: string, userName: string, email: string, amount: number): Promise<{
        userBalance: number;
    }[]>;
}
