import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_API_VERSION, STRIPE_CLIENT, STRIPE_CURRENCY_TYPE } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerBankTable } from '../drizzle/schema/passengerBank.schema';
import { ConfigService } from '@nestjs/config';
import { ApiPaymentIntentNotFinishedException, ApiPrevOrderIdFormException, ClientCreateHistoryException, ClientCreatePassengerBankException, ClientCreateRidderNotificationException, ClientOrderNotFoundException, ClientPassengerBalanceNotEnoughException, ClientPassengerBankNotFoundException, ClientPurchaseOrderNotFoundException, ClientRidderBankNotFoundException, ClientSupplyOrderNotFoundException } from '../exceptions';
import { and, eq, gte, ne, or } from 'drizzle-orm';
import { OrderTable } from '../drizzle/schema/order.schema';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { NotificationTemplateOfCreatingHistory } from '../notification/notificationTemplate';
import { RidderBankTable } from '../drizzle/schema/ridderBank.schema';

@Injectable()
export class PassengerBankService {
  constructor(
    private config: ConfigService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  private async listStripeCostomers() {
    return this.stripe.customers.list();
  }

  /* ================================= Create PaymentIntent operation ================================= */
  private async _createPaymentIntentForAddingBalanceByUserId(
    userId: string, 
    userName: string, 
    email: string, 
    amount: number, 
  ) {
    const responseOfSelectingPassengerBank = await this.db.select({
      customerId: PassengerBankTable.customerId, 
    }).from(PassengerBankTable)
      .where(eq(PassengerBankTable.userId, userId))
      .limit(1);
    let customerId: string | null = null;
    if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
      const customer = await this.stripe.customers.create({
        metadata: {
          userName: userName, 
          email: email, 
          userRole: "Passenger", 
        }
      });
      customerId = customer.id;

      const responseOfCreatingPassengerBank = await this.db.insert(PassengerBankTable).values({
        customerId: customer.id, 
        userId: userId, 
      }).returning({
        balance: PassengerBankTable.balance, 
      });
      if (!responseOfCreatingPassengerBank || responseOfCreatingPassengerBank.length === 0) {
        throw ClientCreatePassengerBankException;
      }
    } else {
      customerId = responseOfSelectingPassengerBank[0].customerId;
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
        userRole: "Passenger", 
      }
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: this.config.get("STRIPE_PK_API_KEY"), 
    };
  }
  /* ================================= Create PaymentIntent operation ================================= */
  

  /* ================================= Force to Finish Order by PaymentIntent operation ================================= */
  private async _payToFinishOrderById( // transaction on passengerBank or ridderBank, not on the stripe
    id: string, 
    userId: string, // decreasing the balance of the passenger, and increasing the balance of the ridder
    userName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      // finish the order, and also get the infomation of the ridder
      // since the order will finish directly, so we can just delete it
      // and make a history of it as we done in order.service
      const responseOfDeletingOrder = await tx.delete(OrderTable)
        .where(and(
          eq(OrderTable.id, id), 
          eq(OrderTable.passengerStatus, "UNPAID"), 
          eq(OrderTable.ridderStatus, "UNPAID"), 
        ))
        .returning({
          passengerId: OrderTable.passengerId,
          ridderId: OrderTable.ridderId,
          prevOrderId: OrderTable.prevOrderId,
          finalPrice: OrderTable.finalPrice,
          passengerDescription: OrderTable.passengerDescription, 
          ridderDescription: OrderTable.ridderDescription, 
          finalStartCord: OrderTable.finalStartCord,
          finalEndCord: OrderTable.finalEndCord,
          finalStartAddress: OrderTable.finalStartAddress,
          finalEndAddress: OrderTable.finalEndAddress,
          startAfter: OrderTable.startAfter,
          endedAt: OrderTable.endedAt,
        });
      if (!responseOfDeletingOrder || responseOfDeletingOrder.length === 0) {
        throw ClientOrderNotFoundException;
      }

      // also delete the previous purchaseOrder or supplyOrder
      const prevOrderData = responseOfDeletingOrder[0].prevOrderId.split(" ");
      if (!prevOrderData || prevOrderData.length !== 2) {
        throw ApiPrevOrderIdFormException;
      }
      const [type, prevOrderId] = prevOrderData;
      if (type === "PurchaseOrder") {
        const responseOfDeletingPurchaseOrder = await tx.delete(PurchaseOrderTable)
          .where(eq(PurchaseOrderTable.id, prevOrderId))
          .returning({
            id: PurchaseOrderTable.id,
          });
        if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
          throw ClientPurchaseOrderNotFoundException;
        }
      } else if (type === "SupplyOrder") {
        const responseOfDeletingSupplyOrder = await tx.delete(SupplyOrderTable)
          .where(eq(SupplyOrderTable.id, prevOrderId ))
          .returning({
            id: SupplyOrderTable.id,
          });
        if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
          throw ClientSupplyOrderNotFoundException;
        }
      } else {
        throw ApiPrevOrderIdFormException;
      }

      // then create a history
      const responseOfCreatingHistory = await tx.insert(HistoryTable).values({
        ridderId: responseOfDeletingOrder[0].ridderId,
        passengerId: responseOfDeletingOrder[0].passengerId,
        prevOrderId: responseOfDeletingOrder[0].prevOrderId,
        finalPrice: responseOfDeletingOrder[0].finalPrice,
        passengerDescription: responseOfDeletingOrder[0].passengerDescription, 
        ridderDescription: responseOfDeletingOrder[0].ridderDescription, 
        finalStartCord: responseOfDeletingOrder[0].finalStartCord,
        finalEndCord: responseOfDeletingOrder[0].finalEndCord,
        finalStartAddress: responseOfDeletingOrder[0].finalStartAddress,
        finalEndAddress: responseOfDeletingOrder[0].finalEndAddress,
        startAfter: responseOfDeletingOrder[0].startAfter,
        endedAt: responseOfDeletingOrder[0].endedAt,
        status: "FINISHED",
      }).returning({
        historId: HistoryTable.id, 
        historyStatus: HistoryTable.status,  
      });
      if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
        throw ClientCreateHistoryException;
      }

      // last but not least, notify the ridder if he is online
      const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
        NotificationTemplateOfCreatingHistory(
          userName, 
          responseOfDeletingOrder[0].ridderId, 
          responseOfCreatingHistory[0].historId, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
      }

      // decreasing the balance of the passenger
      const responseOfSelectingPassengerBank = await tx.select({
        balance: PassengerBankTable.balance, 
      }).from(PassengerBankTable)
        .where(eq(PassengerBankTable.userId, userId))
        .limit(1);
      if (!responseOfSelectingPassengerBank || responseOfSelectingPassengerBank.length === 0) {
        throw ClientPassengerBankNotFoundException;
      }
      if (responseOfSelectingPassengerBank[0].balance < responseOfDeletingOrder[0].finalPrice) {
        throw ClientPassengerBalanceNotEnoughException;
      }

      const newPassengerBalance = responseOfSelectingPassengerBank[0].balance - responseOfDeletingOrder[0].finalPrice;
      const responseOfDecreasingPassengerBank = await tx.update(PassengerBankTable).set({
        balance: newPassengerBalance, 
        updatedAt: new Date(), 
      }).where(eq(PassengerBankTable.userId, userId))
        .returning({
          balance: PassengerBankTable.balance, 
        });
      if (!responseOfDecreasingPassengerBank || responseOfDecreasingPassengerBank.length === 0) {
        throw ApiPaymentIntentNotFinishedException;
      }

      // increasing the balance of the ridder
      const responseOfSelectingRidderBank = await tx.select({
        balance: RidderBankTable.balance, 
      }).from(RidderBankTable)
        .where(eq(RidderBankTable.userId, responseOfDeletingOrder[0].ridderId));
      if (!responseOfSelectingRidderBank || responseOfSelectingRidderBank.length === 0) {
        throw ClientRidderBankNotFoundException;
      }
      
      const newRidderBalance = responseOfSelectingRidderBank[0].balance + responseOfDeletingOrder[0].finalPrice;
      const responseOfIncreasingRidderBank = await tx.update(RidderBankTable).set({
        balance: newRidderBalance, 
        updatedAt: new Date(), 
      }).where(eq(RidderBankTable.userId, responseOfDeletingOrder[0].ridderId))
        .returning({
          balance: RidderBankTable.balance, 
        });
      if (!responseOfIncreasingRidderBank || responseOfIncreasingRidderBank.length === 0) {
        throw ApiPaymentIntentNotFinishedException;
      }

      return [{
        userBalance: responseOfDecreasingPassengerBank[0].balance, 
      }];
    });
  }
  /* ================================= Force to Finish Order by PaymentIntent operation ================================= */


  /* ================================= Get operation(public) ================================= */
  async getMyBalacne(
    userId: string, 
  ) {
    return await this.db.select({
      balance: PassengerBankTable.balance, 
    }).from(PassengerBankTable)
      .where(eq(PassengerBankTable.userId, userId))
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

  async payToFinishOrderById(
    id: string, 
    userId: string, 
    userName: string, 
  ) {
    return this._payToFinishOrderById(id, userId, userName);
  }
  /* ================================= Public Payment operation ================================= */
}
