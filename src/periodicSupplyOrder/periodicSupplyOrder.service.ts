import { Inject, Injectable } from '@nestjs/common';
import { CreatePeriodicSupplyOrderDto } from './dto/create-periodicSupplyOrder.dto';
import { UpdatePeriodicSupplyOrderDto } from './dto/update-periodicSupplyOrder.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { PeriodicSupplyOrderTable } from '../drizzle/schema/periodicSupplyOrder.schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DaysOfWeekType } from '../types';
import { point } from '../interfaces';

@Injectable()
export class PeriodicSupplyOrderService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

    /* ================================= Create operation ================================= */
    async createPeriodicSupplyOrderByCreatorId(
      creatorId: string, 
      createPeriodicSupplyOrderDto: CreatePeriodicSupplyOrderDto, 
    ) {
      return await this.db.insert(PeriodicSupplyOrderTable).values({
        creatorId: creatorId, 
        scheduledDay: createPeriodicSupplyOrderDto.scheduledDay, 
        initPrice: createPeriodicSupplyOrderDto.initPrice, 
        startCord: sql`ST_SetSRID(
          ST_MakePoint(${createPeriodicSupplyOrderDto.startCordLongitude}, ${createPeriodicSupplyOrderDto.startCordLatitude}),
          4326
        )`,
        endCord: sql`ST_SetSRID(
          ST_MakePoint(${createPeriodicSupplyOrderDto.endCordLongitude}, ${createPeriodicSupplyOrderDto.endCordLatitude}),
          4326
        )`,
        startAddress: createPeriodicSupplyOrderDto.startAddress, 
        endAddress: createPeriodicSupplyOrderDto.endAddress, 
        startAfter: new Date(createPeriodicSupplyOrderDto.startAfter), 
        endedAt: new Date(createPeriodicSupplyOrderDto.endedAt), 
        tolerableRDV: createPeriodicSupplyOrderDto.tolerableRDV, 
        autoAccept: createPeriodicSupplyOrderDto.autoAccept, 
      }).returning({
        id: PeriodicSupplyOrderTable.id, 
      });
    }
    /* ================================= Create operation ================================= */
  
  
    /* ================================= Get operation ================================= */
    async getPeriodicSupplyOrderById(
      id: string, 
      creatorId: string, // only the creator can see his/her supplyOrder
    ) {
      return await this.db.query.PeriodicSupplyOrderTable.findFirst({
        where: and(
          eq(PeriodicSupplyOrderTable.id, id), 
          eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
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
          tolerableRDV: true,
          autoAccept: true, 
          createdAt: true, 
          updatedAt: true, 
        }
      });
    }
  
    /* ================================= Search operation ================================= */
    async searchPaginationPeriodicSupplyOrders(
      creatorId: string, 
      scheduledDay: DaysOfWeekType | undefined = undefined, 
      limit: number, 
      offset: number, 
      isAutoAccept: boolean, 
    ) {
      return await this.db.select({
        id: PeriodicSupplyOrderTable.id, 
        scheduledDay: PeriodicSupplyOrderTable.scheduledDay, 
        autoAccept: PeriodicSupplyOrderTable.autoAccept, 
        createdAt: PeriodicSupplyOrderTable.createdAt, 
        updatedAt: PeriodicSupplyOrderTable.updatedAt, 
      }).from(PeriodicSupplyOrderTable)
        .where(and(
          eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
          (scheduledDay ? eq(PeriodicSupplyOrderTable.scheduledDay, scheduledDay) : undefined), 
          (isAutoAccept ? eq(PeriodicSupplyOrderTable.autoAccept, isAutoAccept) : undefined), 
        )).orderBy(desc(PeriodicSupplyOrderTable.updatedAt))
          .limit(limit)
          .offset(offset);
    }
    /* ================================= Search operation ================================= */
  
    /* ================================= Get operation ================================= */
  
  
    /* ================================= Update operation ================================= */
    async updatePeriodicSupplyOrderById(
      id: string, 
      creatorId: string, // only the creator can update his/her supplyOrder
      updatePeriodicSupplyOrderDto: UpdatePeriodicSupplyOrderDto, 
    ) {
      const newStartCord: point | undefined = 
        (updatePeriodicSupplyOrderDto.startCordLongitude !== undefined 
          && updatePeriodicSupplyOrderDto.startCordLatitude !== undefined)
        ? { x: updatePeriodicSupplyOrderDto.startCordLongitude, 
            y: updatePeriodicSupplyOrderDto.startCordLatitude, }
        : undefined;
    
      const newEndCord: point | undefined = 
        (updatePeriodicSupplyOrderDto.endCordLongitude !== undefined
          && updatePeriodicSupplyOrderDto.endCordLatitude !== undefined)
        ? { x: updatePeriodicSupplyOrderDto.endCordLongitude, 
            y: updatePeriodicSupplyOrderDto.endCordLatitude }
        : undefined;
  
      // we don't need to check the time, since it's periodic order
      return await this.db.update(PeriodicSupplyOrderTable).set({
        scheduledDay: updatePeriodicSupplyOrderDto.scheduledDay, 
        initPrice: updatePeriodicSupplyOrderDto.initPrice, 
        startCord: newStartCord,
        endCord: newEndCord,
        startAddress: updatePeriodicSupplyOrderDto.startAddress, 
        endAddress: updatePeriodicSupplyOrderDto.endAddress, 
        ...(updatePeriodicSupplyOrderDto.startAfter
          ? { startAfter: new Date(updatePeriodicSupplyOrderDto.startAfter) }
          : {}
        ),
        ...(updatePeriodicSupplyOrderDto.endedAt
          ? { endedAt: new Date(updatePeriodicSupplyOrderDto.endedAt) }
          : {}
        ),
        tolerableRDV: updatePeriodicSupplyOrderDto.tolerableRDV, 
        autoAccept: updatePeriodicSupplyOrderDto.autoAccept, 
        updatedAt: new Date(),
      }).where(and(
        eq(PeriodicSupplyOrderTable.id, id), 
        eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
      )).returning({
        id: PeriodicSupplyOrderTable.id, 
      });
    }
    /* ================================= Update operation ================================= */
  
    
    /* ================================= Delete operation ================================= */
    async deletePeriodicSupplyOrderById(
      id: string, 
      creatorId: string, 
    ) {
      return await this.db.delete(PeriodicSupplyOrderTable)
        .where(and(
          eq(PeriodicSupplyOrderTable.id, id), 
          eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
        )).returning({
          id: PeriodicSupplyOrderTable.id, 
        });
    }
    /* ================================= Delete operation ================================= */
}
