import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { and, eq, lte, ne, or } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { RidderInviteTable } from '../drizzle/schema/ridderInvite.schema';
import { OrderTable } from '../drizzle/schema/order.schema';
import { ClientCreateHistoryException, ClientOrderNotFoundException } from '../exceptions';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { addDays } from '../utils/timeCalculator';

@Injectable()
export class CronService {
  constructor(
    private config: ConfigService, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Automated Update operations ================================= */
  async updateToExpiredPurchaseOrders() {
    return await this.db.update(PurchaseOrderTable).set({
      status: "EXPIRED", 
      updatedAt: new Date(), 
    }).where(and(
      eq(PurchaseOrderTable.status, "POSTED"), 
      lte(PurchaseOrderTable.startAfter, new Date()), 
    )).returning({
      id: PurchaseOrderTable.id, 
    });
  }

  async updateToExpiredSupplyOrders() {
    return await this.db.update(SupplyOrderTable).set({
      status: "EXPIRED", 
      updatedAt: new Date(), 
    }).where(and(
      eq(SupplyOrderTable.status, "POSTED"), 
      lte(SupplyOrderTable.startAfter, new Date()), 
    )).returning({
      id: SupplyOrderTable.id, 
    });
  }

  // but there's no "EXPIRED" status in invites, 
  // we just update them to "CANCEL"
  async updateToExpiredPassengerInvites() {
    return await this.db.update(PassengerInviteTable).set({
      status: "CANCEL", 
      updatedAt: new Date(), 
    }).where(and(
      eq(PassengerInviteTable.status, "CHECKING"), 
      lte(PassengerInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: PassengerInviteTable.id, 
    });
  }

  async updateToExpiredRidderInvites() {
    return await this.db.update(RidderInviteTable).set({
      status: "CANCEL", 
      updatedAt: new Date(), 
    }).where(and(
      eq(RidderInviteTable.status, "CHECKING"), 
      lte(RidderInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: RidderInviteTable.id, 
    });
  }

  async updateToStartedOrders() {
    return await this.db.update(OrderTable).set({
      passengerStatus: "STARTED", 
      ridderStatus: "STARTED", 
    }).where(and(
      eq(OrderTable.passengerStatus, "UNSTARTED"), 
      eq(OrderTable.ridderStatus, "UNSTARTED"), 
      lte(OrderTable.startAfter, new Date()), 
    )).returning({
      id: OrderTable.id, 
    });
  }
  /* ================================= Automated Update operations ================================= */


  /* ================================= Automated Delete operations ================================= */
  async deleteExpiredPurchaseOrders() {
    return await this.db.delete(PurchaseOrderTable)
      .where(and(
        eq(PurchaseOrderTable.status, "EXPIRED"), 
        lte(PurchaseOrderTable.endedAt, addDays(7)), 
      )).returning({
        id: PurchaseOrderTable.id, 
      });
  }

  async deleteExpiredSupplyOrders() {
    return await this.db.delete(SupplyOrderTable)
      .where(and(
        eq(SupplyOrderTable.status, "EXPIRED"), 
        lte(SupplyOrderTable.endedAt, addDays(7)), 
      )).returning({
        id: SupplyOrderTable.id, 
      });
  }

  async deleteExpiredPassengerInvites() {
    return await this.db.delete(PassengerInviteTable)
      .where(and(
        ne(PassengerInviteTable.status, "CHECKING"), 
        lte(PassengerInviteTable.suggestEndedAt, addDays(7)), 
      )).returning({
        id: PassengerInviteTable.id, 
      });
  }

  async deleteExpiredRidderInvites() {
    return await this.db.delete(RidderInviteTable)
      .where(and(
        ne(RidderInviteTable.status, "CHECKING"), 
        lte(RidderInviteTable.suggestEndedAt, addDays(7)), 
      )).returning({
        id: RidderInviteTable.id, 
      });
  }

  async deleteExpiredOrders() {
    return await this.db.transaction(async (tx) => {
      const responseOfDeletingOrders = await tx.delete(OrderTable)
      .where(and(
        ne(OrderTable.passengerStatus, "FINISHED"), 
        ne(OrderTable.ridderStatus, "FINISHED"), 
        lte(OrderTable.endedAt, new Date()), 
      )).returning({
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
      if (!responseOfDeletingOrders || responseOfDeletingOrders.length === 0) {
        throw ClientOrderNotFoundException;
      }

      const responseOfCreatingHistories = await tx.insert(HistoryTable).values({
        ridderId: responseOfDeletingOrders[0].ridderId,
        passengerId: responseOfDeletingOrders[0].passengerId,
        prevOrderId: responseOfDeletingOrders[0].prevOrderId,
        finalPrice: responseOfDeletingOrders[0].finalPrice,
        passengerDescription: responseOfDeletingOrders[0].passengerDescription, 
        ridderDescription: responseOfDeletingOrders[0].ridderDescription, 
        finalStartCord: responseOfDeletingOrders[0].finalStartCord,
        finalEndCord: responseOfDeletingOrders[0].finalEndCord,
        finalStartAddress: responseOfDeletingOrders[0].finalStartAddress,
        finalEndAddress: responseOfDeletingOrders[0].finalEndAddress,
        startAfter: responseOfDeletingOrders[0].startAfter,
        endedAt: responseOfDeletingOrders[0].endedAt,
        status: "EXPIRED",
      }).returning({
        historyId: HistoryTable.id,
        historyStatus: HistoryTable.status,
      });
      if (!responseOfCreatingHistories || responseOfCreatingHistories.length === 0) {
        throw ClientCreateHistoryException;
      }

      return [{
        ...responseOfCreatingHistories,
      }];
    });
  }
  /* ================================= Automated Delete operations ================================= */
}
