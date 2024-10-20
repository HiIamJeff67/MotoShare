import { Inject, Injectable } from '@nestjs/common';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { SupplyOrderTable } from 'src/drizzle/schema/supplyOrder.schema';
import { desc, eq, sql } from 'drizzle-orm';
import { point } from 'src/interfaces/point.interface';
import { GetCurAdjacentSupplyOrderDto } from './dto/get-supplyOrder.dto';

@Injectable()
export class SupplyOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto) {
    return await this.db.insert(SupplyOrderTable).values({
      creatorId: creatorId,
      description: createSupplyOrderDto.description ?? undefined,
      initPrice: createSupplyOrderDto.initPrice,
      startCord: sql`ST_SetSRID(
        ST_MakePoint(${createSupplyOrderDto.startCordLongitude}, ${createSupplyOrderDto.startCordLatitude}), 
        4326
      )`,
      endCord: sql`ST_SetSRID(
        ST_MakePoint(${createSupplyOrderDto.endCordLongitude}, ${createSupplyOrderDto.endCordLatitude}), 
        4326
      )`,
      startAfter: createSupplyOrderDto.startAfter ?? undefined,
    }) .returning({
      id: SupplyOrderTable.id,
      creatorId: SupplyOrderTable.creatorId,
      createdAt: SupplyOrderTable.createdAt,
      status: SupplyOrderTable.status,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async getSupplyOrderById(id: string) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorId: SupplyOrderTable.creatorId,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(eq(SupplyOrderTable.id, id));
  }

  async getSupplyOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorId: SupplyOrderTable.creatorId,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(eq(SupplyOrderTable.creatorId, creatorId))
      .orderBy(desc(SupplyOrderTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async getSupplyOrders(limit: number, offset: number) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorId: SupplyOrderTable.creatorId,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .orderBy(SupplyOrderTable.updatedAt)
      .limit(limit)
      .offset(offset);
  }
  
  async getCurAdjacentSupplyOrders(
    limit: number, 
    offset: number,
    getCurAdjacentSupplyOrderDto: GetCurAdjacentSupplyOrderDto
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorId: SupplyOrderTable.creatorId,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      status: SupplyOrderTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getCurAdjacentSupplyOrderDto.curLongitude}, ${getCurAdjacentSupplyOrderDto.curLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getCurAdjacentSupplyOrderDto.curLongitude}, ${getCurAdjacentSupplyOrderDto.curLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateSupplyOrderById(id: string, updateSupplyOrderDto: UpdateSupplyOrderDto) {
    const newStartCordQuery: string | undefined = 
      (updateSupplyOrderDto.startCordLongitude !== undefined
        && updateSupplyOrderDto.startCordLatitude !== undefined)
      ? `ST_SetSRID(ST_MakePoint(${updateSupplyOrderDto.startCordLongitude}, ${updateSupplyOrderDto.startCordLatitude}))`
      : undefined;
    
    const newEndCordQuery: string | undefined =
      (updateSupplyOrderDto.endCordLongitude !== undefined
        && updateSupplyOrderDto.endCordLatitude !== undefined)
      ? `ST_SetSRID(ST_MakePoint(${updateSupplyOrderDto.endCordLongitude}, ${updateSupplyOrderDto.endCordLatitude}))`
      : undefined;

    return await this.db.update(SupplyOrderTable).set({
      description: updateSupplyOrderDto.description,
      initPrice: updateSupplyOrderDto.initPrice,
      startCord: sql`${newStartCordQuery}`,
      endCord: sql`${newEndCordQuery}`,
      updatedAt: new Date(),
      startAfter: updateSupplyOrderDto.startAfter,
      status: updateSupplyOrderDto.status,
    }).where(eq(SupplyOrderTable.id, id))
      .returning({
        id: SupplyOrderTable.id,
        creatorId: SupplyOrderTable.creatorId,
        updatedAt: SupplyOrderTable.updatedAt,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteSupplyOrderById(id: string) {
    return await this.db.delete(SupplyOrderTable)
      .where(eq(SupplyOrderTable.id, id));
  }
  /* ================================= Delete operations ================================= */
}
