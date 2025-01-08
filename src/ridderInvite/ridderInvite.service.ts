import { Inject, Injectable } from '@nestjs/common';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { RidderInviteTable } from '../drizzle/schema/ridderInvite.schema';
import { and, asc, desc, eq, gte, like, lt, lte, ne, not, or, sql } from 'drizzle-orm';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { OrderTable } from '../drizzle/schema/order.schema';
import { point } from '../interfaces/point.interface';
import { 
  ClientCreateOrderException, 
  ClientCreatePassengerNotificationException, 
  ClientCreateRidderInviteException, 
  ClientCreateRidderNotificationException, 
  ClientEndBeforeStartException, 
  ClientInviteNotFoundException, 
  ClientPurchaseOrderNotFoundException, 
  ClientUserHasNoAccessException, 
  ServerNeonautoUpdateExpiredRidderInviteException, 
} from '../exceptions';
import { 
  NotificationTemplateOfAcceptingRidderInvite, 
  NotificationTemplateOfCancelingRidderInvite, 
  NotificationTemplateOfCreatingRidderInvite, 
  NotificationTemplateOfRejectingRiddererInvite, 
  NotificationTemplateOfUpdatingRidderInvite 
} from '../notification/notificationTemplate';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { SearchPriorityType } from '../types';

@Injectable()
export class RidderInviteService {
  constructor(
    private passengerNotification: PassengerNotificationService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Detect And Update Expired RidderInvites operations ================================= */
  private async updateExpiredRidderInvites() {
    const response = await this.db.update(RidderInviteTable).set({
      status: "CANCEL", 
    }).where(and(
      eq(RidderInviteTable.status, "CHECKING"), 
      lt(RidderInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: RidderInviteTable.id, 
    });
    if (!response) {
      throw ServerNeonautoUpdateExpiredRidderInviteException;
    }

    return response.length;
  }
  /* ================================= Detect And Update Expired RidderInvites operations ================================= */


  /* ================================= Create operations ================================= */
  async createRidderInviteByOrderId(
    inviterId: string, 
    inviterName: string, 
    orderId: string, 
    createRidderInviteDto: CreateRidderInviteDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingConfictRidderInvites = await tx.select({
        id: RidderInviteTable.id, 
      }).from(RidderInviteTable)
        .where(and(
          eq(RidderInviteTable.userId, inviterId), 
          not(lte(RidderInviteTable.suggestEndedAt, new Date(createRidderInviteDto.suggestStartAfter))), 
          not(gte(RidderInviteTable.suggestStartAfter, new Date(createRidderInviteDto.suggestEndedAt))), 
        ));

      const responseOfSelectingPurchaseOrder = await tx.select({
        passengerId: PassengerTable.id, 
        status: PurchaseOrderTable.status, 
      }).from(PurchaseOrderTable)
        .where(eq(PurchaseOrderTable.id, orderId))
        .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
      if (!responseOfSelectingPurchaseOrder || responseOfSelectingPurchaseOrder.length === 0
        || responseOfSelectingPurchaseOrder[0].status !== "POSTED") {
          throw ClientPurchaseOrderNotFoundException;
      }

      const responseOfCreatingRidderInvite = await tx.insert(RidderInviteTable).values({
        userId: inviterId,
        orderId: orderId,
        briefDescription: createRidderInviteDto.briefDescription,
        suggestPrice: createRidderInviteDto.suggestPrice,
        startCord: sql`ST_SetSRID(
          ST_MakePoint(${createRidderInviteDto.startCordLongitude}, ${createRidderInviteDto.startCordLatitude}),
          4326
        )`,
        endCord: sql`ST_SetSRID(
          ST_MakePoint(${createRidderInviteDto.endCordLongitude}, ${createRidderInviteDto.endCordLatitude}),
          4326
        )`,
        startAddress: createRidderInviteDto.startAddress,
        endAddress: createRidderInviteDto.endAddress,
        suggestStartAfter: new Date(createRidderInviteDto.suggestStartAfter),
        suggestEndedAt: new Date(createRidderInviteDto.suggestEndedAt),
      }).returning({
        id: RidderInviteTable.id,
        orderId: RidderInviteTable.orderId,
        createdAt: RidderInviteTable.createdAt,
        status: RidderInviteTable.status,
      });
      if (!responseOfCreatingRidderInvite || responseOfCreatingRidderInvite.length === 0) {
        throw ClientCreateRidderInviteException;
      }
      
      const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId(
        NotificationTemplateOfCreatingRidderInvite(
          inviterName, 
          responseOfSelectingPurchaseOrder[0].passengerId as string, 
          responseOfCreatingRidderInvite[0].id as string, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreatePassengerNotificationException;
      }

      return [{
        hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0), 
        ...responseOfCreatingRidderInvite[0], 
      }];
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  // for specifying the details of the other invites
  async getRidderInviteById(
    id: string,
    userId: string,
  ) {
    return await this.db.select({
      id: RidderInviteTable.id,
      suggestPrice: RidderInviteTable.suggestPrice,
      inviteBriefDescription: RidderInviteTable.briefDescription,
      suggestStartCord: RidderInviteTable.startCord,
      suggestEndCord: RidderInviteTable.endCord,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      inviteCreatedAt: RidderInviteTable.createdAt,
      inviteUdpatedAt: RidderInviteTable.updatedAt,
      inviteStatus: RidderInviteTable.status,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      description: PurchaseOrderTable.description,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
      orderCreatedAt: PurchaseOrderTable.createdAt,
      orderUpdatedAt: PurchaseOrderTable.updatedAt,
      creatorName: PassengerTable.userName,
      isOnline: PassengerInfoTable.isOnline,
      avatorUrl: PassengerInfoTable.avatorUrl,
      phoneNumber: PassengerInfoTable.phoneNumber,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt, 
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(RidderInviteTable.orderId, PurchaseOrderTable.id))
      .where(and(
          eq(RidderInviteTable.id, id), 
          or(
            eq(RidderInviteTable.userId, userId),
            eq(PurchaseOrderTable.creatorId, userId),
          ))
      )
      .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id));
  }

  /* ================= Search RidderInvite operations used by Ridder ================= */
  async searchPaginationRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable);
      
    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")))
    } else {  // specify before join -> faster
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
         .orderBy(desc(RidderInviteTable.updatedAt))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }

