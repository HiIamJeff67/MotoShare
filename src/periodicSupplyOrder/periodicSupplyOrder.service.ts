import { Inject, Injectable } from '@nestjs/common';
import { CreatePeriodicSupplyOrderDto } from './dto/create-periodicSupplyOrder.dto';
import { UpdatePeriodicSupplyOrderDto } from './dto/update-periodicSupplyOrder.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { PeriodicSupplyOrderTable } from '../drizzle/schema/periodicSupplyOrder.schema';
import { and, desc, eq, gte, lte, not, sql } from 'drizzle-orm';
import { DaysOfWeekType } from '../types';
import { point } from '../interfaces';
import { ClientEndBeforeStartException, ClientPeriodicSupplyOrderNotFoundException } from '../exceptions';

@Injectable()
export class PeriodicSupplyOrderService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

    /* ================================= Create operation ================================= */
    async createPeriodicSupplyOrderByCreatorId(
      creatorId: string, 
      createPeriodicSupplyOrderDto: CreatePeriodicSupplyOrderDto, 
    ) {
      return await this.db.transaction(async (tx) => {
        const responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
          id: PeriodicSupplyOrderTable.id, 
        }).from(PeriodicSupplyOrderTable)
          .where(and(
            eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
            not(lte(PeriodicSupplyOrderTable.endedAt, new Date(createPeriodicSupplyOrderDto.startAfter))), 
            not(gte(PeriodicSupplyOrderTable.startAfter, new Date(createPeriodicSupplyOrderDto.endedAt))), 
          ));

        const responseOfCreatingPeriodicSupplyOrder = await tx.insert(PeriodicSupplyOrderTable).values({
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

        return [{
          hasConflict: (responseOfSelectingConflictPeriodicSupplyOrders && responseOfSelectingConflictPeriodicSupplyOrders.length !== 0), 
          ...responseOfCreatingPeriodicSupplyOrder[0], 
        }];
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
        startAfter: PeriodicSupplyOrderTable.startAfter, 
        endedAt: PeriodicSupplyOrderTable.endedAt, 
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
      return await this.db.transaction(async (tx) => {
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
    
        let responseOfSelectingConflictPeriodicSupplyOrders: any = undefined;
        if (updatePeriodicSupplyOrderDto.startAfter && updatePeriodicSupplyOrderDto.endedAt) {
          const [startAfter, endedAt] = [new Date(updatePeriodicSupplyOrderDto.startAfter), new Date(updatePeriodicSupplyOrderDto.endedAt)];
          if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    
          responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
            id: PeriodicSupplyOrderTable.id, 
          }).from(PeriodicSupplyOrderTable)
            .where(and(
              eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
              not(lte(PeriodicSupplyOrderTable.endedAt, new Date(updatePeriodicSupplyOrderDto.startAfter))), 
              not(gte(PeriodicSupplyOrderTable.startAfter, new Date(updatePeriodicSupplyOrderDto.endedAt))), 
            ));
        } else if (updatePeriodicSupplyOrderDto.startAfter && !updatePeriodicSupplyOrderDto.endedAt) {
          const tempResponse = await tx.select({
            endedAt: PeriodicSupplyOrderTable.endedAt,
          }).from(PeriodicSupplyOrderTable)
            .where(and(
              eq(PeriodicSupplyOrderTable.id, id), 
              eq(PeriodicSupplyOrderTable.creatorId, creatorId),
            ));
          if (!tempResponse || tempResponse.length === 0) throw ClientPeriodicSupplyOrderNotFoundException;
    
          const [startAfter, endedAt] = [new Date(updatePeriodicSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
          if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    
          responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
            id: PeriodicSupplyOrderTable.id, 
          }).from(PeriodicSupplyOrderTable)
            .where(and(
              eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
              not(lte(PeriodicSupplyOrderTable.endedAt, new Date(updatePeriodicSupplyOrderDto.startAfter))), 
            ));
        } else if (!updatePeriodicSupplyOrderDto.startAfter && updatePeriodicSupplyOrderDto.endedAt) {
          const tempResponse = await tx.select({
            startAfter: PeriodicSupplyOrderTable.startAfter,
          }).from(PeriodicSupplyOrderTable)
            .where(and(
              eq(PeriodicSupplyOrderTable.id, id), 
              eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
            ));
          if (!tempResponse || tempResponse.length === 0) throw ClientPeriodicSupplyOrderNotFoundException;
    
          const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updatePeriodicSupplyOrderDto.endedAt)];
          if (startAfter >= endedAt) throw ClientEndBeforeStartException;
    
          responseOfSelectingConflictPeriodicSupplyOrders = await tx.select({
            id: PeriodicSupplyOrderTable.id, 
          }).from(PeriodicSupplyOrderTable)
            .where(and(
              eq(PeriodicSupplyOrderTable.creatorId, creatorId), 
              not(gte(PeriodicSupplyOrderTable.startAfter, new Date(updatePeriodicSupplyOrderDto.endedAt))), 
            ));
        }
        
        const responseOfUpdatingPeriodicSupplyOrder = await tx.update(PeriodicSupplyOrderTable).set({
          scheduledDay: updatePeriodicSupplyOrderDto.scheduledDay, 
          initPrice: updatePeriodicSupplyOrderDto.initPrice, 
          ...(newStartCord 
            ? { startCord: sql`ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)`}
            : {}
          ),
          ...(newEndCord 
            ? { endCord: sql`ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)`}
            : {}
          ),
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

        return [{
          hasConflict: (responseOfSelectingConflictPeriodicSupplyOrders && responseOfSelectingConflictPeriodicSupplyOrders.length !== 0), 
          ...responseOfUpdatingPeriodicSupplyOrder[0], 
        }];
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
