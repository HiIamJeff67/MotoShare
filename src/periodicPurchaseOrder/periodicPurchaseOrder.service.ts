import { Inject, Injectable } from '@nestjs/common';
import { CreatePeriodicPurchaseOrderDto } from './dto/create-periodicPurchaseOrder.dto';
import { UpdatePeriodicPurchaseOrderDto } from './dto/update-periodicPurchaseOrder.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PeriodicPurchaseOrderTable } from '../drizzle/schema/periodicPurchaseOrder.schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DaysOfWeekType } from '../types';
import { point } from '../interfaces';

@Injectable()
export class PeriodicPurchaseOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operation ================================= */
  async createPeriodicPurchaseOrderByCreatorId(
    creatorId: string, 
    createPeriodicPurchaseOrderDto: CreatePeriodicPurchaseOrderDto, 
  ) {
    return await this.db.insert(PeriodicPurchaseOrderTable).values({
      creatorId: creatorId, 
      scheduledDay: createPeriodicPurchaseOrderDto.scheduledDay, 
      initPrice: createPeriodicPurchaseOrderDto.initPrice, 
      startCord: sql`ST_SetSRID(
        ST_MakePoint(${createPeriodicPurchaseOrderDto.startCordLongitude}, ${createPeriodicPurchaseOrderDto.startCordLatitude}),
        4326
      )`,
      endCord: sql`ST_SetSRID(
        ST_MakePoint(${createPeriodicPurchaseOrderDto.endCordLongitude}, ${createPeriodicPurchaseOrderDto.endCordLatitude}),
        4326
      )`,
      startAddress: createPeriodicPurchaseOrderDto.startAddress, 
      endAddress: createPeriodicPurchaseOrderDto.endAddress, 
      startAfter: new Date(createPeriodicPurchaseOrderDto.startAfter), 
      endedAt: new Date(createPeriodicPurchaseOrderDto.endedAt), 
      isUrgent: createPeriodicPurchaseOrderDto.isUrgent, 
      autoAccept: createPeriodicPurchaseOrderDto.autoAccept, 
    }).returning({
      id: PeriodicPurchaseOrderTable.id, 
    });
  }
  /* ================================= Create operation ================================= */


  /* ================================= Get operation ================================= */
  async getPeriodicPurchaseOrderById(
    id: string, 
    creatorId: string, // only the creator can see his/her purchaseOrder
  ) {
    return await this.db.query.PeriodicPurchaseOrderTable.findFirst({
      where: and(
        eq(PeriodicPurchaseOrderTable.id, id), 
        eq(PeriodicPurchaseOrderTable.creatorId, creatorId), 
      ), 
      columns: {
        id: true, 
        scheduledDay: true, 
        initPrice: true,
        startCord: true,
        endCord: true,
        startAddress: true,
        endAddress: true,
        startAfter: true,
        endedAt: true,
        isUrgent: true,
        autoAccept: true, 
        createdAt: true, 
        updatedAt: true, 
      }
    });
  }

  /* ================================= Search operation ================================= */
  async searchPaginationPeriodicPurchaseOrders(
    creatorId: string, 
    scheduledDay: DaysOfWeekType | undefined = undefined, 
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
  ) {
    return await this.db.select({
      id: PeriodicPurchaseOrderTable.id, 
      scheduledDay: PeriodicPurchaseOrderTable.scheduledDay, 
      autoAccept: PeriodicPurchaseOrderTable.autoAccept, 
      createdAt: PeriodicPurchaseOrderTable.createdAt, 
      updatedAt: PeriodicPurchaseOrderTable.updatedAt, 
    }).from(PeriodicPurchaseOrderTable)
      .where(and(
        eq(PeriodicPurchaseOrderTable.creatorId, creatorId), 
        (scheduledDay ? eq(PeriodicPurchaseOrderTable.scheduledDay, scheduledDay) : undefined), 
        (isAutoAccept ? eq(PeriodicPurchaseOrderTable.autoAccept, isAutoAccept) : undefined), 
      )).orderBy(desc(PeriodicPurchaseOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }
  /* ================================= Search operation ================================= */

  /* ================================= Get operation ================================= */


  /* ================================= Update operation ================================= */
  async updatePeriodicPurchaseOrderById(
    id: string, 
    creatorId: string, // only the creator can update his/her purchaseOrder
    updatePeriodicPurchaseOrderDto: UpdatePeriodicPurchaseOrderDto, 
  ) {
    const newStartCord: point | undefined = 
      (updatePeriodicPurchaseOrderDto.startCordLongitude !== undefined 
        && updatePeriodicPurchaseOrderDto.startCordLatitude !== undefined)
      ? { x: updatePeriodicPurchaseOrderDto.startCordLongitude, 
          y: updatePeriodicPurchaseOrderDto.startCordLatitude, }
      : undefined;
  
    const newEndCord: point | undefined = 
      (updatePeriodicPurchaseOrderDto.endCordLongitude !== undefined
        && updatePeriodicPurchaseOrderDto.endCordLatitude !== undefined)
      ? { x: updatePeriodicPurchaseOrderDto.endCordLongitude, 
          y: updatePeriodicPurchaseOrderDto.endCordLatitude }
      : undefined;

    // we don't need to check the time, since it's periodic order
    return await this.db.update(PeriodicPurchaseOrderTable).set({
      scheduledDay: updatePeriodicPurchaseOrderDto.scheduledDay, 
      initPrice: updatePeriodicPurchaseOrderDto.initPrice, 
      startCord: newStartCord,
      endCord: newEndCord,
      startAddress: updatePeriodicPurchaseOrderDto.startAddress, 
      endAddress: updatePeriodicPurchaseOrderDto.endAddress, 
      ...(updatePeriodicPurchaseOrderDto.startAfter
        ? { startAfter: new Date(updatePeriodicPurchaseOrderDto.startAfter) }
        : {}
      ),
      ...(updatePeriodicPurchaseOrderDto.endedAt
        ? { endedAt: new Date(updatePeriodicPurchaseOrderDto.endedAt) }
        : {}
      ),
      isUrgent: updatePeriodicPurchaseOrderDto.isUrgent, 
      autoAccept: updatePeriodicPurchaseOrderDto.autoAccept, 
      updatedAt: new Date(),
    }).where(and(
      eq(PeriodicPurchaseOrderTable.id, id), 
      eq(PeriodicPurchaseOrderTable.creatorId, creatorId), 
    )).returning({
      id: PeriodicPurchaseOrderTable.id, 
    });
  }
  /* ================================= Update operation ================================= */

  
  /* ================================= Delete operation ================================= */
  async deletePeriodicPurchaseOrderById(
    id: string, 
    creatorId: string, 
  ) {
    return await this.db.delete(PeriodicPurchaseOrderTable)
      .where(and(
        eq(PeriodicPurchaseOrderTable.id, id), 
        eq(PeriodicPurchaseOrderTable.creatorId, creatorId), 
      )).returning({
        id: PeriodicPurchaseOrderTable.id, 
      });
  }
  /* ================================= Delete operation ================================= */
}
