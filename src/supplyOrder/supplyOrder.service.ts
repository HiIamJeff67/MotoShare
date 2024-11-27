import { Inject, Injectable } from '@nestjs/common';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { SupplyOrderTable } from '../../src/drizzle/schema/supplyOrder.schema';
import { and, asc, desc, eq, like, lt, ne, sql } from 'drizzle-orm';
import { 
  GetAdjacentSupplyOrdersDto, 
  GetSimilarRouteSupplyOrdersDto 
} from './dto/get-supplyOrder.dto';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { point } from '../interfaces/point.interface';
import { ClientCreateOrderException, ClientEndBeforeStartException, ClientInviteNotFoundException, ClientSupplyOrderNotFoundException, ServerNeonAutoUpdateExpiredSupplyOrderException } from '../exceptions';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { OrderTable } from '../drizzle/schema/order.schema';

@Injectable()
export class SupplyOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Detect And Update Expired SupplyOrders operation ================================= */
  private async updateExpiredSupplyOrders() {
    const response = await this.db.update(SupplyOrderTable).set({
      status: "EXPIRED",
    }).where(and(
      eq(SupplyOrderTable.status, "POSTED"),
      lt(SupplyOrderTable.startAfter, new Date()),
    )).returning({
      id: SupplyOrderTable.id,
    });
    if (!response) {
      throw ServerNeonAutoUpdateExpiredSupplyOrderException;
    }

    return response.length;
  }
  /* ================================= Detect And Update Expired SupplyOrders operation ================================= */


  /* ================================= Create operations ================================= */
  async createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto) {
    return await this.db.insert(SupplyOrderTable).values({
      creatorId: creatorId,
      description: createSupplyOrderDto.description,
      initPrice: createSupplyOrderDto.initPrice,
      startCord: sql`ST_SetSRID(
        ST_MakePoint(${createSupplyOrderDto.startCordLongitude}, ${createSupplyOrderDto.startCordLatitude}), 
        4326
      )`,
      endCord: sql`ST_SetSRID(
        ST_MakePoint(${createSupplyOrderDto.endCordLongitude}, ${createSupplyOrderDto.endCordLatitude}), 
        4326
      )`,
      startAddress: createSupplyOrderDto.startAddress,
      endAddress: createSupplyOrderDto.endAddress,
      startAfter: new Date(createSupplyOrderDto.startAfter),
      endedAt: new Date(createSupplyOrderDto.endedAt),
      tolerableRDV: createSupplyOrderDto.tolerableRDV,
      autoAccept: createSupplyOrderDto.autoAccept,
    }) .returning({
      id: SupplyOrderTable.id,
      status: SupplyOrderTable.status,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async searchSupplyOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
    isAutoAccept: boolean, 
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(and(
        eq(SupplyOrderTable.creatorId, creatorId), 
        ne(SupplyOrderTable.status, "RESERVED"), 
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
      ))
      .orderBy(desc(SupplyOrderTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  // for specifying the details of that other SupplyOrders
  async getSupplyOrderById(id: string) {
    return await this.db.query.SupplyOrderTable.findFirst({
      where: and(
        eq(SupplyOrderTable.status, "POSTED"),
        eq(SupplyOrderTable.id, id),
      ),
      columns: {
        id: true,
        initPrice: true,
        description: true,
        startCord: true,
        endCord: true,
        startAddress: true,
        endAddress: true,
        createdAt: true,
        updatedAt: true,
        startAfter: true,
        endedAt: true,
        tolerableRDV: true,
        autoAccept: true,
        status: true,
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
              }
            }
          }
        }
      }
    });
    // return await this.db.select({
    //   id: SupplyOrderTable.id,
    //   creatorName: RidderTable.userName,
    //   avatorUrl: RidderInfoTable.avatorUrl,
    //   initPrice: SupplyOrderTable.initPrice,
    //   startCord: SupplyOrderTable.startCord,
    //   endCord: SupplyOrderTable.endCord,
    //   createdAt: SupplyOrderTable.createdAt,
    //   updatedAt: SupplyOrderTable.updatedAt,
    //   startAfter: SupplyOrderTable.startAfter,
    //   tolerableRDV: SupplyOrderTable.tolerableRDV,
    //   status: SupplyOrderTable.status,
    // }).from(SupplyOrderTable)
    //   .where(eq(SupplyOrderTable.id, id))
    //   .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
    //   .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
    //   .limit(1);
  }

  /* ================= Search operations ================= */
  async searchPaginationSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined), 
      )).leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
        .orderBy(desc(SupplyOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }

  async searchAboutToStartSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
        .orderBy(asc(SupplyOrderTable.startAfter))
        .limit(limit)
        .offset(offset);
  }
  
  async searchCurAdjacentSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined), 
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(sql`ST_Distance(
          ${SupplyOrderTable.startCord}, 
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
        .limit(limit)
        .offset(offset);
  }

  async searchDestAdjacentSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(sql`ST_Distance(
          ${SupplyOrderTable.endCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
        .limit(limit)
        .offset(offset);
  }

  async searchSimilarRouteSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();
    // consider the similarity of the given route and every other passible route in SupplyOrderTable
    // RDV = (|ridder.start - passenger.start| + |passenger.start - passenger.end| + |passenger.end - ridder.end|) - (|ridder.start - ridder.end|)

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
      RDV: sql`
          ST_Distance(
            ${SupplyOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326),
            ${SupplyOrderTable.endCord}
          ) 
        - ST_Distance(
            ${SupplyOrderTable.startCord},
            ${SupplyOrderTable.endCord}
          )
      `,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(sql`
          ST_Distance(
            ${SupplyOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.startCordLongitude}, ${getSimilarRouteSupplyOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRouteSupplyOrdersDto.endCordLongitude}, ${getSimilarRouteSupplyOrdersDto.endCordLatitude}), 4326),
            ${SupplyOrderTable.endCord}
          ) 
        - ST_Distance(
            ${SupplyOrderTable.startCord},
            ${SupplyOrderTable.endCord}
          )
        `)
        .limit(limit)
        .offset(offset);
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateSupplyOrderById(
    id: string, 
    creatorId: string,
    updateSupplyOrderDto: UpdateSupplyOrderDto
  ) {
    const newStartCord: point | undefined = 
      (updateSupplyOrderDto.startCordLongitude !== undefined 
        && updateSupplyOrderDto.startCordLatitude !== undefined)
      ? { x: updateSupplyOrderDto.startCordLongitude, y: updateSupplyOrderDto.startCordLatitude, }
      : undefined;
    
    const newEndCord: point | undefined = 
      (updateSupplyOrderDto.endCordLongitude !== undefined
        && updateSupplyOrderDto.endCordLatitude !== undefined)
      ? { x: updateSupplyOrderDto.endCordLongitude, y: updateSupplyOrderDto.endCordLatitude }
      : undefined;

    if (updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
      const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(updateSupplyOrderDto.endedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (updateSupplyOrderDto.startAfter && !updateSupplyOrderDto.endedAt) {
      const tempResponse = await this.db.select({
        endedAt: SupplyOrderTable.endedAt,
      }).from(SupplyOrderTable)
        .where(and(
          ne(SupplyOrderTable.status, "RESERVED"),
          eq(SupplyOrderTable.id, id), 
          eq(SupplyOrderTable.creatorId, creatorId),
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientSupplyOrderNotFoundException;

      const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    } else if (!updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
      const tempResponse = await this.db.select({
        startAfter: SupplyOrderTable.startAfter,
      }).from(SupplyOrderTable)
        .where(and(
          ne(SupplyOrderTable.status, "RESERVED"),
          eq(SupplyOrderTable.id, id), 
          eq(SupplyOrderTable.creatorId, creatorId),
        ));
      if (!tempResponse || tempResponse.length === 0) throw ClientSupplyOrderNotFoundException;

      const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updateSupplyOrderDto.endedAt)];
      if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    }

    return await this.db.update(SupplyOrderTable).set({
      description: updateSupplyOrderDto.description,
      initPrice: updateSupplyOrderDto.initPrice,
      startCord: newStartCord,
      endCord: newEndCord,
      startAddress: updateSupplyOrderDto.startAddress,
      endAddress: updateSupplyOrderDto.endAddress,
      ...(updateSupplyOrderDto.startAfter
        ? { startAfter: new Date(updateSupplyOrderDto.startAfter) }
        : {}
      ),
      ...(updateSupplyOrderDto.endedAt
        ? { endedAt: new Date(updateSupplyOrderDto.endedAt) }
        : {}
      ),
      tolerableRDV: updateSupplyOrderDto.tolerableRDV,
      autoAccept: updateSupplyOrderDto.autoAccept,
      status: updateSupplyOrderDto.status,
      updatedAt: new Date(),
    }).where(and(
      ne(SupplyOrderTable.status, "RESERVED"),
      eq(SupplyOrderTable.id, id), 
      eq(SupplyOrderTable.creatorId, creatorId),
    )).returning({
        id: SupplyOrderTable.id,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */
  async startSupplyOrderWithoutInvite(
    id: string, 
    userId: string, 
    acceptAutoAcceptSupplyOrderDto: AcceptAutoAcceptSupplyOrderDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      await tx.update(PassengerInviteTable).set({
        status: "REJECTED",
        updatedAt: new Date(),
      }).where(and(
        eq(PassengerInviteTable.orderId, id),
        eq(PassengerInviteTable.status, "CHECKING"),
      )); // could probably don't return any responses, since there's no any invites to that supplyOrder

      const responseOfDeletingSupplyOrder = await tx.update(SupplyOrderTable).set({ // will delete this supplyOrder later
        status: "RESERVED",
        updatedAt: new Date(),
      }).where(and(
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.status, "POSTED"), 
        eq(SupplyOrderTable.autoAccept, true), // require this field
      )).returning();
      if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
        throw ClientSupplyOrderNotFoundException;
      }

      const responseOfCreatingOrder = await tx.insert(OrderTable).values({
        ridderId: userId,
        passengerId: responseOfDeletingSupplyOrder[0].creatorId,
        prevOrderId: "PurchaseOrder" + " " + responseOfDeletingSupplyOrder[0].id, 
        finalPrice: responseOfDeletingSupplyOrder[0].initPrice, // the receiver accept the suggest price
        passengerDescription: responseOfDeletingSupplyOrder[0].description,
        ridderDescription: acceptAutoAcceptSupplyOrderDto.description,
        finalStartCord: responseOfDeletingSupplyOrder[0].startCord,
        finalEndCord: responseOfDeletingSupplyOrder[0].endCord,
        finalStartAddress: responseOfDeletingSupplyOrder[0].startAddress,
        finalEndAddress: responseOfDeletingSupplyOrder[0].endAddress,
        startAfter: responseOfDeletingSupplyOrder[0].startAfter,  // the receiver accept the suggest start time
        endedAt: responseOfDeletingSupplyOrder[0].endedAt,
        // endAt: , // will be covered the autocomplete function powered by google in the future
      }).returning({
        id: OrderTable.id,
        finalPrice: OrderTable.finalPrice,
        finalStartCord: OrderTable.finalStartCord, 
        finalEndCord: OrderTable.finalEndCord, 
        finalStartAddress: OrderTable.finalStartAddress, 
        finalEndAddress: OrderTable.finalEndAddress, 
        startAfter: OrderTable.startAfter,
        endedAt: OrderTable.endedAt,
        status: OrderTable.passengerStatus, // use either passengerStatus or ridderStatus is fine
      });
      if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
        throw ClientCreateOrderException;
      }

      return [{
        orderId: responseOfCreatingOrder[0].id,
        price: responseOfCreatingOrder[0].finalPrice,
        finalStartCord: responseOfCreatingOrder[0].finalStartCord, 
        finalEndCord: responseOfCreatingOrder[0].finalEndCord,
        finalStartAddress: responseOfCreatingOrder[0].finalStartAddress,
        finalEndAddress: responseOfCreatingOrder[0].finalEndAddress,
        startAfter: responseOfCreatingOrder[0].startAfter,
        endedAt: responseOfCreatingOrder[0].endedAt,
        orderStatus: responseOfCreatingOrder[0].status, // use either passengerStatus or ridderStatus is fine
      }];
    });
  }
  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteSupplyOrderById(id: string, creatorId: string) {
    return await this.db.delete(SupplyOrderTable)
      .where(and(
        ne(SupplyOrderTable.status, "POSTED"),
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.creatorId, creatorId),
      )).returning({
        id: SupplyOrderTable.id,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
