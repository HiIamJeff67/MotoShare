import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { point } from 'src/interfaces/point.interface';

import { PurchaseOrderTable } from 'src/drizzle/schema/purchaseOrder.schema';

@Injectable()
export class PurchaseOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return await this.db.insert(PurchaseOrderTable).values({
      creatorId: creatorId,
      description: createPurchaseOrderDto.description ?? undefined,
      initPrice: createPurchaseOrderDto.initPrice,
      startCord: {
        x: createPurchaseOrderDto.startCordLongitude,
        y: createPurchaseOrderDto.startCordLatitude,
      },
      endCord: {
        x: createPurchaseOrderDto.endCordLongitude,
        y: createPurchaseOrderDto.endCordLatitude,
      },
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
