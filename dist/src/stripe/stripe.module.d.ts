import { DynamicModule } from '@nestjs/common';
import Stripe from 'stripe';
export declare class StripeModule {
    static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule;
}
