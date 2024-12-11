import * as bcrypt from "bcrypt";
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { and, eq, lte, ne } from 'drizzle-orm';
import { 
  OrderTable, 
  SupplyOrderTable, 
  PassengerInviteTable, 
  RidderInviteTable, 
  PassengerNotificationTable, 
  RidderNotificationTable, 
  PeriodicPurchaseOrderTable,
  PeriodicSupplyOrderTable,
  PassengerTable,
  RidderTable, 
} from '../drizzle/schema/schema';
import { 
  ClientCreateHistoryException, 
  ClientCreatePassengerNotificationException, 
  ClientCreatePurchaseOrderException, 
  ClientCreateRidderNotificationException, 
  ClientCreateSupplyOrderException, 
  ClientOrderNotFoundException, 
  ServerExtractAdminAccountEnvVariableException
} from '../exceptions';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { addDays, daysOfWeekToNumber, ISOStringToDateOnly, ISOStringToTimeOnlyString } from '../utils/timeCalculator';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { 
  NotificationTemplateOfUpdatingExpiredPassengerInvites, 
  NotificationTemplateOfUpdatingExpiredPurchaseOrders, 
  NotificationTemplateOfUpdatingExpiredRidderInvites, 
  NotificationTemplateOfUpdatingExpiredSupplyOrders, 
  NotificationTemplateOfUpdatingStartedOrders
} from '../notification/notificationTemplate';

