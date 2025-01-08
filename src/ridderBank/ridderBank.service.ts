import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_API_VERSION, STRIPE_CLIENT, STRIPE_CURRENCY_TYPE } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { ConfigService } from '@nestjs/config';
import { RidderBankTable } from '../drizzle/schema/ridderBank.schema';
import { and, eq, ne, or } from 'drizzle-orm';
import { ApiPaymentIntentNotFinishedException, ApiPrevOrderIdFormException, ClientCreateHistoryException, ClientCreateRidderBankException, ClientCreateRidderNotificationException, ClientOrderNotFoundException, ClientPurchaseOrderNotFoundException, ClientRidderBalanceNotEnoughtException, ClientRidderBankNotFoundException, ClientSupplyOrderNotFoundException } from '../exceptions';
import { OrderTable } from '../drizzle/schema/order.schema';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { NotificationTemplateOfCreatingHistory } from '../notification/notificationTemplate';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';

@Injectable()
export class RidderBankService {
  constructor(
    private config: ConfigService, 
    private passengerNotification: PassengerNotificationService, 
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Create PaymentIntent operation ================================= */
  private async _createPaymentIntentForAddingBalanceByUserId(
    userId: string, 
    userName: string, 
    email: string, 
    amount: number, 
  ) {
    const responseOfSelectingRidderBank = await this.db.select({
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

      const responseOfCreatingRidderBank = await this.db.insert(RidderBankTable).values({
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
      amount: amount, 
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
  }
  /* ================================= Create PaymentIntent operation ================================= */


  /* ================================= Get operation(public) ================================= */
  async getMyBalacne(
    userId: string, 
  ) {
    return await this.db.select({
      balance: RidderBankTable.balance, 
    }).from(RidderBankTable)
      .where(eq(RidderBankTable.userId, userId))
      .limit(1);
  }
  /* ================================= Get operation(public) ================================= */


  /* ================================= Public Payment operation ================================= */
  async createPaymentIntentForAddingBalance(
    userId: string, 
    userName: string, 
    email: string, 
    amount: number, 
  ) {
    return this._createPaymentIntentForAddingBalanceByUserId(userId, userName, email, amount);
  }
  /* ================================= Public Payment operation ================================= */
}
