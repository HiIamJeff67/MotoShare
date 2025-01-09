import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT, STRIPE_CURRENCY_TYPE } from '../stripe/constants';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { StrictUserRoleType } from '../types';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';
import { and, eq, sql } from 'drizzle-orm';
import { ApiEndpointEnvVarNotFoundException, ApiStripeWebhookUnhandleExcpetion, ApiWrongWebhookSignatureException, ClientCreatePassengerBankException, ClientCreateRidderBankException, ClientPassengerBankNotFoundException, ClientRidderBankNotFoundException, ServerStripeSpecifiedUnDefinedTypesException } from '../exceptions';
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
    const userName = paymentIntent.metadata.userName as string;
    const email = paymentIntent.metadata.email as string;
    const paymentIntentId = paymentIntent.id as string;
    const customerId = paymentIntent.customer as string;
    const amount = paymentIntent.amount;

    let response: any = undefined;
    switch(userRole) {
      case "Passenger":
        response = await this._updatePassengerBank(customerId, amount);
        break;
      case "Ridder":
        response = this._updateRidderBank(customerId, amount);
        break;
      default:
        throw ServerStripeSpecifiedUnDefinedTypesException;
    }

    // the below condidtion means there's error on either case of "Passenger" or case of "Ridder"
    if (!response) {
      response = await this._refundPaymentIntentToUser(
        userRole, 
        userName, 
        email, 
        paymentIntentId, 
        amount, 
      );
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
      const responseOfSelectingPassengerBank: any = await tx.select({
        balance: PassengerBankTable.balance, 
      }).from(PassengerBankTable)
        .where(eq(PassengerBankTable.customerId, customerId));

      if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
        throw ClientPassengerBankNotFoundException;
      }

      const currentBalance = responseOfSelectingPassengerBank[0].balance;
      const newBalance = currentBalance + amount;

      return await tx.update(PassengerBankTable).set({
        balance: newBalance,
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
      const responseOfSelectingRidderBank: any = await tx.select({
        balance: RidderBankTable.balance, 
      }).from(RidderBankTable)
        .where(eq(RidderBankTable.customerId, customerId));

      if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
        throw ClientRidderBankNotFoundException;
      }

      const currentBalance = responseOfSelectingRidderBank[0].balance;
      const newBalance = currentBalance + amount;

      return await tx.update(RidderBankTable).set({
        balance: newBalance,
        updatedAt: new Date(), 
      }).where(eq(RidderBankTable.customerId, customerId))
        .returning({
          balance: RidderBankTable.balance, 
        });
    });
  }
  /* ================================= Update Database operation ================================= */


  /* ================================= Refund back to Stripe operation ================================= */
  private async _refundPaymentIntentToUser(
    userRole: string, 
    userName: string, 
    email: string, 
    paymentIntentId: string, 
    amount: number, 
  ) {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId, 
      currency: STRIPE_CURRENCY_TYPE, 
      amount: amount, 
      metadata: {
        userName: userName, 
        email: email, 
        userRole: userRole, 
      }
    });
  }
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
      case 'payment_intent.payment_failed':

        break;
      default:
        throw ApiStripeWebhookUnhandleExcpetion;
    }

    return response;
  }
  /* ================================= Handle Webhook operation ================================= */
}
