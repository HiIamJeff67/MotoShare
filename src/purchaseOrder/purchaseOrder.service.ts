import { Inject, Injectable } from '@nestjs/common';
import { desc, and, eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { point } from '../../src/interfaces/point.interface';

import { PurchaseOrderTable } from '../../src/drizzle/schema/purchaseOrder.schema';
import { 
  GetAdjacentPurchaseOrdersDto, 
  GetSimilarRoutePurchaseOrdersDto 
} from './dto/get-purchaseOrder.dto';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';

@Injectable()
export class PurchaseOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return await this.db.insert(PurchaseOrderTable).values({
      creatorId: creatorId,
      description: createPurchaseOrderDto.description ?? undefined,
      initPrice: createPurchaseOrderDto.initPrice,
      startCord: sql`ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.startCordLongitude}, ${createPurchaseOrderDto.startCordLatitude}),
        4326
      )`,
      endCord: sql`ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.endCordLongitude}, ${createPurchaseOrderDto.endCordLatitude}),
        4326
      )`,
      startAfter: createPurchaseOrderDto.startAfter ?? undefined,
      isUrgent: createPurchaseOrderDto.isUrgent ?? undefined,
    }).returning({
      id: PurchaseOrderTable.id,
      createdAt: PurchaseOrderTable.createdAt,
      status: PurchaseOrderTable.status,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async getPurchaseOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.creatorId, creatorId))
      .orderBy(desc(PurchaseOrderTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async getPurchaseOrderById(id: string) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.id, id)) // basically, should only get one result
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .limit(1);
  }

  /* ================= Search operations ================= */
  async searchPurchaseOrderByCreatorName(
    creatorName: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(eq(PassengerTable.userName, creatorName))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .orderBy(PurchaseOrderTable.updatedAt)
      .limit(limit)
      .offset(offset);
  }

  async searchPaginationPurchaseOrders(limit: number, offset: number) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .limit(limit)
      .offset(offset);
  }

  async searchCurAdjacentPurchaseOrders(
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .orderBy(sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchDestAdjacentPurchaseOrders(
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .orderBy(sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchSimilarRoutePurchaseOrders(
    limit: number,
    offset: number,
    getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
      RDV: sql`
          ST_Distance(
            ${PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326),
            ${PurchaseOrderTable.endCord}
          ) 
        - ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${PurchaseOrderTable.endCord}
          )
      `,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .orderBy(sql`
          ST_Distance(
            ${PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.startCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.startCordLatitude}), 4326),
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326)
          ) 
        + ST_Distance(
            ST_SetSRID(ST_MakePoint(${getSimilarRoutePurchaseOrdersDto.endCordLongitude}, ${getSimilarRoutePurchaseOrdersDto.endCordLatitude}), 4326),
            ${PurchaseOrderTable.endCord}
          ) 
        - ST_Distance(
            ${PurchaseOrderTable.startCord},
            ${PurchaseOrderTable.endCord}
          )
      `)
      .limit(limit)
      .offset(offset);
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updatePurchaseOrderById(
    id: string, // id of the order, for finding the specific order
    creatorId: string,  // id of the passenger who want to update this order, for checking the validation
    updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ) {
    // validate if the creator of this order(represented by orderID)
    // is the same as current passenger, since a user can only update the order created by himself
    // we do this by also include equality of the given creatorId and creatorId of that specific order

    const newStartCord: point | undefined = 
      (updatePurchaseOrderDto.startCordLongitude !== undefined 
        && updatePurchaseOrderDto.startCordLatitude !== undefined)
      ? { x: updatePurchaseOrderDto.startCordLongitude, y: updatePurchaseOrderDto.startCordLatitude, }
      : undefined;
  
    const newEndCord: point | undefined = 
      (updatePurchaseOrderDto.endCordLongitude !== undefined
        && updatePurchaseOrderDto.endCordLatitude !== undefined)
      ? { x: updatePurchaseOrderDto.endCordLongitude, y: updatePurchaseOrderDto.endCordLatitude }
      : undefined;

    return await this.db.update(PurchaseOrderTable).set({
      description: updatePurchaseOrderDto.description,
      initPrice: updatePurchaseOrderDto.initPrice,
      startCord: newStartCord,
      endCord: newEndCord,
      updatedAt: new Date(),
      startAfter: updatePurchaseOrderDto.startAfter,
      isUrgent: updatePurchaseOrderDto.isUrgent,
      status: updatePurchaseOrderDto.status,
    }).where(and(eq(PurchaseOrderTable.id, id), eq(PurchaseOrderTable.creatorId, creatorId)))
      .returning({
        id: PurchaseOrderTable.id,
        updatedAt: PurchaseOrderTable.updatedAt,
        status: PurchaseOrderTable.status,
      });
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePurchaseOrderById(id: string, creatorId: string) {
    // do the same check as update, since the passenger can only delete the order created by himself
    return await this.db.delete(PurchaseOrderTable)
      .where(and(eq(PurchaseOrderTable.id, id), eq(PurchaseOrderTable.creatorId, creatorId)))
      .returning({
        id: PurchaseOrderTable.id,
        deletedAt: PurchaseOrderTable.updatedAt,
        status: PurchaseOrderTable.status,
      });
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Test operations ================================= */
  async getAllPurchaseOrders() {
    return await this.db.select().from(PurchaseOrderTable);
  }
  /* ================================= Test operations ================================= */
}
