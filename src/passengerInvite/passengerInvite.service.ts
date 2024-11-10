import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { point } from '../interfaces/point.interface';

@Injectable()
export class PassengerInviteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  
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
      suggestStartAfter: createPassengerInviteDto.suggestStartAfter,
      status: "CHECKING",
    }).returning({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      createdAt: PassengerInviteTable.createdAt,
      status: PassengerInviteTable.status,
    });
  }
  /* ================================= Create operations ================================= */



  /* ================================= Get operations ================================= */
  // for specifying the details of the other invites
  async getPassengerInviteById(id: string) {
    return await this.db.query.PassengerInviteTable.findFirst({
      where: eq(PassengerInviteTable.id, id),
      columns: {
        id: true,
        suggestPrice: true,
        briefDescription: true,
        startCord: true,
        endCord: true,
        suggestStartAfter: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
      with: {
        order: {
          columns: {
            initPrice: true,
            startCord: true,
            endCord: true,
            description: true,
            startAfter: true,
            createdAt: true,
            updatedAt: true,
          },
          with: {
            creator: {
              columns: {
                userName: true,
              },
              with: {
                info: {
                  columns: {
                    isOnline: true,
                    avatorUrl: true,
                    motocycleType: true,
                    motocyclePhotoUrl: true,
                    // the below things can be display, since the passenger must have validate to see this
                    phoneNumber: true,
                    motocycleLicense: true,
                  }
                }
              }
            }
          }
        }
      },
    });
  }

  /* ================= Search operations used by Passengers ================= */
  // note that we can't use query to do the search, since we need to do some distance calculating
  // getting the invites which are created by current passenger
  async searchPaginationPassengerInvitesByInviterId(
    inviterId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggetStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable)
      .where(eq(PassengerInviteTable.userId, inviterId))
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
      .orderBy(desc(PassengerInviteTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }
  
  async searchCurAdjacentPassengerInvitesByInviterId(
    inviterId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggetStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord},
      )`,
    }).from(PassengerInviteTable)
      .where(eq(PassengerInviteTable.userId, inviterId))
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord},
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchDestAdjacentPassengerInvitesByInviterId(
    inviterId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggetStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord},
      )`,
    }).from(PassengerInviteTable)
      .where(eq(PassengerInviteTable.userId, inviterId))
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord},
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchSimilarRoutePassengerInvitesByInviterId(
    inviterId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      receiverName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggetStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord},
        )
      `,
    }).from(PassengerInviteTable)
      .where(eq(PassengerInviteTable.userId, inviterId))
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
      .orderBy(sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord},
        )
      `)
      .limit(limit)
      .offset(offset);
  }
  /* ================= Search operations used by Passengers ================= */


  /* ================= Search operations used by Ridders ================= */
  // getting the invites which should be received by ridder
  // so note that the below APIs would be used by ridder, not the passenger,
  // but we still put these API routes in 'passengerInvite', since it's the invitation from passenger
  async searchPaginationPasssengerInvitesByReceiverId(
    receiverId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .where(eq(SupplyOrderTable.creatorId, receiverId))
      .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
      .orderBy(desc(PassengerInviteTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async searchCurAdjacentPassengerInvitesByReceiverId(
    receiverId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord},
      )`,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .where(eq(SupplyOrderTable.creatorId, receiverId))
      .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.startCord},
        ${PassengerInviteTable.startCord},
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchDestAdjacentPassengerInvitesByReceiverId(
    receiverId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord},
      )`,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .where(eq(SupplyOrderTable.creatorId, receiverId))
      .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ${PassengerInviteTable.endCord},
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchSimilarRoutePassengerInvitesByReceverId(
    receiverId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PassengerInviteTable.id,
      orderId: PassengerInviteTable.orderId,
      inviterName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      suggestPrice: PassengerInviteTable.suggestPrice,
      startAfter: SupplyOrderTable.startAfter,
      suggestStartAfter: PassengerInviteTable.suggestStartAfter,
      createdAt: PassengerInviteTable.createdAt,
      updatedAt: PassengerInviteTable.updatedAt,
      status: PassengerInviteTable.status,
      RDV: sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord},
        )
      `,
    }).from(PassengerInviteTable)
      .leftJoin(SupplyOrderTable, eq(SupplyOrderTable.id, PassengerInviteTable.orderId))
      .where(eq(SupplyOrderTable.creatorId, receiverId))
      .leftJoin(PassengerTable, eq(PassengerTable.id, PassengerInviteTable.userId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
      .orderBy(sql`
        ST_Distance(
          ${SupplyOrderTable.startCord},
          ${PassengerInviteTable.startCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.startCord},
          ${PassengerInviteTable.endCord},
        )
      + ST_Distance(
          ${PassengerInviteTable.endCord},
          ${SupplyOrderTable.endCord},
        )
      - ST_Distance(
          ${SupplyOrderTable.startCord},
          ${SupplyOrderTable.endCord},
        )
      `)
      .limit(limit)
      .offset(offset);
  }
  /* ================= Search operations used by Ridders ================= */

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

    return await this.db.update(PassengerInviteTable).set({
      briefDescription: updatePassengerInviteDto.briefDescription,
      suggestPrice: updatePassengerInviteDto.suggestPrice,
      startCord: newStartCord,
      endCord: newEndCord,
      suggestStartAfter: updatePassengerInviteDto.suggestStartAfter,
      updatedAt: new Date(),
      status: updatePassengerInviteDto.status,
    }).where(and(eq(PassengerInviteTable.id, id), eq(PassengerInviteTable.userId, inviterId)))
      .returning({
        id: PassengerInviteTable.id,
        updatedAt: PassengerInviteTable.updatedAt,
        status: PassengerInviteTable.status,
      });
  }
  /* ================= Update detail operations used by Passenger ================= */


  /* ================= Accept or Reject operations used by Ridder ================= */
  async decidePassengerInvitebyId(
    id: string,
    receiverId: string,
    decidePassengerInviteDto: DecidePassengerInviteDto,
  ) {
    // vaildate if the ridder by given receiverId is the creator of that SupplyOrder
    const supplyOrder = await this.db.query.PassengerInviteTable.findFirst({
      where: eq(PassengerInviteTable.id, id),
      with: {
        order: {
          columns: {
            creatorId: true,
          }
        }
      }
    });
    
    if (!supplyOrder || !supplyOrder.order || receiverId !== supplyOrder?.order?.creatorId) {
      throw new UnauthorizedException("You have no access to the invite")
    }

    return await this.db.update(PassengerInviteTable).set({
      status: decidePassengerInviteDto.status,
    }).where(eq(PassengerInviteTable.id, id))
  }
  /* ================= Accept or Reject operations used by Ridder ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerInviteById(id: string, inviterId: string) {
    return await this.db.delete(PassengerInviteTable)
      .where(and(eq(PassengerInviteTable.id, id), eq(PassengerInviteTable.userId, inviterId)))
      .returning({
        id: PassengerInviteTable.id,
        status: PassengerInviteTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
