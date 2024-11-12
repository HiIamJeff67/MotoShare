import { Inject, Injectable } from '@nestjs/common';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { RidderInviteTable } from '../drizzle/schema/ridderInvite.schema';
import { and, desc, eq, like, or, sql } from 'drizzle-orm';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { point } from '../interfaces/point.interface';
import { ClientUserHasNoAccessException } from '../exceptions';

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
      suggestStartAfter: createRidderInviteDto.suggestStartAfter,
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
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      inviteCreatedAt: RidderInviteTable.createdAt,
      inviteUdpatedAt: RidderInviteTable.updatedAt,
      inviteStatus: RidderInviteTable.status,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      description: PurchaseOrderTable.description,
      startAfter: PurchaseOrderTable.startAfter,
      orderCreatedAt: PurchaseOrderTable.createdAt,
      orderUpdatedAt: PurchaseOrderTable.updatedAt,
      creatorName: PassengerTable.userName,
      isOnline: PassengerInfoTable.isOnline,
      avatorUrl: PassengerInfoTable.avatorUrl,
      phoneNumber: PassengerInfoTable.phoneNumber,
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
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggetStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable);
      
    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName)))
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
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggetStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord},
      )`,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName)));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${RidderInviteTable.startCord},
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
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggetStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ${RidderInviteTable.endCord},
      )`,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName)));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.endCord},
            ${RidderInviteTable.endCord},
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
      receiverName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggetStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${RidderInviteTable.startCord},
        )
      + ST_Distance(
          ${RidderInviteTable.startCord},
          ${RidderInviteTable.endCord},
        )
      + ST_Distance(
          ${RidderInviteTable.endCord},
          ${PurchaseOrderTable.endCord},
        )
      - ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${PurchaseOrderTable.endCord},
        )
      `,
    }).from(RidderInviteTable);

    if (receiverName) {
      query.leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
           .where(and(eq(RidderInviteTable.userId, inviterId), like(PassengerTable.userName, receiverName)));
    } else {
      query.where(eq(RidderInviteTable.userId, inviterId))
           .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId))
           .leftJoin(PassengerTable, eq(PassengerTable.id, PurchaseOrderTable.creatorId))
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
          .orderBy(sql`
            ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${RidderInviteTable.startCord},
          )
          + ST_Distance(
              ${RidderInviteTable.startCord},
              ${RidderInviteTable.endCord},
            )
          + ST_Distance(
              ${RidderInviteTable.endCord},
              ${PurchaseOrderTable.endCord},
            )
          - ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${PurchaseOrderTable.endCord},
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
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));
      
    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName)));
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
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ${RidderInviteTable.startCord},
      )`,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName)));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${RidderInviteTable.startCord},
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
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ${RidderInviteTable.endCord},
      )`,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName)));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.endCord},
            ${RidderInviteTable.endCord},
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
      inviterName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      suggestPrice: RidderInviteTable.suggestPrice,
      startAfter: PurchaseOrderTable.startAfter,
      suggestStartAfter: RidderInviteTable.suggestStartAfter,
      createdAt: RidderInviteTable.createdAt,
      updatedAt: RidderInviteTable.updatedAt,
      status: RidderInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${RidderInviteTable.startCord},
        )
      + ST_Distance(
          ${RidderInviteTable.startCord},
          ${RidderInviteTable.endCord},
        )
      + ST_Distance(
          ${RidderInviteTable.endCord},
          ${PurchaseOrderTable.endCord},
        )
      - ST_Distance(
          ${PurchaseOrderTable.startCord},
          ${PurchaseOrderTable.endCord},
        )
      `,
    }).from(RidderInviteTable)
      .leftJoin(PurchaseOrderTable, eq(PurchaseOrderTable.id, RidderInviteTable.orderId));

    if (inviterName) {
      query.leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId))
           .where(and(eq(PurchaseOrderTable.creatorId, receiverId), like(RidderTable.userName, inviterName)));
    } else {
      query.where(eq(PurchaseOrderTable.creatorId, receiverId))
           .leftJoin(RidderTable, eq(RidderTable.id, RidderInviteTable.userId));
    }

    query.leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
          .orderBy(sql`
            ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${RidderInviteTable.startCord},
            )
          + ST_Distance(
              ${RidderInviteTable.startCord},
              ${RidderInviteTable.endCord},
            )
          + ST_Distance(
              ${RidderInviteTable.endCord},
              ${PurchaseOrderTable.endCord},
            )
          - ST_Distance(
              ${PurchaseOrderTable.startCord},
              ${PurchaseOrderTable.endCord},
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

    return await this.db.update(RidderInviteTable).set({
      briefDescription: updateRidderInviteDto.briefDescription,
      suggestPrice: updateRidderInviteDto.suggestPrice,
      startCord: newStartCord,
      endCord: newEndCord,
      suggestStartAfter: updateRidderInviteDto.suggestStartAfter,
      updatedAt: new Date(),
      status: updateRidderInviteDto.status,
    }).where(and(eq(RidderInviteTable.id, id), eq(RidderInviteTable.userId, inviterId)))
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
    // vaildate if the ridder by given receiverId is the creator of that SupplyOrder
    const supplyOrder = await this.db.query.PassengerInviteTable.findFirst({
      where: eq(RidderInviteTable.id, id),
      with: {
        order: {
          columns: {
            creatorId: true,
          }
        }
      }
    });
    
    if (supplyOrder && supplyOrder.order && receiverId !== supplyOrder?.order?.creatorId) {
      throw ClientUserHasNoAccessException;
    }

    return await this.db.update(RidderInviteTable).set({
      status: decideRidderInviteDto.status,
    }).where(eq(RidderInviteTable.id, id))
  }
  /* ================= Accept or Reject operations used by Passenger ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRidderInviteById(id: string, inviterId: string) {
    return await this.db.delete(RidderInviteTable)
      .where(and(eq(RidderInviteTable.id, id), eq(RidderInviteTable.userId, inviterId)))
      .returning({
        id: RidderInviteTable.id,
        status: RidderInviteTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
