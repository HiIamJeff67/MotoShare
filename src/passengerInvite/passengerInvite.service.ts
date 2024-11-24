import { Inject, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { and, asc, desc, eq, like, lt, ne, or, sql } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { point } from '../interfaces/point.interface';
import { ClientCreateOrderException, ClientEndBeforeStartException, ClientInviteNotFoundException, ClientSupplyOrderNotFoundException, ClientUserHasNoAccessException, ServerNeonAutoUpdateExpiredPassengerInviteException } from '../exceptions';
import { OrderTable } from '../drizzle/schema/order.schema';

@Injectable()
export class PassengerInviteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Detect And Update Expired PassengerInvites operations ================================= */
  private async updateExpiredPassengerInvites() {
    const response = await this.db.update(PassengerInviteTable).set({
      status: "CANCEL",
    }).where(and(
      eq(PassengerInviteTable.status, "CHECKING"),
      lt(PassengerInviteTable.suggestStartAfter, new Date()), 
    )).returning({
      id: PassengerInviteTable.id, 
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
    orderId: string, 
    createPassengerInviteDto: CreatePassengerInviteDto,
  ) {
    return await this.db.insert(PassengerInviteTable).values({
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
    updatePassengerInviteDto: UpdatePassengerInviteDto,
  ) {
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
    if (updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
      const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (updatePassengerInviteDto.suggestStartAfter && !updatePassengerInviteDto.suggestEndedAt) {
      const tempResponse = await this.db.select({
        suggestEndedAt: PassengerInviteTable.suggestEndedAt,
      }).from(PassengerInviteTable)
        .where(and(
          eq(PassengerInviteTable.id, id), 
          eq(PassengerInviteTable.userId, inviterId), 
          eq(PassengerInviteTable.status, "CHECKING"),
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientInviteNotFoundException;

      const [startAfter, endedAt] = [new Date(updatePassengerInviteDto.suggestStartAfter), new Date(tempResponse[0].suggestEndedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (!updatePassengerInviteDto.suggestStartAfter && updatePassengerInviteDto.suggestEndedAt) {
      const tempResponse = await this.db.select({
        suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      }).from(PassengerInviteTable)
        .where(and(
          eq(PassengerInviteTable.id, id), 
          eq(PassengerInviteTable.userId, inviterId), 
          eq(PassengerInviteTable.status, "CHECKING"),
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientEndBeforeStartException;

      const [startAfter, endedAt] = [new Date(tempResponse[0].suggestStartAfter), new Date(updatePassengerInviteDto.suggestEndedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    }

    return await this.db.update(PassengerInviteTable).set({
      briefDescription: updatePassengerInviteDto.briefDescription,
      suggestPrice: updatePassengerInviteDto.suggestPrice,
      startCord: newStartCord,
      endCord: newEndCord,
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
    ))
      .returning({
        id: PassengerInviteTable.id,
        status: PassengerInviteTable.status,
      });
  }
  /* ================= Update detail operations used by Passenger ================= */


  /* ================= Accept or Reject operations used by Ridder ================= */
  async decidePassengerInviteById(
    id: string,
    receiverId: string,
    decidePassengerInviteDto: DecidePassengerInviteDto,
  ) {
    // Note that the inviter here is the passenger, and the receiver here is the ridder

    // vaildate if the ridder by given receiverId is the creator of that SupplyOrder
    const supplyOrder = await this.db.query.PassengerInviteTable.findFirst({
      where: and(
        eq(PassengerInviteTable.id, id),
        eq(PassengerInviteTable.status, "CHECKING"),
      ),
      with: {
        order: {
          columns: {
            id: true,
            creatorId: true,
          }
        }
      }
    });
    if (!supplyOrder || !supplyOrder.order) throw ClientInviteNotFoundException;
    if (receiverId !== supplyOrder?.order?.creatorId) throw ClientUserHasNoAccessException;

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
        if (!responseOfDecidingPassengerInvite
          || responseOfDecidingPassengerInvite.length === 0) {
            throw ClientInviteNotFoundException;
        }

        await tx.update(PassengerInviteTable).set({
          status: "REJECTED",
          updatedAt: new Date(),
        }).where(and(
          eq(PassengerInviteTable.orderId, supplyOrder.order.id),
          ne(PassengerInviteTable.id, id),
        ));

        const responseOfDeletingSupplyOrder = await tx.update(SupplyOrderTable).set({ // will delete this supplyOrder later
          status: "RESERVED",
          updatedAt: new Date(),
        }).where(eq(SupplyOrderTable.id, supplyOrder.order.id))
          .returning({
            receiverId: SupplyOrderTable.creatorId,
            tolerableRDV: SupplyOrderTable.tolerableRDV,
            receiverDescription: SupplyOrderTable.description,
            orderStatus: SupplyOrderTable.status,
        });
        if (!responseOfDeletingSupplyOrder
            || responseOfDeletingSupplyOrder.length === 0) {
              throw ClientSupplyOrderNotFoundException;
        }

        const responseOfCreatingOrder = await tx.insert(OrderTable).values({
          ridderId: responseOfDeletingSupplyOrder[0].receiverId,
          passengerId: responseOfDecidingPassengerInvite[0].inviterId,
          prevOrderId: "SupplyOrder" + " " + supplyOrder.order.id,
          finalPrice: responseOfDecidingPassengerInvite[0].suggestPrice,
          passengerDescription: responseOfDecidingPassengerInvite[0].inviterDescription,
          ridderDescription: responseOfDeletingSupplyOrder[0].receiverDescription, 
          finalStartCord: responseOfDecidingPassengerInvite[0].inviterStartCord,
          finalEndCord: responseOfDecidingPassengerInvite[0].inviterEndCord,
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
        if (!responseOfCreatingOrder 
            || responseOfCreatingOrder.length === 0) {
              throw ClientCreateOrderException;
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
        }]
      });
    } else if (decidePassengerInviteDto.status === "REJECTED") {
      return await this.db.update(PassengerInviteTable).set({
        status: decidePassengerInviteDto.status,  // must be REJECTED
      }).where(eq(PassengerInviteTable.id, id))
        .returning({
          status: PassengerInviteTable.status,
          updatedAt: PassengerInviteTable.updatedAt,
        });
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