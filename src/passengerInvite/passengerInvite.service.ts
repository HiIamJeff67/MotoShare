import { Inject, Injectable } from '@nestjs/common';
import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { and, asc, desc, eq, gte, like, lt, lte, ne, not, or, sql } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { point } from '../interfaces/point.interface';
import { 
  ClientCreateOrderException, 
  ClientCreatePassengerInviteException, 
  ClientCreatePassengerNotificationException, 
  ClientCreateRidderNotificationException, 
  ClientEndBeforeStartException, 
  ClientInviteNotFoundException, 
  ClientSupplyOrderNotFoundException, 
  ClientUserHasNoAccessException, 
  ServerNeonAutoUpdateExpiredPassengerInviteException, 
} from '../exceptions';
import { OrderTable } from '../drizzle/schema/order.schema';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { 
  NotificationTemplateOfAcceptingPassengerInvite, 
  NotificationTemplateOfCancelingPassengerInvite, 
  NotificationTemplateOfCreatingPassengerInvite, 
  NotificationTemplateOfRejectingPassengerInvite, 
  NotificationTemplateOfUpdatingPassengerInvite 
} from '../notification/notificationTemplate';

@Injectable()
export class PassengerInviteService {
  constructor(
    private passengerNotification: PassengerNotificationService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(DRIZZLE) private db: DrizzleDB
  ) {}

  /* ================================= Detect And Update Expired PassengerInvites operations ================================= */
  private async updateExpiredPassengerInvites() {
    const response = await this.db.update(PassengerInviteTable).set({
      status: "CANCEL",
    }).where(and(
      eq(PassengerInviteTable.status, "CHECKING"),
      lt(PassengerInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: PassengerInviteTable.id, 
      userId: PassengerInviteTable.userId, 
    });
    if (!response) {
      throw ServerNeonAutoUpdateExpiredPassengerInviteException;
    }

    return response.length;
  }
  /* ================================= Detect And Update Expired PassengerInvites operations ================================= */

  
  /* ================================= Create operations ================================= */
  async createPassengerInviteByOrderId(
    inviterId: string, 
    inviterName: string, 
    orderId: string, 
    createPassengerInviteDto: CreatePassengerInviteDto,
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingConfictPassengerInvites = await tx.select({
        id: PassengerInviteTable.id, 
      }).from(PassengerInviteTable)
        .where(
          and(
            eq(PassengerInviteTable.userId, inviterId), 
            not(lte(PassengerInviteTable.suggestEndedAt, new Date(createPassengerInviteDto.suggestStartAfter))), 
            not(gte(PassengerInviteTable.suggestStartAfter, new Date(createPassengerInviteDto.suggestEndedAt))), 
        ));

      const responseOfSelectingSupplyOrder = await tx.select({
        ridderId: RidderTable.id, 
        status: SupplyOrderTable.status, 
      }).from(SupplyOrderTable)
        .where(and(
          eq(SupplyOrderTable.id, orderId), 
          eq(SupplyOrderTable.status, "POSTED")
        )).leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id));
      if (!responseOfSelectingSupplyOrder || responseOfSelectingSupplyOrder.length === 0
        || responseOfSelectingSupplyOrder[0].status !== "POSTED") {
          throw ClientSupplyOrderNotFoundException;
      }

      const responseOfCreatingPassengerInvite = await tx.insert(PassengerInviteTable).values({
        userId: inviterId,
        orderId: orderId,
        briefDescription: createPassengerInviteDto.briefDescription,
        suggestPrice: createPassengerInviteDto.suggestPrice,
        startCord: sql`ST_SetSRID(
          ST_MakePoint(${createPassengerInviteDto.startCordLongitude}, ${createPassengerInviteDto.startCordLatitude}),
          4326
        )`, 
        endCord: sql`ST_SetSRID(
          ST_MakePoint(${createPassengerInviteDto.endCordLongitude}, ${createPassengerInviteDto.endCordLatitude}),
          4326
        )`, 
        startAddress: createPassengerInviteDto.startAddress,
        endAddress: createPassengerInviteDto.endAddress,
        suggestStartAfter: new Date(createPassengerInviteDto.suggestStartAfter),
        suggestEndedAt: new Date(createPassengerInviteDto.suggestEndedAt),
      }).returning({
        id: PassengerInviteTable.id,
        orderId: PassengerInviteTable.orderId,
        status: PassengerInviteTable.status,
      });
      if (!responseOfCreatingPassengerInvite || responseOfCreatingPassengerInvite.length === 0) {
        throw ClientCreatePassengerInviteException;
      }