  async searchAboutToStartRidderInvitesByInviterId(
    inviterId: string, 
    receiverName: string | undefined = undefined, 
    limit: number, 
    offset: number, 
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable);
      
    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")))
    } else {  // specify before join -> faster
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
         .orderBy(asc(RidderInviteTable.suggestStartAfter))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }

  async searchSimilarTimeRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(
            sql`ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestStartAfter} - ${PurchaseOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestEndedAt} - ${PurchaseOrderTable.endedAt}))) ASC`
          ).limit(limit)
           .offset(offset);

    return await query;
  }

  async searchCurAdjacentRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord}
      )`,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${RidderInviteTable.startCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchDestAdjacentRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ${RidderInviteTable.endCord}
      )`,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.endCord},
            ${RidderInviteTable.endCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchSimilarRouteRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${RidderInviteTable.startCord},
          ${RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${RidderInviteTable.endCord},
          ${PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${PurchaseOrderTable.endCord}
        )
      `,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName + "%")));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`
            ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${RidderInviteTable.startCord}
          )
          + ST_Distance(
              ${RidderInviteTable.startCord},
              ${RidderInviteTable.endCord}
            )
          + ST_Distance(
              ${RidderInviteTable.endCord},
              ${PurchaseOrderTable.endCord}
            )
          - ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${PurchaseOrderTable.endCord}
            )
          `)
          .limit(limit)
          .offset(offset);

    return await query;
  }
  /* ================= Powerful Search operations ================= */
  async searchBetterFirstRidderInvitesByInviterId(
      inviterId: string,
      receiverName: string | undefined = undefined,
      limit: number,
      offset: number,
      searchPriorities: SearchPriorityType, 
    ) {
      let timeQuery: any = undefined, aboutToStartQuery: any = undefined, 
          routeQuery: any = undefined, startQuery: any = undefined, destQuery: any = undefined, 
          updatedAtQuery: any = undefined;
      let spaceResponseField: any = {};
  
      timeQuery = sql`ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestStartAfter} - ${PurchaseOrderTable.startAfter}))) +
                      ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestEndedAt} - ${PurchaseOrderTable.endedAt}))) ASC`;
      aboutToStartQuery = sql`${RidderInviteTable.suggestStartAfter} ASC`;
      startQuery = sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord}
      )`;
      destQuery = sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ${RidderInviteTable.endCord}
      )`;
      routeQuery = sql`
        ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${RidderInviteTable.startCord},
          ${RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${RidderInviteTable.endCord},
          ${PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${PurchaseOrderTable.endCord}
        )
      `;
      updatedAtQuery = sql`${RidderInviteTable.updatedAt} DESC`;
  
      spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };
  
      const sortMap = {
        'T': timeQuery, 
        'R': routeQuery, 
        'S': startQuery, 
        'D': destQuery, 
        'U': updatedAtQuery, 
      };
  
      const searchQueries = searchPriorities.split('')
          .map(symbol => sortMap[symbol])
          .filter(query => query !== undefined);
      searchQueries.push(aboutToStartQuery);
  
      await this.updateExpiredRidderInvites();
  
      const query = this.db.select({
        id: RidderInviteTable.id,
        orderId: RidderInviteTable.orderId,
        suggestStartAddress: RidderInviteTable.startAddress,
        suggestEndAddress: RidderInviteTable.endAddress,
        receiverName: RidderTable.userName,
        avatorUrl: RidderInfoTable.avatorUrl,
        suggestPrice: RidderInviteTable.suggestPrice,
        suggestStartAfter: RidderInviteTable.suggestStartAfter,
        suggesEndedAt: RidderInviteTable.suggestEndedAt,
        createdAt: RidderInviteTable.createdAt,
        updatedAt: RidderInviteTable.updatedAt,
        ...spaceResponseField, 
      }).from(RidderInviteTable);
  
      if (receiverName) {
        query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
             .leftJoin(RidderTable, eq(RidderTable.id, PurchaseOrderTable.creatorId))
             .where(and(eq(RidderInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")));
      } else {
        query.where(eq(RidderInviteTable.userId, inviterId))
             .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
             .leftJoin(RidderTable, eq(RidderTable.id, PurchaseOrderTable.creatorId));
      }
  
      query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
            .orderBy(...searchQueries)
            .limit(limit)
            .offset(offset);
  
      return await query;
    }
  /* ================= Powerful Search operations ================= */

  /* ================= Search RidderInvite operations used by Ridders ================= */


  /* ================= Search RidderInvite operations used by Passengers ================= */
  async searchPaginationRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));
      
    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }
      
    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(desc(RidderInviteTable.updatedAt))
          .limit(limit)
          .offset(offset);
    
    return await query;
  }

  async searchAboutToStartRidderInvitesByReceiverId(
    receiverId: string, 
    inviterName: string | undefined = undefined, 
    limit: number, 
    offset: number, 
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));
      
    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }
      
    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(asc(RidderInviteTable.suggestStartAfter))
          .limit(limit)
          .offset(offset);
    
    return await query;
  }

  async searchSimilarTimeRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status, 
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(
            sql`ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestStartAfter} - ${PurchaseOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestEndedAt} - ${PurchaseOrderTable.endedAt}))) ASC`
          ).limit(limit)
           .offset(offset);

    return await query;
  }

  async searchCurAdjacentRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      manhattanDistance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord}
      )`,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${RidderInviteTable.startCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchDestAdjacentRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      manhattanDistance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ${RidderInviteTable.endCord}
      )`,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.endCord},
            ${RidderInviteTable.endCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchSimilarRouteRidderInvitesByReceverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggestEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${RidderInviteTable.startCord}
        )
      + ST_Distance(
          ${RidderInviteTable.startCord},
          ${RidderInviteTable.endCord}
        )
      + ST_Distance(
          ${RidderInviteTable.endCord},
          ${PurchaseOrderTable.endCord}
        )
      - ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${PurchaseOrderTable.endCord}
        )
      `,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`
            ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${RidderInviteTable.startCord}
            )
          + ST_Distance(
              ${RidderInviteTable.startCord},
              ${RidderInviteTable.endCord}
            )
          + ST_Distance(
              ${RidderInviteTable.endCord},
              ${PurchaseOrderTable.endCord}
            )
          - ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${PurchaseOrderTable.endCord}
            )
          `)
          .limit(limit)
          .offset(offset);

    return await query;
  }
  /* ================= Powerful Search operations ================= */
  async searchBetterFirstRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
    searchPriorities: SearchPriorityType, 
  ) {
    let timeQuery: any = undefined, aboutToStartQuery: any = undefined, 
        routeQuery: any = undefined, startQuery: any = undefined, destQuery: any = undefined, 
        updatedAtQuery: any = undefined;
    let spaceResponseField: any = {};

    timeQuery = sql`ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestStartAfter} - ${PurchaseOrderTable.startAfter}))) +
                    ABS(EXTRACT(EPOCH FROM (${RidderInviteTable.suggestEndedAt} - ${PurchaseOrderTable.endedAt}))) ASC`
    aboutToStartQuery = sql`${RidderInviteTable.suggestStartAfter} ASC`;
    startQuery = sql`ST_Distance(
      ${PurchaseOrderTable.startCord},
      ${RidderInviteTable.startCord}
    )`;
    destQuery = sql`ST_Distance(
      ${PurchaseOrderTable.endCord},
      ${RidderInviteTable.endCord}
    )`;
    routeQuery = sql`
      ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord}
      )
    + ST_Distance(
        ${RidderInviteTable.startCord},
        ${RidderInviteTable.endCord}
      )
    + ST_Distance(
        ${RidderInviteTable.endCord},
        ${PurchaseOrderTable.endCord}
      )
    - ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${PurchaseOrderTable.endCord}
      )
    `;
    updatedAtQuery = sql`${RidderInviteTable.updatedAt} DESC`;

    spaceResponseField = { RDV: routeQuery, startManhattanDistance: startQuery, destManhattanDistance: destQuery };

    const sortMap = {
      'T': timeQuery, 
      'R': routeQuery, 
      'S': startQuery, 
      'D': destQuery, 
      'U': updatedAtQuery, 
    };

    const searchQueries = searchPriorities.split('')
        .map(symbol => sortMap[symbol])
        .filter(query => query !== undefined);
    searchQueries.push(aboutToStartQuery);

    await this.updateExpiredRidderInvites();

    const query = this.db.select({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      suggestStartAddress: RidderInviteTable.startAddress,
      suggestEndAddress: RidderInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: RidderInviteTable.suggestPrice,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      suggesEndedAt: RidderInviteTable.suggestEndedAt,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      ...spaceResponseField, 
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, RidderInviteTable.userId))
            .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
            .leftJoin(PassengerTable, eq(PassengerTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(...searchQueries)
          .limit(limit)
          .offset(offset);

    return await query;
  }
  /* ================= Powerful Search operations ================= */

  /* ================= Search RidderInvite operations used by Passengers ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */

  /* ================= Update detail operations used by Ridder ================= */
  async updateRidderInviteById(
    id: string,
    inviterId: string,  // for validating the current user is the owner to that invite
    inviterName: string, 
    updateRidderInviteDto: UpdateRidderInviteDto,
  ) {
    return this.db.transaction(async (tx) => {
      const newStartCord: point | undefined = 
        (updateRidderInviteDto.startCordLongitude !== undefined
          && updateRidderInviteDto.startCordLatitude !== undefined)
        ? { x: updateRidderInviteDto.startCordLongitude, y: updateRidderInviteDto.startCordLatitude }
        : undefined;
      
      const newEndCord: point | undefined = 
        (updateRidderInviteDto.endCordLongitude !== undefined
          && updateRidderInviteDto.endCordLatitude !== undefined)
        ? { x: updateRidderInviteDto.endCordLongitude, y: updateRidderInviteDto.endCordLatitude }
        : undefined;

      const ridderInvite = await tx.select({
        passengerId: PassengerTable.id, 
        suggestStartAfter: RidderInviteTable.suggestStartAfter, 
        suggestEndedAt: RidderInviteTable.suggestEndedAt, 
      }).from(RidderInviteTable)
        .where(and(
          eq(RidderInviteTable.id, id), 
          eq(RidderInviteTable.userId, inviterId), 
          eq(RidderInviteTable.status, "CHECKING"),
        )).leftJoin(PurchaseOrderTable, eq(RidderInviteTable.orderId, PurchaseOrderTable.id))
          .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
      if (!ridderInvite || ridderInvite.length === 0) throw ClientInviteNotFoundException;

      let responseOfSelectingConfictRidderInvites: any = undefined;
      if (updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConfictRidderInvites = await tx.select({
          id: RidderInviteTable.id, 
        }).from(RidderInviteTable)
          .where(and(
            eq(RidderInviteTable.userId, inviterId), 
            not(lte(RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter))), 
            not(gte(RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt))), 
          ));
      } else if (updateRidderInviteDto.suggestStartAfter && !updateRidderInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(ridderInvite[0].suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConfictRidderInvites = await tx.select({
          id: RidderInviteTable.id, 
        }).from(RidderInviteTable)
          .where(and(
            eq(RidderInviteTable.userId, inviterId), 
            not(lte(RidderInviteTable.suggestEndedAt, new Date(updateRidderInviteDto.suggestStartAfter)))
          ));
      } else if (!updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(ridderInvite[0].suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConfictRidderInvites = await tx.select({
          id: RidderInviteTable.id, 
        }).from(RidderInviteTable)
          .where(and(
            eq(RidderInviteTable.userId, inviterId), 
            not(gte(RidderInviteTable.suggestStartAfter, new Date(updateRidderInviteDto.suggestEndedAt)))
          ));
      }

      const responseOfUpdatingRidderInvite = await tx.update(RidderInviteTable).set({
        briefDescription: updateRidderInviteDto.briefDescription,
        suggestPrice: updateRidderInviteDto.suggestPrice,
        ...(newStartCord 
          ? { startCord: sql`ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)`}
          : {}
        ),
        ...(newEndCord 
          ? { endCord: sql`ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)`}
          : {}
        ),
        startAddress: updateRidderInviteDto.startAddress,
        endAddress: updateRidderInviteDto.endAddress,
        ...(updateRidderInviteDto.suggestStartAfter
          ? { suggestStartAfter: new Date(updateRidderInviteDto.suggestStartAfter) }
          : {}
        ),
        ...(updateRidderInviteDto.suggestEndedAt
          ? { suggestEndedAt: new Date(updateRidderInviteDto.suggestEndedAt) }
          : {}
        ),
        updatedAt: new Date(),
        status: updateRidderInviteDto.status, // either CHECKING or CANCEL
      }).where(and(
          eq(RidderInviteTable.id, id), 
          eq(RidderInviteTable.userId, inviterId), 
          eq(RidderInviteTable.status, "CHECKING"),  // can only update the invite when it's on CHECKING status
        )).returning({
          id: RidderInviteTable.id,
          status: RidderInviteTable.status,
        });
        if (!responseOfUpdatingRidderInvite || responseOfUpdatingRidderInvite.length === 0) {
          throw ClientInviteNotFoundException;
        }

        const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId(
          (updateRidderInviteDto.status && updateRidderInviteDto.status === "CANCEL")
            ? NotificationTemplateOfCancelingRidderInvite(
                inviterName, 
                ridderInvite[0].passengerId as string, 
                responseOfUpdatingRidderInvite[0].id as string, 
              )
            : NotificationTemplateOfUpdatingRidderInvite(
                inviterName, 
                ridderInvite[0].passengerId as string, 
                responseOfUpdatingRidderInvite[0].id as string, 
              )
        );
        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
          throw ClientCreatePassengerNotificationException;
        }

        return [{
          hasConflict: (responseOfSelectingConfictRidderInvites && responseOfSelectingConfictRidderInvites.length !== 0), 
          ...responseOfUpdatingRidderInvite[0], 
        }];
    });
  }
  /* ================= Update detail operations used by Ridder ================= */


  /* ================= Accept or Reject operations used by Passenger ================= */
  async decideRidderInviteById(
    id: string,
    receiverId: string,
    receiverName: string, 
    decideRidderInviteDto: DecideRidderInviteDto,
  ) {
    // Note that the inviter here is the ridder, and the receiver here is the passenger

    // vaildate if the passenger by given receiverId is the creator of that PurchaseOrder
    const ridderInvite = await this.db.query.RidderInviteTable.findFirst({
      where: and(
        eq(RidderInviteTable.id, id), 
        eq(RidderInviteTable.status, "CHECKING"),  // can only update the invite when it's on CHECKING status
      ),
      with: {
        inviter: {
          columns: {
            id: true,
          }
        },
        order: {
          columns: {
            id: true,
            creatorId: true,
          },
        },
      }
    });
    if (!ridderInvite || !ridderInvite.order) throw ClientInviteNotFoundException;
    if (receiverId !== ridderInvite?.order?.creatorId) throw ClientUserHasNoAccessException;

    // if the user accept the order, then we should create an unstarted order in orderTable
    // and also delete the order on PurchaseOrderTable(since the passenger is deciding a ridderInvite here)
    // the above things should be done synchronously, hence we use transaction
    if (decideRidderInviteDto.status === "ACCEPTED") {
      return await this.db.transaction(async (tx) => {
        // first, we change the status of invite to accepted, and get some information from it
        const responseOfDecidingRidderInvite = await tx.update(RidderInviteTable).set({
          status: decideRidderInviteDto.status, // ACCEPTED
          updatedAt: new Date(),
        }).where(eq(RidderInviteTable.id, id))
          .returning({
            inviterId: RidderInviteTable.userId,
            inviterStartCord: RidderInviteTable.startCord,
            inviterEndCord: RidderInviteTable.endCord,
            inviterStartAddress: RidderInviteTable.startAddress,
            inviterEndAddress: RidderInviteTable.endAddress,
            suggestPrice: RidderInviteTable.suggestPrice,
            suggestStartAfter: RidderInviteTable.suggestStartAfter,
            suggestEndedAt: RidderInviteTable.suggestEndedAt,
            inviterDescription: RidderInviteTable.briefDescription,
            inviteStatus: RidderInviteTable.status,
        });
        if (!responseOfDecidingRidderInvite || responseOfDecidingRidderInvite.length === 0) {
          throw ClientInviteNotFoundException;
        }

        // second, before the deletion of the target SupplyOrder, 
        // we should update relative PassengerInvites which invite the SupplyOrder we want to delete later
        const responseOfRejectingOtherRidderInvites = await tx.update(RidderInviteTable).set({
          status: "REJECTED",
          updatedAt: new Date(),
        }).where(and(
          eq(RidderInviteTable.orderId, ridderInvite.order.id),
          ne(RidderInviteTable.id, id),
        )).returning({
          id: RidderInviteTable.id, 
          userId: RidderInviteTable.userId, 
        });
        if (responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0) {
          const responseOfCreatingNotificationToRejectOthers = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
            responseOfRejectingOtherRidderInvites.map((content) => {
              return NotificationTemplateOfRejectingRiddererInvite(
                receiverName, 
                `${receiverName} has found a better invite to start his/her travel`, 
                content.userId, 
                content.id, 
              )
            })
          );
          if (!responseOfCreatingNotificationToRejectOthers 
              || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherRidderInvites.length) {
                throw ClientCreateRidderNotificationException;
          }
        }

        // third, cancel the PurchaseOrder so that other ridder cannot repeatedly order it, and get some information from it
        const responseOfDeletingPurchaseOrder = await tx.update(PurchaseOrderTable).set({
          status: "RESERVED",
          updatedAt: new Date(),
        }).where(and(
          eq(PurchaseOrderTable.id, ridderInvite.order.id), 
          eq(PurchaseOrderTable.status, "POSTED"), 
        )).returning({
            receiverId: PurchaseOrderTable.creatorId,
            isUrgent: PurchaseOrderTable.isUrgent,
            receiverDescription: PurchaseOrderTable.description,
            orderStatus: PurchaseOrderTable.status,
        });
        if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
          throw ClientPurchaseOrderNotFoundException;
        }

        // last but not least, create the order
        const responseOfCreatingOrder = await tx.insert(OrderTable).values({
          ridderId: responseOfDecidingRidderInvite[0].inviterId,
          passengerId: responseOfDeletingPurchaseOrder[0].receiverId,
          prevOrderId: "PurchaseOrder" + " " + ridderInvite.order.id, 
          finalPrice: responseOfDecidingRidderInvite[0].suggestPrice, // the receiver accept the suggest price
          passengerDescription: responseOfDeletingPurchaseOrder[0].receiverDescription,
          ridderDescription: responseOfDecidingRidderInvite[0].inviterDescription,
          finalStartCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDecidingRidderInvite[0].inviterStartCord.x}, ${responseOfDecidingRidderInvite[0].inviterStartCord.y}), 4326)`,
          finalEndCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDecidingRidderInvite[0].inviterEndCord.x}, ${responseOfDecidingRidderInvite[0].inviterEndCord.y}), 4326)`, 
          finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
          startAfter: responseOfDecidingRidderInvite[0].suggestStartAfter,  // the receiver accept the suggest start time
          endedAt: responseOfDecidingRidderInvite[0].suggestEndedAt,
        }).returning({
          id: OrderTable.id,
          finalPrice: OrderTable.finalPrice,
          startAfter: OrderTable.startAfter,
          endedAt: OrderTable.endedAt,
          status: OrderTable.passengerStatus, // use either passengerStatus or ridderStatus is fine
        });
        if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
          throw ClientCreateOrderException;
        }

        const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
          NotificationTemplateOfAcceptingRidderInvite(
            receiverName, 
            ridderInvite.inviter.id, 
            responseOfCreatingOrder[0].id, 
          )
        );
        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
          throw ClientCreateRidderNotificationException;
        }

        return [{
          orderId: responseOfCreatingOrder[0].id,
          status: responseOfDecidingRidderInvite[0].inviteStatus,
          price: responseOfCreatingOrder[0].finalPrice,
          finalStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
          finalEndCord: responseOfDecidingRidderInvite[0].inviterEndCord,
          finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
          startAfter: responseOfCreatingOrder[0].startAfter,
          endedAt: responseOfCreatingOrder[0].endedAt,
          orderStatus: responseOfCreatingOrder[0].status, // use either passengerStatus or ridderStatus is fine
        }];
      });
    } else if (decideRidderInviteDto.status === "REJECTED") {
      const responseOfRejectingRidderInvite = await this.db.update(RidderInviteTable).set({
        status: decideRidderInviteDto.status, // must be REJECTED
        updatedAt: new Date(),
      }).where(eq(RidderInviteTable.id, id))
        .returning({
          id: RidderInviteTable.id, 
          ridderId: RidderInviteTable.userId, 
          status: RidderInviteTable.status,
          updatedAt: RidderInviteTable.updatedAt,
        });
      if (!responseOfRejectingRidderInvite || responseOfRejectingRidderInvite.length === 0) {
        throw ClientInviteNotFoundException;
      }

      const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
        NotificationTemplateOfRejectingRiddererInvite(
          receiverName, 
          decideRidderInviteDto.rejectReason, 
          responseOfRejectingRidderInvite[0].ridderId as string, 
          responseOfRejectingRidderInvite[0].id as string, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
      }

      return [{
        status: responseOfRejectingRidderInvite[0].status, 
      }];
    }
  }
  /* ================= Accept or Reject operations used by Passenger ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRidderInviteById(id: string, inviterId: string) {
    return await this.db.delete(RidderInviteTable)
      .where(and(
        eq(RidderInviteTable.id, id), 
        eq(RidderInviteTable.userId, inviterId),
        ne(RidderInviteTable.status, "CHECKING"), // can only delete the invite when it's NOT on CHECKING status
      ))
      .returning({
        id: RidderInviteTable.id,
        status: RidderInviteTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
