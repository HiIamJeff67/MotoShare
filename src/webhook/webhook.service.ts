import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { StrictUserRoleType } from '../types';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';
import { and, eq, sql } from 'drizzle-orm';
import { ApiEndpointEnvVarNotFoundException, ApiStripeWebhookUnhandleExcpetion, ApiWrongWebhookSignatureException, ClientCreatePassengerBankException, ClientCreateRidderBankException, ClientPassengerBankNotFoundException, ClientRidderBankNotFoundException } from '../exceptions';
import { RidderBankTable } from '../drizzle/schema/ridderBank.schema';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Receive Stripe operation ================================= */
  async receiveSucceededStripePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    const userRole = paymentIntent.metadata.userRole as StrictUserRoleType;
    const amount = paymentIntent.amount;
    const customerId = paymentIntent.customer as string;

    let response: any = undefined;
    switch(userRole) {
      case "Passenger":
        response = await this._updatePassengerBank(customerId, amount);
        break;
      case "Ridder":
        response = this._updateRidderBank(customerId, amount);
        break;
    }

    return response;
  }
  /* ================================= Receive Stripe operation ================================= */


  /* ================================= Update Database operation ================================= */
  private async _updatePassengerBank(
    customerId: string, 
    amount: number, 
  ) {
    return await this.db.transaction(async (tx) => {
      let responseOfSelectingPassengerBank: any = await tx.select({
        balance: PassengerBankTable.balance, 
      }).from(PassengerBankTable)
        .where(eq(PassengerBankTable.customerId, customerId));
      if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
        throw ClientPassengerBankNotFoundException;
      }

      return await tx.update(PassengerBankTable).set({
        balance: sql`${responseOfSelectingPassengerBank[0].balance} + ${amount}`, 
        updatedAt: new Date(), 
      }).where(eq(PassengerBankTable.customerId, customerId))
        .returning({
          balance: PassengerBankTable.balance, 
        });
    });
  }

  private async _updateRidderBank(
    customerId: string, 
    amount: number, 
  ) {
    return await this.db.transaction(async (tx) => {
      let responseOfSelectingRidderBank: any = await tx.select({
        balance: RidderBankTable.balance, 
      }).from(RidderBankTable)
        .where(eq(RidderBankTable.customerId, customerId));
      if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
          throw ClientRidderBankNotFoundException;
      }

      return await tx.update(RidderBankTable).set({
        balance: responseOfSelectingRidderBank[0].balance + amount, 
        updatedAt: new Date(), 
      }).where(eq(RidderBankTable.customerId, customerId))
        .returning({
          balance: RidderBankTable.balance, 
        });
    });
  }
  /* ================================= Update Database operation ================================= */


  /* ================================= Refund back to Stripe operation ================================= */
  /* ================================= Refund back to Stripe operation ================================= */


  /* ================================= Handle Webhook operation ================================= */
  async handleStripeWebhook(body: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) throw ApiEndpointEnvVarNotFoundException;

    const event = this.stripe.webhooks.constructEvent(
      body, 
      signature,
      endpointSecret,
    );

    let response: any = undefined;
    switch (event.type) {
      case 'payment_intent.succeeded':
        response = await this.receiveSucceededStripePaymentIntent(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        throw new Error(event.type + "\n" + String(event));
        throw ApiStripeWebhookUnhandleExcpetion;
    }

    return response;
  }
  /* ================================= Handle Webhook operation ================================= */
}
