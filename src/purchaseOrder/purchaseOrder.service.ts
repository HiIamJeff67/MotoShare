import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
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
      creatorId: PurchaseOrderTable.creatorId,
      createdAt: PurchaseOrderTable.createdAt,
      status: PurchaseOrderTable.status,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async getPurchaseOrderById(id: string) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.id, id));
  }

  async getPurchaseOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
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
      .orderBy(PurchaseOrderTable.updatedAt)
      .limit(limit)
      .offset(offset);
  }

  async getPurchaseOrders(limit: number, offset: number) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .orderBy(PurchaseOrderTable.updatedAt)
      .limit(limit)
      .offset(offset)
  }

  async getCurAdjacentPurchaseOrders(
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
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
      .orderBy(sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async getDestAdjacentPurchaseOrders(
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
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
      .orderBy(sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async getSimilarRoutePurchaseOrders(
    limit: number,
    offset: number,
    getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
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
      `).limit(limit)
        .offset(offset);
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updatePurchaseOrderById(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    // we should code like the below form for update method
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
    }).where(eq(PurchaseOrderTable.id, id))
      .returning({
        id: PurchaseOrderTable.id,
        creatorId: PurchaseOrderTable.creatorId,
        updatedAt: PurchaseOrderTable.updatedAt,
        status: PurchaseOrderTable.status,
      });
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePurchaseOrderById(id: string) {
    return await this.db.delete(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.id, id));
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Test operations ================================= */
  async getAllPurchaseOrders() {
    return await this.db.select().from(PurchaseOrderTable);
  }
  /* ================================= Test operations ================================= */
}