@Injectable()
export class CronService {
  constructor(
    private config: ConfigService, 
    private passengerNotification: PassengerNotificationService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Cron Auth operations ================================= */
  // instead of passing sensitive data to the below function, we using environment variables to verify the admin
  async signInPassengerAdmin() {
    const adminUserName = this.config.get<string>("PASSENGER_ADMIN_USERNAME");
    if (!adminUserName) throw ServerExtractAdminAccountEnvVariableException("passengerAdmin's userName");
    const adminEmail = this.config.get<string>("PASSENGER_ADMIN_EMAIL");
    if (!adminEmail) throw ServerExtractAdminAccountEnvVariableException("passengerAdmin's email");
    const adminPassword = this.config.get<string>("PASSENGER_ADMIN_PASSWORD");
    if (!adminPassword) throw ServerExtractAdminAccountEnvVariableException("passengerAdmin's password");
    
    const response: any = await this.db.select({
      id: PassengerTable.id, 
      hash: PassengerTable.password, 
    }).from(PassengerTable)
      .where(and(
        eq(PassengerTable.userName, adminUserName),
        eq(PassengerTable.email, adminEmail), 
      ))
      .limit(1);
    if (!response || response.length === 0) throw ServerExtractAdminAccountEnvVariableException("passengerAdmin's userName or email");
    const user = response[0];
    const pwMatches = await bcrypt.compare(adminPassword, user.hash);
    delete user.hash;
    
    if (!pwMatches) throw ServerExtractAdminAccountEnvVariableException("passengerAdmin's password");

    return {
      isAdmin: true, 
    }
  }

  async signInRidderAdmin() {
    const adminUserName = this.config.get<string>("RIDDER_ADMIN_USERNAME");
    if (!adminUserName) throw ServerExtractAdminAccountEnvVariableException("ridderAdmin's userName");
    const adminEmail = this.config.get<string>("RIDDER_ADMIN_EMAIL");
    if (!adminEmail) throw ServerExtractAdminAccountEnvVariableException("ridderAdmin's email");
    const adminPassword = this.config.get<string>("RIDDER_ADMIN_PASSWORD");
    if (!adminPassword) throw ServerExtractAdminAccountEnvVariableException("ridderAdmin's password");
    
    const response: any = await this.db.select({
      id: RidderTable.id, 
      hash: RidderTable.password, 
    }).from(RidderTable)
      .where(and(
        eq(RidderTable.userName, adminUserName),
        eq(RidderTable.email, adminEmail), 
      ))
      .limit(1);
    if (!response || response.length === 0) throw ServerExtractAdminAccountEnvVariableException("ridderAdmin's userName or email");
    const user = response[0];
    const pwMatches = await bcrypt.compare(adminPassword, user.hash);
    delete user.hash;
    
    if (!pwMatches) throw ServerExtractAdminAccountEnvVariableException("ridderAdmin's password");

    return {
      isAdmin: true, 
    }
  }
  // /* ================================= Cron Auth operations ================================= */


  /* ================================= Automated Create operations ================================= */
  async createPurchaseOrdersByPeriodicPurchaseOrders() {
    return this.db.transaction(async (tx) => {
      const responseOfSelectingPeriodicPurchaseOrders = await tx.select({
        id: PeriodicPurchaseOrderTable.id, 
        creatorId: PeriodicPurchaseOrderTable.creatorId, 
        scheduledDay: PeriodicPurchaseOrderTable.scheduledDay, 
        initPrice: PeriodicPurchaseOrderTable.initPrice, 
        startCord: PeriodicPurchaseOrderTable.startCord, 
        endCord: PeriodicPurchaseOrderTable.endCord, 
        startAddress: PeriodicPurchaseOrderTable.startAddress, 
        endAddress: PeriodicPurchaseOrderTable.endAddress, 
        startAfter: PeriodicPurchaseOrderTable.startAfter, 
        endedAt: PeriodicPurchaseOrderTable.endedAt, 
        isUrgent: PeriodicPurchaseOrderTable.isUrgent, 
        autoAccept: PeriodicPurchaseOrderTable.autoAccept, 
      }).from(PeriodicPurchaseOrderTable);  // we get all periodicPurchaseOrders here
      if (responseOfSelectingPeriodicPurchaseOrders && responseOfSelectingPeriodicPurchaseOrders.length !== 0) {
        const responseOfCreatingPurchaseOrders = await tx.insert(PurchaseOrderTable).values(
          responseOfSelectingPeriodicPurchaseOrders.map((content) => {
            return {
              creatorId: content.creatorId, 
              description: "This is a purchaseOrder which automatically generated by user's periodicPurchaseOrder", 
              initPrice: content.initPrice, 
              startCord: content.startCord, 
              endCord: content.endCord, 
              startAddress: content.startAddress, 
              endAddress: content.endAddress, 
              startAfter: new Date(
                ISOStringToDateOnly(addDays(daysOfWeekToNumber(content.scheduledDay)).toISOString()) + "T" +
                ISOStringToTimeOnlyString(content.startAfter.toISOString()) + "Z"), 
              endedAt: new Date(
                ISOStringToDateOnly(addDays(daysOfWeekToNumber(content.scheduledDay)).toISOString()) + "T" +
                ISOStringToTimeOnlyString(content.endedAt.toISOString()) + "Z"), 
              isUrgent: content.isUrgent, 
              autoAccept: content.autoAccept, 
            };
          })
        ).returning({
          id: PurchaseOrderTable.id, 
        });
        if (!responseOfCreatingPurchaseOrders 
          || responseOfCreatingPurchaseOrders.length !== responseOfSelectingPeriodicPurchaseOrders.length) {
            throw ClientCreatePurchaseOrderException;
        }

        return responseOfSelectingPeriodicPurchaseOrders.map((value, index) => { 
          return { 
            periodicPurchaseOrderId: value.id, 
            purchaseOrderId: responseOfCreatingPurchaseOrders[index].id, 
          };
        });
      }

      return responseOfSelectingPeriodicPurchaseOrders.map(({ id }) => ({ id }));
    });
  }

  async createSupplyOrdersByPeriodicSupplyOrders() {
    return this.db.transaction(async (tx) => {
      const responseOfSelectingPeriodicSupplyOrders = await tx.select({
        id: PeriodicSupplyOrderTable.id, 
        creatorId: PeriodicSupplyOrderTable.creatorId, 
        scheduledDay: PeriodicSupplyOrderTable.scheduledDay, 
        initPrice: PeriodicSupplyOrderTable.initPrice, 
        startCord: PeriodicSupplyOrderTable.startCord, 
        endCord: PeriodicSupplyOrderTable.endCord, 
        startAddress: PeriodicSupplyOrderTable.startAddress, 
        endAddress: PeriodicSupplyOrderTable.endAddress, 
        startAfter: PeriodicSupplyOrderTable.startAfter, 
        endedAt: PeriodicSupplyOrderTable.endedAt, 
        tolerableRDV: PeriodicSupplyOrderTable.tolerableRDV, 
        autoAccept: PeriodicSupplyOrderTable.autoAccept, 
      }).from(PeriodicSupplyOrderTable);  // we get all periodicSupplyOrders here
      if (responseOfSelectingPeriodicSupplyOrders && responseOfSelectingPeriodicSupplyOrders.length !== 0) {
        const responseOfCreatingSupplyOrders = await tx.insert(SupplyOrderTable).values(
          responseOfSelectingPeriodicSupplyOrders.map((content) => {
            return {
              creatorId: content.creatorId, 
              description: "This is a supplyOrder which automatically generated by user's periodicSupplyOrder", 
              initPrice: content.initPrice, 
              startCord: content.startCord, 
              endCord: content.endCord, 
              startAddress: content.startAddress, 
              endAddress: content.endAddress, 
              startAfter: new Date(
                ISOStringToDateOnly(addDays(daysOfWeekToNumber(content.scheduledDay)).toISOString()) + 
                ISOStringToTimeOnlyString(content.startAfter.toISOString())), 
              endedAt: new Date(
                ISOStringToDateOnly(addDays(daysOfWeekToNumber(content.scheduledDay)).toISOString()) + 
                ISOStringToTimeOnlyString(content.endedAt.toISOString())), 
              isUrgent: content.tolerableRDV, 
              autoAccept: content.autoAccept, 
            };
          })
        ).returning({
          id: SupplyOrderTable.id, 
        });
        if (!responseOfCreatingSupplyOrders 
          || responseOfCreatingSupplyOrders.length !== responseOfSelectingPeriodicSupplyOrders.length) {
            throw ClientCreateSupplyOrderException;
        }

        return responseOfSelectingPeriodicSupplyOrders.map((value, index) => { 
          return { 
            periodicSupplyOrderId: value.id, 
            supplyOrderId: responseOfCreatingSupplyOrders[index].id, 
          };
        });
      }

      return responseOfSelectingPeriodicSupplyOrders.map(({ id }) => ({ id }));
    });
  }
  /* ================================= Automated Create operations ================================= */


  /* ================================= Automated Update operations ================================= */
  async updateToExpiredPurchaseOrders() {
    const responseOfUpdatingExpiredPurchaseOrders = await this.db.update(PurchaseOrderTable).set({
      status: "EXPIRED", 
      updatedAt: new Date(), 
    }).where(and(
      eq(PurchaseOrderTable.status, "POSTED"), 
      lte(PurchaseOrderTable.startAfter, new Date()), 
    )).returning({
      id: PurchaseOrderTable.id, 
      creatorId: PurchaseOrderTable.creatorId, 
    });
    if (responseOfUpdatingExpiredPurchaseOrders && responseOfUpdatingExpiredPurchaseOrders.length !== 0) {
      const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
        responseOfUpdatingExpiredPurchaseOrders.map((content) => {
          return NotificationTemplateOfUpdatingExpiredPurchaseOrders(
            content.creatorId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingNotification 
          || responseOfCreatingNotification.length !== responseOfUpdatingExpiredPurchaseOrders.length) {
            throw ClientCreatePassengerNotificationException;
      }
    }

    return responseOfUpdatingExpiredPurchaseOrders.map(({ id }) => ({ id }));
  }

  async updateToExpiredSupplyOrders() {
    const responseOfUpdatingExpiredSupplyOrders = await this.db.update(SupplyOrderTable).set({
      status: "EXPIRED", 
      updatedAt: new Date(), 
    }).where(and(
      eq(SupplyOrderTable.status, "POSTED"), 
      lte(SupplyOrderTable.startAfter, new Date()), 
    )).returning({
      id: SupplyOrderTable.id, 
      creatorId: SupplyOrderTable.creatorId, 
    });
    if (responseOfUpdatingExpiredSupplyOrders && responseOfUpdatingExpiredSupplyOrders.length !== 0) {
      const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
        responseOfUpdatingExpiredSupplyOrders.map((content) => {
          return NotificationTemplateOfUpdatingExpiredSupplyOrders(
            content.creatorId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingNotification 
          || responseOfCreatingNotification.length !== responseOfUpdatingExpiredSupplyOrders.length) {
            throw ClientCreateRidderNotificationException;
      }
    }

    return responseOfUpdatingExpiredSupplyOrders.map(({ id }) => ({ id }));
  }

  // but there's no "EXPIRED" status in invites, 
  // we just update them to "CANCEL"
  async updateToExpiredPassengerInvites() {
    const responseOfUpdatingExpiredPassengerInvites = await this.db.update(PassengerInviteTable).set({
      status: "CANCEL", 
      updatedAt: new Date(), 
    }).where(and(
      eq(PassengerInviteTable.status, "CHECKING"), 
      lte(PassengerInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: PassengerInviteTable.id, 
      userId: PassengerInviteTable.userId, 
    });
    if (responseOfUpdatingExpiredPassengerInvites && responseOfUpdatingExpiredPassengerInvites.length !== 0) {
      const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
        responseOfUpdatingExpiredPassengerInvites.map((content) => {
          return NotificationTemplateOfUpdatingExpiredPassengerInvites(
            content.userId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingNotification 
          || responseOfCreatingNotification.length !== responseOfUpdatingExpiredPassengerInvites.length) {
            throw ClientCreatePassengerNotificationException;
      }
    }

    return responseOfUpdatingExpiredPassengerInvites.map(({ id }) => ({ id }));
  }

  async updateToExpiredRidderInvites() {
    const responseOfUpdatingToExpiredRidderInvites = await this.db.update(RidderInviteTable).set({
      status: "CANCEL", 
      updatedAt: new Date(), 
    }).where(and(
      eq(RidderInviteTable.status, "CHECKING"), 
      lte(RidderInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: RidderInviteTable.id, 
      userId: RidderInviteTable.userId, 
    });
    if (responseOfUpdatingToExpiredRidderInvites && responseOfUpdatingToExpiredRidderInvites.length !== 0) {
      const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
        responseOfUpdatingToExpiredRidderInvites.map((content) => {
          return NotificationTemplateOfUpdatingExpiredRidderInvites(
            content.userId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingNotification 
          || responseOfCreatingNotification.length !== responseOfUpdatingToExpiredRidderInvites.length) {
            throw ClientCreateRidderNotificationException;
      }
    }

    return responseOfUpdatingToExpiredRidderInvites.map(({ id }) => ({ id }));
  }

  async updateToStartedOrders() {
    const responseOfUpdatingStartedOrders = await this.db.update(OrderTable).set({
      passengerStatus: "STARTED", 
      ridderStatus: "STARTED", 
    }).where(and(
      eq(OrderTable.passengerStatus, "UNSTARTED"), 
      eq(OrderTable.ridderStatus, "UNSTARTED"), 
      lte(OrderTable.startAfter, new Date()), 
    )).returning({
      id: OrderTable.id, 
      passengerId: OrderTable.passengerId, 
      ridderId: OrderTable.ridderId, 
    });
    if (responseOfUpdatingStartedOrders && responseOfUpdatingStartedOrders.length !== 0) {
      const responseOfCreatingPassengerNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
        responseOfUpdatingStartedOrders.map((content) => {
          return NotificationTemplateOfUpdatingStartedOrders(
            content.passengerId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingPassengerNotification 
        || responseOfCreatingPassengerNotification.length !== responseOfUpdatingStartedOrders.length) {
          throw ClientCreatePassengerNotificationException;
      }

      const responseOfCreatingRidderNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
        responseOfUpdatingStartedOrders.map((content) => {
          return NotificationTemplateOfUpdatingStartedOrders(
            content.ridderId, 
            content.id, 
          );
        })
      );
      if (!responseOfCreatingRidderNotification 
        || responseOfCreatingRidderNotification.length !== responseOfUpdatingStartedOrders.length) {
          throw ClientCreateRidderNotificationException;
      }
    }

    return responseOfUpdatingStartedOrders.map(({ id }) => ({ id }));
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
      if (responseOfDeletingOrders && responseOfDeletingOrders.length !== 0) {
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
        if (!responseOfCreatingHistories 
          || responseOfCreatingHistories.length !== responseOfDeletingOrders.length) {
            throw ClientCreateHistoryException;
        }
  
        return [{
          ...responseOfCreatingHistories,
        }];
      }

      return [{
        ...responseOfDeletingOrders, 
      }];
    });
  }

  async deleteExpiredPassengerNotifications() {
    return await this.db.delete(PassengerNotificationTable)
      .where(lte(PassengerNotificationTable.createdAt, addDays(-14)))
      .returning({
        id: PassengerNotificationTable.id, 
      });
  }

  async deleteExpiredRidderNotifications() {
    return await this.db.delete(RidderNotificationTable)
      .where(lte(RidderNotificationTable.createdAt, addDays(-14)))
      .returning({
        id: RidderNotificationTable.id, 
      });
  }
  /* ================================= Automated Delete operations ================================= */
}
