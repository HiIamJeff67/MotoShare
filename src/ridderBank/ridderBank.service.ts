import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_API_VERSION, STRIPE_CLIENT, STRIPE_CURRENCY_TYPE } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { RidderBankTable } from '../drizzle/schema/ridderBank.schema';
import { eq } from 'drizzle-orm';
import { ClientCreateRidderBankException } from '../exceptions';

@Injectable()
export class RidderBankService {
  constructor(
    private config: ConfigService, 
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Get & Create operation ================================= */
  async getRidderBankByUserId(
    userId: string, 
    userName: string, 
    email: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingRidderBank = await tx.select({
        customerId: RidderBankTable.customerId, 
      }).from(RidderBankTable)
        .where(eq(RidderBankTable.userId, userId))
        .limit(1);
      let customerId: string | null = null;
      if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
        const customer = await this.stripe.customers.create({
          metadata: {
            userName: userName, 
            email: email, 
            userRole: "Ridder", 
          }
        });
        customerId = customer.id;

        const responseOfCreatingRidderBank = await tx.insert(RidderBankTable).values({
          customerId: customer.id, 
          userId: userId, 
        }).returning({
          balance: RidderBankTable.balance, 
        });
        if (!responseOfCreatingRidderBank || responseOfCreatingRidderBank.length === 0) {
          throw ClientCreateRidderBankException;
        }
      } else {
        customerId = responseOfSelectingRidderBank[0].customerId;
      }

      const ephemeralKey = await this.stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion: STRIPE_API_VERSION }
      );
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 100 * 100,
        currency: STRIPE_CURRENCY_TYPE, 
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userName: userName, 
          email: email, 
          userRole: "Ridder", 
        }
      });

      return {
        paymentIntent: paymentIntent.client_secret, 
        ephemeralKey: ephemeralKey.secret, 
        customer: customerId, 
        publishableKey: this.config.get("STRIPE_PK_API_KEY"), 
      }
    });
  }
  /* ================================= Get & Create operation ================================= */


  /* ================================= Force to Finish Order by Stripe Pay operation ================================= */
  
  /* ================================= Force to Finish Order by Stripe Pay operation ================================= */
}
