import Stripe from 'stripe';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
export declare class RidderBankService {
    private config;
    private passengerNotification;
    private stripe;
    private db;
    constructor(config: ConfigService, passengerNotification: PassengerNotificationService, stripe: Stripe, db: DrizzleDB);
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