      const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
        NotificationTemplateOfCreatingPassengerInvite(
          inviterName, 
          responseOfSelectingSupplyOrder[0].ridderId as string, 
          responseOfCreatingPassengerInvite[0].id as string, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
      }

      return [{
        hasConflict: (responseOfSelectingConfictPassengerInvites && responseOfSelectingConfictPassengerInvites.length !== 0), 
        ...responseOfCreatingPassengerInvite[0], 
      }];
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  // for specifying the details of the other invites
  async getPassengerInviteById(
    id: string,
    userId: string, // can be inviter or receiver
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      suggestPrice: PassengerInviteTable.suggestPrice,
      inviteBriefDescription: PassengerInviteTable.briefDescription,
      suggestStartCord: PassengerInviteTable.startCord,
      suggestEndCord: PassengerInviteTable.endCord,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggestEndedAt: PassengerInviteTable.suggestEndedAt,
      inviteCreatedAt: PassengerInviteTable.createdAt,
      inviteUdpatedAt: PassengerInviteTable.updatedAt,
      inviteStatus: PassengerInviteTable.status,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      description: SupplyOrderTable.description,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      orderCreatedAt: SupplyOrderTable.createdAt,
      orderUpdatedAt: SupplyOrderTable.updatedAt,
      creatorName: RidderTable.userName,
      isOnline: RidderInfoTable.isOnline,
      avatorUrl: RidderInfoTable.avatorUrl,
      motocycleLicense: RidderInfoTable.motocycleLicense,
      motocycleType: RidderInfoTable.motocycleType,
      motocyclePhotoUrl: RidderInfoTable.motocyclePhotoUrl,
      phoneNumber: RidderInfoTable.phoneNumber,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(PassengerInviteTable.orderId, SupplyOrderTable.id))
      .where(and(
          eq(PassengerInviteTable.id, id), 
          or(
            eq(PassengerInviteTable.userId, userId),
            eq(SupplyOrderTable.creatorId, userId),
          ))
      )
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id));
  }

  /* ================= Search PassengerInvite operations used by Passengers ================= */
  // note that we can't use query to do the search, since we need to do some distance calculating
  // getting the invites which are created by current passenger
  async searchPaginationPassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable);
      
    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")))
    } else {  // specify before join -> faster
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
         .orderBy(desc(PassengerInviteTable.updatedAt))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }

  async searchAboutToStartPassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable);
      
    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")))
    } else {  // specify before join -> faster
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
         .orderBy(asc(PassengerInviteTable.suggestStartAfter))
         .limit(limit)
         .offset(offset);
    
    return await query;
  }

  async searchSimilarTimePassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable);

    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")));
    } else {
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId));
    }
    
    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
         .orderBy(
            sql`ABS(EXTRACT(EPOCH FROM (${PassengerInviteTable.suggestStartAfter} - ${SupplyOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${PassengerInviteTable.suggestEndedAt} - ${SupplyOrderTable.endedAt}))) ASC`
         ).limit(limit)
          .offset(offset);

    return await query;
  }
  
  async searchCurAdjacentPassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord}
      )`,
    }).from(PassengerInviteTable);

    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")));
    } else {
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId));
    }
    
    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
         .orderBy(sql`ST_Distance(
           ${SupplyOrderTable.startCord},
           ${PassengerInviteTable.startCord}
         )`)
         .limit(limit)
         .offset(offset);

    return await query;
  }

  async searchDestAdjacentPassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord}
      )`,
    }).from(PassengerInviteTable);

    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")));
    } else {
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`ST_Distance(
            ${SupplyOrderTable.endCord},
            ${PassengerInviteTable.endCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchSimilarRoutePassengerInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      RDV: sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord}
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord}
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord}
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord}
        )
      `,
    }).from(PassengerInviteTable);

    if (receiverName) {
      query.leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
           .where(and(eq(PassengerInviteTable.userId, inviterId), like(RidderTable.userName, receiverName + "%")));
    } else {
      query.where(eq(PassengerInviteTable.userId, inviterId))
           .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
           .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`
            ST_Distance(
              ${SupplyOrderTable.startCord},
              ${PassengerInviteTable.startCord}
          )
          + ST_Distance(
              ${PassengerInviteTable.startCord},
              ${PassengerInviteTable.endCord}
            )
          + ST_Distance(
              ${PassengerInviteTable.endCord},
              ${SupplyOrderTable.endCord}
            )
          - ST_Distance(
              ${SupplyOrderTable.startCord},
              ${SupplyOrderTable.endCord}
            )
          `)
          .limit(limit)
          .offset(offset);

    return await query;
  }
  /* ================= Search PassengerInvite operations used by Passengers ================= */


  /* ================= Search PassengerInvite operations used by Ridders ================= */
  // getting the invites which should be received by ridder
  // so note that the below APIs would be used by ridder, not the passenger,
  // but we still put these API routes in 'passengerInvite', since it's the invitation from passenger
  async searchPaginationPasssengerInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));
      
    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }
      
    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(desc(PassengerInviteTable.updatedAt))
          .limit(limit)
          .offset(offset);
    
    return await query;
  }

  async searchAboutToStartPassengerInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));
      
    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }
      
    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(asc(PassengerInviteTable.suggestStartAfter))
          .limit(limit)
          .offset(offset);
    
    return await query;
  }

  async searchSimilarTimePassengerInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(
            sql`ABS(EXTRACT(EPOCH FROM (${PassengerInviteTable.suggestStartAfter} - ${SupplyOrderTable.startAfter}))) +
                ABS(EXTRACT(EPOCH FROM (${PassengerInviteTable.suggestEndedAt} - ${SupplyOrderTable.endedAt}))) ASC`
          ).limit(limit)
           .offset(offset);

    return await query;
  }

  async searchCurAdjacentPassengerInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord}
      )`,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${SupplyOrderTable.startCord},
            ${PassengerInviteTable.startCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchDestAdjacentPassengerInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();

    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord}
      )`,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${SupplyOrderTable.endCord},
            ${PassengerInviteTable.endCord}
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchSimilarRoutePassengerInvitesByReceverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
    await this.updateExpiredPassengerInvites();
    
    const query = this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      suggestStartAddress: PassengerInviteTable.startAddress,
      suggestEndAddress: PassengerInviteTable.endAddress,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      suggestPrice: PassengerInviteTable.suggestPrice,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      suggesEndedAt: PassengerInviteTable.suggestEndedAt,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord}
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord}
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord}
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord}
        )
      `,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
           .where(and(eq(SupplyOrderTable.creatorId, receiverId), like(PassengerTable.userName, inviterName + "%")));
    } else {
      query.where(eq(SupplyOrderTable.creatorId, receiverId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`
            ST_Distance(
              ${SupplyOrderTable.startCord},
              ${PassengerInviteTable.startCord}
            )
          + ST_Distance(
              ${PassengerInviteTable.startCord},
              ${PassengerInviteTable.endCord}
            )
          + ST_Distance(
              ${PassengerInviteTable.endCord},
              ${SupplyOrderTable.endCord}
            )
          - ST_Distance(
              ${SupplyOrderTable.startCord},
              ${SupplyOrderTable.endCord}
            )
          `)
          .limit(limit)
          .offset(offset);

    return await query;
  }
  /* ================= Search PassengerInvite operations used by Ridders ================= */

  /* ================================= Get operations ================================= */
  

  /* ================================= Update operations ================================= */

  /* ================= Update detail operations used by Passenger ================= */
  async updatePassengerInviteById(
    id: string,
    inviterId: string,  // for validating the current user is the owner to that invite
    inviterName: string, 
    updatePassengerInviteDto: UpdatePassengerInviteDto,
  ) {
    return this.db.transaction(async (tx) => {
      const newStartCord: point | undefined = 
        (updatePassengerInviteDto.startCordLongitude !== undefined
          && updatePassengerInviteDto.startCordLatitude !== undefined)
        ? { x: updatePassengerInviteDto.startCordLongitude, y: updatePassengerInviteDto.startCordLatitude }
        : undefined;
    
      const newEndCord: point | undefined = 
        (updatePassengerInviteDto.endCordLongitude !== undefined
          && updatePassengerInviteDto.endCordLatitude !== undefined)
        ? { x: updatePassengerInviteDto.endCordLongitude, y: updatePassengerInviteDto.endCordLatitude }
        : undefined;

      // check if endedAt is earlier than startAfter
      const passengerInvite = await tx.select({
        ridderId: RidderTable.id, 
        suggestStartAfter: PassengerInviteTable.suggestStartAfter, 
        suggestEndedAt: PassengerInviteTable.suggestEndedAt, 
      }).from(PassengerInviteTable)
        .where(and(
          eq(PassengerInviteTable.id, id), 
          eq(PassengerInviteTable.userId, inviterId), 
          eq(PassengerInviteTable.status, "CHECKING"),
      )).leftJoin(SupplyOrderTable, eq(PassengerInviteTable.orderId, SupplyOrderTable.id))
        .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id));
      if (!passengerInvite || passengerInvite.length === 0) throw ClientInviteNotFoundException;

      let responseOfSelectingConflictPassengerInvites: any = undefined;
      if (updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPassengerInvites = await tx.select({
          id: PassengerInviteTable.id, 
        }).from(PassengerInviteTable)
          .where(and(
            eq(PassengerInviteTable.userId, inviterId), 
            not(lte(PassengerInviteTable.suggestEndedAt, new Date(updatePassengerInviteDto.suggestStartAfter))), 
            not(gte(PassengerInviteTable.suggestStartAfter, new Date(updatePassengerInviteDto.suggestEndedAt))), 
          ));
      } else if (updatePassengerInviteDto.suggestStartAfter && !updatePassengerInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(passengerInvite[0].suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPassengerInvites = await tx.select({
          id: PassengerInviteTable.id, 
        }).from(PassengerInviteTable)
          .where(and(
            eq(PassengerInviteTable.userId, inviterId), 
            not(lte(PassengerInviteTable.suggestEndedAt, new Date(updatePassengerInviteDto.suggestStartAfter)))
          ));
      } else if (!updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
        const [startAfter, endedAt] = [new Date(passengerInvite[0].suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPassengerInvites = await tx.select({
          id: PassengerInviteTable.id, 
        }).from(PassengerInviteTable)
          .where(and(
            eq(PassengerInviteTable.userId, inviterId), 
            not(gte(PassengerInviteTable.suggestStartAfter, new Date(updatePassengerInviteDto.suggestEndedAt)))
          ));
      }

      const responseOfUpdatingPassengerInvite = await tx.update(PassengerInviteTable).set({
        briefDescription: updatePassengerInviteDto.briefDescription,
        suggestPrice: updatePassengerInviteDto.suggestPrice,
        ...(newStartCord 
          ? { startCord: sql`ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)`}
          : {}
        ),
        ...(newEndCord 
          ? { endCord: sql`ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)`}
          : {}
        ),
        startAddress: updatePassengerInviteDto.startAddress,
        endAddress: updatePassengerInviteDto.endAddress,
        ...(updatePassengerInviteDto.suggestStartAfter
          ? { suggestStartAfter: new Date(updatePassengerInviteDto.suggestStartAfter) }
          : {}
        ),
        ...(updatePassengerInviteDto.suggestEndedAt
          ? { suggestEndedAt: new Date(updatePassengerInviteDto.suggestEndedAt) }
          : {}
        ),
        updatedAt: new Date(),
        status: updatePassengerInviteDto.status,  // either CHECKING or CANCEL
      }).where(and(
        eq(PassengerInviteTable.id, id), 
        eq(PassengerInviteTable.userId, inviterId),
        eq(PassengerInviteTable.status, "CHECKING"),
      )).returning({
        id: PassengerInviteTable.id,
        status: PassengerInviteTable.status,
      });
      if (!responseOfUpdatingPassengerInvite || responseOfUpdatingPassengerInvite.length === 0) {
        throw ClientInviteNotFoundException;
      }

      const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
        (updatePassengerInviteDto.status && updatePassengerInviteDto.status === "CANCEL")
        ? NotificationTemplateOfCancelingPassengerInvite(
            inviterName, 
            passengerInvite[0].ridderId as string, 
            responseOfUpdatingPassengerInvite[0].id as string, 
          )
        : NotificationTemplateOfUpdatingPassengerInvite(
            inviterName, 
            passengerInvite[0].ridderId as string, 
            responseOfUpdatingPassengerInvite[0].id as string, 
          )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
      }

      return [{
        hasConflict: (responseOfSelectingConflictPassengerInvites && responseOfSelectingConflictPassengerInvites.length !== 0), 
        ...responseOfUpdatingPassengerInvite[0], 
      }];
    });
  }
  /* ================= Update detail operations used by Passenger ================= */


  /* ================= Accept or Reject operations used by Ridder ================= */
  async decidePassengerInviteById(
    id: string,
    receiverId: string,
    receiverName: string, 
    decidePassengerInviteDto: DecidePassengerInviteDto,
  ) {
    // Note that the inviter here is the passenger, and the receiver here is the ridder

    // vaildate if the ridder by given receiverId is the creator of that SupplyOrder
    const passengerInvite = await this.db.query.PassengerInviteTable.findFirst({
      where: and(
        eq(PassengerInviteTable.id, id),
        eq(PassengerInviteTable.status, "CHECKING"),
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
    if (!passengerInvite || !passengerInvite.order) throw ClientInviteNotFoundException;
    if (receiverId !== passengerInvite?.order?.creatorId) throw ClientUserHasNoAccessException;

    if (decidePassengerInviteDto.status === "ACCEPTED") {
      return await this.db.transaction(async (tx) => {
        const responseOfDecidingPassengerInvite = await tx.update(PassengerInviteTable).set({
          status: decidePassengerInviteDto.status,  // must be ACCEPTED
          updatedAt: new Date(),
        }).where(eq(PassengerInviteTable.id, id))
          .returning({
            inviterId: PassengerInviteTable.userId,
            inviterStartCord: PassengerInviteTable.startCord,
            inviterEndCord: PassengerInviteTable.endCord,
            inviterStartAddress: PassengerInviteTable.startAddress,
            inviterEndAddress: PassengerInviteTable.endAddress,
            suggestPrice: PassengerInviteTable.suggestPrice,
            suggestStartAfter: PassengerInviteTable.suggestStartAfter,
            suggestEndedAt: PassengerInviteTable.suggestEndedAt,
            inviterDescription: PassengerInviteTable.briefDescription,
            inviteStatus: PassengerInviteTable.status,
        });
        if (!responseOfDecidingPassengerInvite || responseOfDecidingPassengerInvite.length === 0) {
          throw ClientInviteNotFoundException;
        }

        const responseOfRejectingOtherPassengerInvites = await tx.update(PassengerInviteTable).set({
          status: "REJECTED",
          updatedAt: new Date(),
        }).where(and(
          eq(PassengerInviteTable.orderId, passengerInvite.order.id),
          ne(PassengerInviteTable.id, id),
        )).returning({
          id: PassengerInviteTable.id, 
          userId: PassengerInviteTable.userId, 
        });
        if (responseOfRejectingOtherPassengerInvites && responseOfRejectingOtherPassengerInvites.length !== 0) {
          const responseOfCreatingNotificationToRejectOthers = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
            responseOfRejectingOtherPassengerInvites.map((content) => {
              return NotificationTemplateOfRejectingPassengerInvite(
                receiverName, 
                `${receiverName} has found a better invite to start his/her travel`, 
                content.userId, 
                content.id, 
              )
            })
          );
          if (!responseOfCreatingNotificationToRejectOthers 
              || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherPassengerInvites.length) {
                throw ClientCreatePassengerNotificationException;
          }
        }

        const responseOfDeletingSupplyOrder = await tx.update(SupplyOrderTable).set({ // will delete this supplyOrder later
          status: "RESERVED",
          updatedAt: new Date(),
        }).where(and(
          eq(SupplyOrderTable.id, passengerInvite.order.id), 
          eq(SupplyOrderTable.status, "POSTED"), 
        )).returning({
            receiverId: SupplyOrderTable.creatorId,
            tolerableRDV: SupplyOrderTable.tolerableRDV,
            receiverDescription: SupplyOrderTable.description,
            orderStatus: SupplyOrderTable.status,
        });
        if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
          throw ClientSupplyOrderNotFoundException;
        }

        const responseOfCreatingOrder = await tx.insert(OrderTable).values({
          ridderId: responseOfDeletingSupplyOrder[0].receiverId,
          passengerId: responseOfDecidingPassengerInvite[0].inviterId,
          prevOrderId: "SupplyOrder" + " " + passengerInvite.order.id,
          finalPrice: responseOfDecidingPassengerInvite[0].suggestPrice,
          passengerDescription: responseOfDecidingPassengerInvite[0].inviterDescription,
          ridderDescription: responseOfDeletingSupplyOrder[0].receiverDescription, 
          finalStartCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDecidingPassengerInvite[0].inviterStartCord.x}, ${responseOfDecidingPassengerInvite[0].inviterStartCord.y}), 4326)`,
          finalEndCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDecidingPassengerInvite[0].inviterEndCord.x}, ${responseOfDecidingPassengerInvite[0].inviterEndCord.y}), 4326)`, 
          finalStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
          startAfter: responseOfDecidingPassengerInvite[0].suggestStartAfter,
          endedAt: responseOfDecidingPassengerInvite[0].suggestEndedAt,
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

        const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId(
          NotificationTemplateOfAcceptingPassengerInvite(
            receiverName, 
            passengerInvite.inviter.id, 
            responseOfCreatingOrder[0].id, 
          )
        );
        if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
          throw ClientCreatePassengerNotificationException;
        }

        return [{
          orderId: responseOfCreatingOrder[0].id,
          status: responseOfDecidingPassengerInvite[0].inviteStatus,
          price: responseOfCreatingOrder[0].finalPrice,
          finalStartCord: responseOfDecidingPassengerInvite[0].inviterStartCord,
          finalEndCord: responseOfDecidingPassengerInvite[0].inviterEndCord,
          finalStartAddress: responseOfDecidingPassengerInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingPassengerInvite[0].inviterEndAddress,
          startAfter: responseOfCreatingOrder[0].startAfter,
          endedAt: responseOfCreatingOrder[0].endedAt,
          orderStatus: responseOfCreatingOrder[0].status,
        }];
      });
    } else if (decidePassengerInviteDto.status === "REJECTED") {
      const responseOfRejectingPassengerInvite = await this.db.update(PassengerInviteTable).set({
        status: decidePassengerInviteDto.status,  // must be REJECTED
        updatedAt: new Date(), 
      }).where(eq(PassengerInviteTable.id, id))
        .returning({
          id: PassengerInviteTable.id, 
          passengerId: PassengerInviteTable.userId, 
          status: PassengerInviteTable.status,
          updatedAt: PassengerInviteTable.updatedAt,
        });
      if (!responseOfRejectingPassengerInvite || responseOfRejectingPassengerInvite.length === 0) {
        throw ClientInviteNotFoundException;
      }

      const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId(
        NotificationTemplateOfRejectingPassengerInvite(
          receiverName, 
          decidePassengerInviteDto.rejectReason, 
          responseOfRejectingPassengerInvite[0].passengerId as string, 
          responseOfRejectingPassengerInvite[0].id as string, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreatePassengerNotificationException;
      }
      
      return [{
        status: responseOfRejectingPassengerInvite[0].status, 
      }];
    }
  }
  /* ================= Accept or Reject operations used by Ridder ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerInviteById(id: string, inviterId: string) {
    return await this.db.delete(PassengerInviteTable)
      .where(and(
        eq(PassengerInviteTable.id, id), 
        eq(PassengerInviteTable.userId, inviterId),
        ne(PassengerInviteTable.status, "CHECKING"),
      ))
      .returning({
        id: PassengerInviteTable.id,
        status: PassengerInviteTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}