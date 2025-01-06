import { Inject, Injectable } from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { StrictUserRoleType } from '../types';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';
import { and, eq, sql } from 'drizzle-orm';
import { ApiEndpointEnvVarNotFoundException, ApiStripeWebhookUnhandleExcpetion, ApiWrongWebhookSignatureException, ClientCreatePassengerBankException, ClientCreateRidderBankException, ClientPassengerBankNotFoundException, ClientRidderBankNotFoundException } from '../exceptions';
import { RidderBankTable } from '../drizzle/schema/ridderBank.schema';
import { Request } from 'express';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Receive Stripe operation ================================= */
  async receiveSucceededStripePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    const userRole = paymentIntent.metadata.userRole as StrictUserRoleType;
    const userId = paymentIntent.metadata.userId as string;
    const amount = paymentIntent.amount;
    const customerId = paymentIntent.customer as string;

    let response: any = undefined;
    switch(userRole) {
      case "Passenger":
        response = await this._updatePassengerBank(customerId, userId, amount);
        break;
      case "Ridder":
        response = this._updateRidderBank(customerId, userId, amount);
        break;
    }

    return response;
  }
  /* ================================= Receive Stripe operation ================================= */


  /* ================================= Update Database operation ================================= */
  private async _updatePassengerBank(
    customerId: string, 
    userId: string, 
    amount: number, 
  ) {
    return await this.db.transaction(async (tx) => {
      let responseOfSelectingPassengerBank: any = await tx.select({
        balance: PassengerBankTable.balance, 
      }).from(PassengerBankTable)
        .where(and(
          eq(PassengerBankTable.customerId, customerId), 
          eq(PassengerBankTable.userId, userId), 
        ));
      if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
        const responseOfCreatingPassengerBank = await tx.insert(PassengerBankTable).values({
          customerId: customerId, 
          userId: userId, 
          balance: amount, 
        }).returning({
          balance: PassengerBankTable.balance, 
        });
        if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
          throw ClientCreatePassengerBankException;
        }
        responseOfSelectingPassengerBank = responseOfCreatingPassengerBank;
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
    userId: string, 
    amount: number, 
  ) {
    return await this.db.transaction(async (tx) => {
      let responseOfSelectingRidderBank: any = await tx.select({
        balance: RidderBankTable.balance, 
      }).from(RidderBankTable)
        .where(and(
          eq(RidderBankTable.customerId, customerId), 
          eq(RidderBankTable.userId, userId), 
        ));
      if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
          const responseOfCreatingRidderBank = await tx.insert(RidderBankTable).values({
            customerId: customerId, 
            userId: userId, 
            balance: amount, 
          }).returning({
            balance: RidderBankTable.balance, 
          });
          if (!responseOfCreatingRidderBank || responseOfCreatingRidderBank.length === 0) {
            throw ClientCreateRidderBankException;
          }
          responseOfSelectingRidderBank = responseOfCreatingRidderBank;
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
        throw ApiStripeWebhookUnhandleExcpetion;
    }

    return response;
  }
  /* ================================= Handle Webhook operation ================================= */
}
