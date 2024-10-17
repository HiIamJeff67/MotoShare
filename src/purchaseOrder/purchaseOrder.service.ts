import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';

import { PurchaseOrderTable } from 'src/drizzle/schema/purchaseOrder.schema';
import { point } from 'src/interfaces/point.interface';

@Injectable()
export class PurchaseOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createPurchaseOrder(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return await this.db.insert(PurchaseOrderTable).values({
      creatorId: createPurchaseOrderDto.creatorId,
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
      createdAt: createPurchaseOrderDto.createdAt ?? undefined,
      updatedAt: createPurchaseOrderDto.updatedAt ?? undefined,
      startAfter: createPurchaseOrderDto.startAfter ?? undefined,
      isUrgent: createPurchaseOrderDto.isUrgent ?? undefined,
      status: createPurchaseOrderDto.status ?? undefined,
    }).returning({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
    });
  }

  async getPurchaseOrderById(id: string) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.id, id));
  }

  async getPurchaseOrderByCreatorId(creatorId: string) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(eq(PurchaseOrderTable.creatorId, creatorId));
  }

  async getAllPurchaseOrders() {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      creatorId: PurchaseOrderTable.creatorId,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable);
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  // async updatePurchaseById(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
  //   let newStartCord: point | undefined = undefined
  //   if (updatePurchaseOrderDto.startCordLongitude !== undefined 
  //     && updatePurchaseOrderDto.startCordLatitude !== undefined) {
  //       newStartCord = {
  //         x: updatePurchaseOrderDto.startCordLongitude,
  //         y: updatePurchaseOrderDto.startCordLatitude,
  //       }
  //   }

  //   return await this.db.update(PurchaseOrderTable).set({
  //     creatorId: updatePurchaseOrderDto.creatorId,
  //     description: updatePurchaseOrderDto.description,
  //     initPrice: updatePurchaseOrderDto.initPrice,
  //     startCord: newStartCord,
  //     endCord: {
  //       x: updatePurchaseOrderDto.endCordLongitude,
  //       y: updatePurchaseOrderDto.endCordLatitude,
  //     },
  //     createdAt: updatePurchaseOrderDto.createdAt,
  //     updatedAt: updatePurchaseOrderDto.updatedAt,
  //     startAfter: updatePurchaseOrderDto.startAfter,
  //     isUrgent: updatePurchaseOrderDto.isUrgent,
  //     status: updatePurchaseOrderDto.status,
  //   }).where(eq(PurchaseOrderTable.id, id));
  // }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
