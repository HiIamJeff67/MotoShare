import { Inject, Injectable } from '@nestjs/common';
import { CreatePassengerBankDto } from './dto/create-passengerBank.dto';
import { UpdatePassengerBankDto } from './dto/update-passengerBank.dto';
import { STRIPE_CLIENT } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';
import { ConfigService } from '@nestjs/config';
import { ClientCreatePassengerBankException, ClientPassengerBankNotFoundException } from '../exceptions';
import { eq } from 'drizzle-orm';

@Injectable()
export class PassengerBankService {
  constructor(
    private config: ConfigService, 
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  async listStripeCostomers() {
    return this.stripe.customers.list();
  }

  async getPassengerBankByUserId(
    userId: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingPassengerBank = await tx.select({
        customerId: PassengerBankTable.customerId, 
      }).from(PassengerBankTable)
        .where(eq(PassengerBankTable.userId, userId))
        .limit(1);
      if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {

        const customer = await this.stripe.customers.create();
        const ephemeralKey = await this.stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: '2024-12-18.acacia' }
        );
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: 100 * 100,
          currency: 'usd',
          customer: customer.id,
          automatic_payment_methods: {
            enabled: true,
          },
        });

        const responseOfCreatingPassengerBank = await tx.insert(PassengerBankTable).values({
          customerId: customer.id, 
          userId: userId, 
        }).returning({
          balance: PassengerBankTable.balance, 
        });
        if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
          throw ClientCreatePassengerBankException;
        }

        return {
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey: this.config.get("STRIPE_PK_API_KEY"), 
        };
      }

      return responseOfSelectingPassengerBank;
    });
  }
}
