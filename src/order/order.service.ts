import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { and, desc, eq, ne, or } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { OrderTable } from '../drizzle/schema/order.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { 
  ApiPrevOrderIdFormException, 
  ClientCreateHistoryException, 
  ClientOrderNotFoundException, 
  ClientPurchaseOrderNotFoundException, 
  ClientSupplyOrderNotFoundException ,
} from '../exceptions';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { HistoryTable } from '../drizzle/schema/history.schema';

@Injectable()
export class OrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Get operations ================================= */
  private async getOrderStatusById(id: string) {
    return await this.db.select({
      passengerStatus: OrderTable.passengerStatus,
      ridderStatus: OrderTable.ridderStatus,
    }).from(OrderTable)
      .where(eq(OrderTable.id, id));
  }

  async getOrderById(id: string, userId: string) {
    return await this.db.select({
      id: OrderTable.id,
      passengerName: PassengerTable.userName,
      ridderName: RidderTable.userName,
      finalPrice: OrderTable.finalPrice,
      passengerDescription: OrderTable.passengerDescription, 
      ridderDescription: OrderTable.ridderDescription, 
      finalStartCord: OrderTable.finalStartCord,
      finalEndCord: OrderTable.finalEndCord,
      finalStartAddress: OrderTable.finalStartAddress,
      finalEndAddress: OrderTable.finalEndAddress,
      startAfter: OrderTable.startAfter,
      endedAt: OrderTable.endedAt,
      passengerStatus: OrderTable.passengerStatus,
      ridderStatus: OrderTable.ridderStatus,
      passengerAvatorUrl: PassengerInfoTable.avatorUrl,
      ridderAvatorUrl: RidderInfoTable.avatorUrl,
      passengerPhoneNumber: PassengerInfoTable.phoneNumber,
      ridderPhoneNumber: RidderInfoTable.phoneNumber,
      motocycleType: RidderInfoTable.motocycleType,
      motocycleLicense: RidderInfoTable.motocycleLicense,
      motocyclePhotoUrl: RidderInfoTable.motocyclePhotoUrl,
      createdAt: OrderTable.createdAt,
      updatedAt: OrderTable.updatedAt,
    }).from(OrderTable)
      .where(and(
        eq(OrderTable.id, id),
        or(
          eq(OrderTable.passengerId, userId),
          eq(OrderTable.ridderId, userId),
        )
      ))
      .leftJoin(PassengerTable, eq(PassengerTable.id, OrderTable.passengerId))
      .leftJoin(RidderTable, eq(RidderTable.id, OrderTable.ridderId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, OrderTable.passengerId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, OrderTable.ridderId));
  }

  /* ================= Search operations ================= */
  async searchPaginationOrderByPassengerId(
    passengerId: string,
    ridderName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    const query = this.db.select({
      id: OrderTable.id,
      ridderName: RidderTable.userName,
      finalStartCord: OrderTable.finalStartCord,
      finalEndCord: OrderTable.finalEndCord,
      finalStartAddress: OrderTable.finalStartAddress,
      finalEndAddress: OrderTable.finalEndAddress,
      ridderAvatorUrl: RidderInfoTable.avatorUrl,
      finalPrice: OrderTable.finalPrice,
      startAfter: OrderTable.startAfter,
      endedAt: OrderTable.endedAt,
      createdAt: OrderTable.createdAt,
      ridderPhoneNumber: RidderInfoTable.phoneNumber,
      motocycleType: RidderInfoTable.motocycleType,
      passengerStatus: OrderTable.passengerStatus,
      ridderStatus: OrderTable.ridderStatus,
      updatedAt: OrderTable.updatedAt,
    }).from(OrderTable);

    if (ridderName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, OrderTable.ridderId))
           .where(and(
            eq(OrderTable.passengerId, passengerId),
            eq(RidderTable.userName, ridderName),
           ));
    } else {
      query.where(eq(OrderTable.passengerId, passengerId))
           .leftJoin(RidderTable, eq(RidderTable.id, OrderTable.ridderId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
         .orderBy(desc(OrderTable.updatedAt))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }

  async searchPaginationOrderByRidderId(
    ridderId: string,
    passengerName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    const query = this.db.select({
      id: OrderTable.id,
      finalStartCord: OrderTable.finalStartCord,
      finalEndCord: OrderTable.finalEndCord,
      finalStartAddress: OrderTable.finalStartAddress,
      finalEndAddress: OrderTable.finalEndAddress,
      passengerName: PassengerTable.userName,
      passengerAvatorUrl: PassengerInfoTable.avatorUrl,
      finalPrice: OrderTable.finalPrice,
      startAfter: OrderTable.startAfter,
      endedAt: OrderTable.endedAt,
      createdAt: OrderTable.createdAt,
      passengerPhoneNumber: PassengerInfoTable.phoneNumber,
      passengerStatus: OrderTable.passengerStatus,
      ridderStatus: OrderTable.ridderStatus,
      updatedAt: OrderTable.updatedAt,
    }).from(OrderTable);

    if (passengerName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, OrderTable.passengerId))
           .where(and(
            eq(OrderTable.ridderId, ridderId),
            eq(PassengerTable.userName, passengerName),
           ));
    } else {
      query.where(eq(OrderTable.ridderId, ridderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, OrderTable.passengerId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
         .orderBy(desc(OrderTable.updatedAt))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update and Transact operations ================================= */
  // since this method only allow passenger to update its status from UNSTARTED to STARTED
  // so we only update to STARTED status when the current status is UNSTARTED
  async toStartedPassengerStatusById(id: string, passengerId: string) {
    return await this.db.update(OrderTable).set({
      passengerStatus: "STARTED",
      updatedAt: new Date(),
    }).where(and(
      eq(OrderTable.id, id),
      eq(OrderTable.passengerId, passengerId), 
      eq(OrderTable.passengerStatus, "UNSTARTED"),
    )).returning({
      passengerStatus: OrderTable.passengerStatus,
    });
  }

  async toStartedRidderStatusById(id: string, ridderId: string) {
    return await this.db.update(OrderTable).set({
      ridderStatus: "STARTED",
      updatedAt: new Date(),
    }).where(and(
      eq(OrderTable.id, id),
      eq(OrderTable.ridderId, ridderId),
      eq(OrderTable.ridderStatus, "UNSTARTED"),
    )).returning({
      ridderStatus: OrderTable.ridderStatus,
    });
  }

  async toUnpaidPassengerStatusById(id: string, passengerId: string) {
    return await this.db.update(OrderTable).set({
      passengerStatus: "UNPAID",
      updatedAt: new Date(),
    }).where(and(
      eq(OrderTable.id, id),
      eq(OrderTable.passengerId, passengerId), 
      eq(OrderTable.passengerStatus, "STARTED"),
    )).returning({
      passengerStatus: OrderTable.passengerStatus,
    });
  }

  async toUnpaidRidderStatusById(id: string, ridderId: string) {
    return await this.db.update(OrderTable).set({
      ridderStatus: "UNPAID",
      updatedAt: new Date(),
    }).where(and(
      eq(OrderTable.id, id),
      eq(OrderTable.ridderId, ridderId),
      eq(OrderTable.ridderStatus, "STARTED"),
    )).returning({
      ridderStatus: OrderTable.ridderStatus,
    });
  }

  async toFinishedPassengerStatusById(id: string, passengerId: string) {
    return this.db.transaction(async (tx) => {
      const responseOfUpdatingOrder = await tx.update(OrderTable).set({
        passengerStatus: "FINISHED",
        updatedAt: new Date(),
      }).where(and(
        eq(OrderTable.id, id),
        eq(OrderTable.passengerId, passengerId),
        eq(OrderTable.passengerStatus, "UNPAID"),
      )).returning({
        prevOrderId: OrderTable.prevOrderId,
        passengerStatus: OrderTable.passengerStatus,
        ridderStatus: OrderTable.ridderStatus,
      });
      if (!responseOfUpdatingOrder || responseOfUpdatingOrder.length === 0) {
        throw ClientOrderNotFoundException;
      }

      if ( // responseOfUpdatingOrder[0].passengerStatus === "FINISHED" &&
          responseOfUpdatingOrder[0].ridderStatus === "FINISHED") {
            // successfully finishing the current order
            const prevOrderData = responseOfUpdatingOrder[0].prevOrderId.split(" ");
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
                .where(eq(SupplyOrderTable.id, prevOrderId))
                .returning({
                  id: SupplyOrderTable.id,
                });
              if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
                throw ClientSupplyOrderNotFoundException;
              }
            } else {
              throw ApiPrevOrderIdFormException;
            }

            // delete the order in orderTable store the order to the historyTable
            const responseOfDeletingOrder = await tx.delete(OrderTable)
              .where(eq(OrderTable.id, id))
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
            
            // create the history using the data from the prev deleted order
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
              historyId: HistoryTable.id,
              historyStatus: HistoryTable.status,
            });
            if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
              throw ClientCreateHistoryException;
            }
              
        return [{
          ...responseOfCreatingHistory[0],
        }]
      }

      return responseOfUpdatingOrder;
    });
  }

  async toFinishedRidderStatusById(id: string, ridderId: string) {
    return this.db.transaction(async (tx) => {
      const responseOfUpdatingOrder = await tx.update(OrderTable).set({
        ridderStatus: "FINISHED",
        updatedAt: new Date(),
      }).where(and(
        eq(OrderTable.id, id),
        eq(OrderTable.ridderId, ridderId),
        eq(OrderTable.ridderStatus, "UNPAID"),
      )).returning({
        prevOrderId: OrderTable.prevOrderId,
        passengerStatus: OrderTable.passengerStatus,
        ridderStatus: OrderTable.ridderStatus,
      });
      if (!responseOfUpdatingOrder || responseOfUpdatingOrder.length === 0) {
        throw ClientOrderNotFoundException;
      }

      if (responseOfUpdatingOrder[0].passengerStatus === "FINISHED"
          // && responseOfUpdatingOrder[0].ridderStatus === "FINISHED"
      ) {
        // successfully finishing the current order
        const prevOrderData = responseOfUpdatingOrder[0].prevOrderId.split(" ");
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
            .where(eq(SupplyOrderTable.id, prevOrderId))
            .returning({
              id: SupplyOrderTable.id,
            });
          if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
            throw ClientSupplyOrderNotFoundException;
          }
        } else {
          throw ApiPrevOrderIdFormException;
        }

        const responseOfDeletingOrder = await tx.delete(OrderTable)
          .where(eq(OrderTable.id, id))
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
          historyId: HistoryTable.id,
          historyStatus: HistoryTable.status,
        });
        if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
          throw ClientCreateHistoryException;
        }

        return [{
          ...responseOfCreatingHistory[0],
        }]
      }

      return responseOfUpdatingOrder;
    });
  }
  /* ================================= Update and Transact operations ================================= */


  /* ================================= Delete operations ================================= */
  async cancelAndDeleteOrderById(id: string, userId: string) {
    // one of the users(Passenger or Ridder) can cancel the current order, 
    // once they done this, the other user can still see the canceled order on history
    return await this.db.transaction(async (tx) => {
      const responseOfDeletingOrder = await tx.delete(OrderTable)
        .where(and(
          eq(OrderTable.id, id),
          ne(OrderTable.passengerStatus, "FINISHED"),
          ne(OrderTable.ridderStatus, "FINISHED"),
          or(
            eq(OrderTable.passengerId, userId),
            eq(OrderTable.ridderId, userId),
          ),
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
        status: "CANCEL",
      }).returning({
        historyId: HistoryTable.id,
        historyStatus: HistoryTable.status,
      });
      if (!responseOfCreatingHistory || responseOfCreatingHistory.length === 0) {
        throw ClientCreateHistoryException;
      }

      return {
        ...responseOfCreatingHistory,
      }
    });
  }
  /* ================================= Delete operations ================================= */
}
