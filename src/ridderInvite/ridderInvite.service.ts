import { Inject, Injectable } from '@nestjs/common';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { RidderInviteTable } from '../drizzle/schema/ridderInvite.schema';
import { and, desc, eq, like, ne, or, sql } from 'drizzle-orm';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { point } from '../interfaces/point.interface';
import { ClientCreateOrderException, ClientEndBeforeStartException, ClientInviteNotFoundException, ClientPurchaseOrderNotFoundException, ClientUserHasNoAccessException } from '../exceptions';
import { OrderTable } from '../drizzle/schema/order.schema';

@Injectable()
export class RidderInviteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createRidderInviteByOrderId(
    inviterId: string,
    orderId: string,
    createRidderInviteDto: CreateRidderInviteDto,
  ) {
    return await this.db.insert(RidderInviteTable).values({
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
      status: "CHECKING",
    }).returning({
      id: RidderInviteTable.id,
      orderId: RidderInviteTable.orderId,
      createdAt: RidderInviteTable.createdAt,
      status: RidderInviteTable.status,
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

  async searchCurAdjacentRidderInvitesByInviterId(
    inviterId: string,
    receiverName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
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
  /* ================= Search RidderInvite operations used by Ridders ================= */


  /* ================= Search RidderInvite operations used by Passengers ================= */
  async searchPaginationRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
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

  async searchCurAdjacentRidderInvitesByReceiverId(
    receiverId: string,
    inviterName: string | undefined = undefined,
    limit: number,
    offset: number,
  ) {
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
  /* ================= Search RidderInvite operations used by Passengers ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */

  /* ================= Update detail operations used by Ridder ================= */
  async updateRidderInviteById(
    id: string,
    inviterId: string,  // for validating the current user is the owner to that invite
    updateRidderInviteDto: UpdateRidderInviteDto,
  ) {
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

    if (updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
      const startAfter = new Date(updateRidderInviteDto.suggestStartAfter), 
            endedAt = new Date(updateRidderInviteDto.suggestEndedAt);
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (updateRidderInviteDto.suggestStartAfter && !updateRidderInviteDto.suggestEndedAt) {
      const tempResponse = await this.db.select({
        suggestEndedAt: RidderInviteTable.suggestEndedAt,
      }).from(RidderInviteTable)
        .where(and(
          eq(RidderInviteTable.id, id), 
          eq(RidderInviteTable.userId, inviterId), 
          eq(RidderInviteTable.status, "CHECKING"),
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientInviteNotFoundException;

      const [startAfter, endedAt] = [new Date(updateRidderInviteDto.suggestStartAfter), new Date(tempResponse[0].suggestEndedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (!updateRidderInviteDto.suggestStartAfter && updateRidderInviteDto.suggestEndedAt) {
      const tempResponse = await this.db.select({
        suggestStartAfter: RidderInviteTable.suggestStartAfter,
      }).from(RidderInviteTable)
        .where(and(
          eq(RidderInviteTable.id, id), 
          eq(RidderInviteTable.userId, inviterId), 
          eq(RidderInviteTable.status, "CHECKING"),  // can only update the invite when it's on CHECKING status
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientInviteNotFoundException;

      const [startAfter, endedAt] = [new Date(tempResponse[0].suggestStartAfter), new Date(updateRidderInviteDto.suggestEndedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    }

    return await this.db.update(RidderInviteTable).set({
      briefDescription: updateRidderInviteDto.briefDescription,
      suggestPrice: updateRidderInviteDto.suggestPrice,
      startCord: newStartCord,
      endCord: newEndCord,
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
      ))
      .returning({
        id: RidderInviteTable.id,
        updatedAt: RidderInviteTable.updatedAt,
        status: RidderInviteTable.status,
      });
  }
  /* ================= Update detail operations used by Ridder ================= */


  /* ================= Accept or Reject operations used by Passenger ================= */
  async decideRidderInviteById(
    id: string,
    receiverId: string,
    decideRidderInviteDto: DecideRidderInviteDto,
  ) {
    // Note that the inviter here is the ridder, and the receiver here is the passenger

    // vaildate if the passenger by given receiverId is the creator of that PurchaseOrder
    const purchaseOrder = await this.db.query.RidderInviteTable.findFirst({
      where: and(
        eq(RidderInviteTable.id, id), 
        eq(RidderInviteTable.status, "CHECKING"),  // can only update the invite when it's on CHECKING status
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
    if (!purchaseOrder || !purchaseOrder.order) throw ClientInviteNotFoundException;
    if (receiverId !== purchaseOrder?.order?.creatorId) throw ClientUserHasNoAccessException;

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
        if (!responseOfDecidingRidderInvite 
            || responseOfDecidingRidderInvite.length === 0) {
              throw ClientInviteNotFoundException;
        }

        // second, before the deletion of the target SupplyOrder, 
        // we should update relative PassengerInvites which invite the SupplyOrder we want to delete later
        await tx.update(RidderInviteTable).set({
          status: "REJECTED",
          updatedAt: new Date(),
        }).where(and(
          eq(RidderInviteTable.orderId, purchaseOrder.order.id),
          ne(RidderInviteTable.id, id),
        ));

        // third, cancel the PurchaseOrder so that other ridder cannot repeatedly order it, and get some information from it
        const responseOfDeletingPurchaseOrder = await tx.update(PurchaseOrderTable).set({
          status: "RESERVED",
          updatedAt: new Date(),
        }).where(eq(PurchaseOrderTable.id, purchaseOrder.order.id))
          .returning({
            receiverId: PurchaseOrderTable.creatorId,
            isUrgent: PurchaseOrderTable.isUrgent,
            receiverDescription: PurchaseOrderTable.description,
            orderStatus: PurchaseOrderTable.status,
        });
        if (!responseOfDeletingPurchaseOrder
            || responseOfDeletingPurchaseOrder.length === 0) {
              throw ClientPurchaseOrderNotFoundException;
        }

        // last but not least, create the order
        const responseOfCreatingOrder = await tx.insert(OrderTable).values({
          ridderId: responseOfDecidingRidderInvite[0].inviterId,
          passengerId: responseOfDeletingPurchaseOrder[0].receiverId,
          prevOrderId: "PurchaseOrder" + " " + purchaseOrder.order.id, 
          finalPrice: responseOfDecidingRidderInvite[0].suggestPrice, // the receiver accept the suggest price
          passengerDescription: responseOfDeletingPurchaseOrder[0].receiverDescription,
          ridderDescription: responseOfDecidingRidderInvite[0].inviterDescription,
          finalStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
          finalEndCord: responseOfDecidingRidderInvite[0].inviterEndCord,
          finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
          startAfter: responseOfDecidingRidderInvite[0].suggestStartAfter,  // the receiver accept the suggest start time
          endedAt: responseOfDecidingRidderInvite[0].suggestEndedAt,
          // endAt: , // will be covered the autocomplete function powered by google in the future
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
          status: responseOfDecidingRidderInvite[0].inviteStatus,
          price: responseOfCreatingOrder[0].finalPrice,
          finalStartCord: responseOfDecidingRidderInvite[0].inviterStartCord,
          finalEndCord: responseOfDecidingRidderInvite[0].inviterEndCord,
          finalStartAddress: responseOfDecidingRidderInvite[0].inviterStartAddress,
          finalEndAddress: responseOfDecidingRidderInvite[0].inviterEndAddress,
          startAfter: responseOfCreatingOrder[0].startAfter,
          endedAt: responseOfCreatingOrder[0].endedAt,
          orderStatus: responseOfCreatingOrder[0].status, // use either passengerStatus or ridderStatus is fine
        }]
      });
    } else if (decideRidderInviteDto.status === "REJECTED") {
      return await this.db.update(RidderInviteTable).set({
        status: decideRidderInviteDto.status, // must be REJECTED
        updatedAt: new Date(),
      }).where(eq(RidderInviteTable.id, id))
        .returning({
          status: RidderInviteTable.status,
          updatedAt: RidderInviteTable.updatedAt,
        });
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
