import { Inject, Injectable } from '@nestjs/common';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { SupplyOrderTable } from '../../src/drizzle/schema/supplyOrder.schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { 
  GetAdjacentSupplyOrdersDto, 
  GetSimilarRouteSupplyOrdersDto 
} from './dto/get-supplyOrder.dto';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { point } from '../interfaces/point.interface';

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
      tolerableRDV: createSupplyOrderDto.tolerableRDV ?? undefined,
    }) .returning({
      id: SupplyOrderTable.id,
      createdAt: SupplyOrderTable.createdAt,
      status: SupplyOrderTable.status,
    });
  }
  /* ================================= Create operations ================================= */


  
  /* ================================= Get operations ================================= */
  async getSupplyOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(eq(SupplyOrderTable.creatorId, creatorId))
      .orderBy(desc(SupplyOrderTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async getSupplyOrderById(id: string) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(eq(SupplyOrderTable.id, id))
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .limit(1);
  }

  /* ================= Search operations ================= */
  async searchSupplyOrderByCreatorName(
    creatorName: string,
    limit: number, 
    offset: number,
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .where(eq(RidderTable.userName, creatorName))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .orderBy(SupplyOrderTable.updatedAt)
      .limit(limit)
      .offset(offset);
  }

  async searchPaginationSupplyOrders(limit: number, offset: number) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .limit(limit)
      .offset(offset);
  }
  
  async searchCurAdjacentSupplyOrders(
    limit: number, 
    offset: number, 
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchDestAdjacentSupplyOrders(
    limit: number,
    offset: number,
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      status: SupplyOrderTable.status,
      distance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .orderBy(sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`)
      .limit(limit)
      .offset(offset);
  }

  async searchSimilarRouteSupplyOrders(
    limit: number,
    offset: number,
    getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto
  ) {
    // consider the similarity of the given route and every other passible route in SupplyOrderTable
    // RDV = (|ridder.start - passenger.start| + |passenger.start - passenger.end| + |passenger.end - ridder.end|) - (|ridder.start - ridder.end|)

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
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
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
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

    return await this.db.update(SupplyOrderTable).set({
      description: updateSupplyOrderDto.description,
      initPrice: updateSupplyOrderDto.initPrice,
      startCord: newStartCord,
      endCord: newEndCord,
      updatedAt: new Date(),
      startAfter: updateSupplyOrderDto.startAfter,
      tolerableRDV: updateSupplyOrderDto.tolerableRDV,
      status: updateSupplyOrderDto.status,
    }).where(and(eq(SupplyOrderTable.id, id), eq(SupplyOrderTable.creatorId, creatorId)))
      .returning({
        id: SupplyOrderTable.id,
        updatedAt: SupplyOrderTable.updatedAt,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  async deleteSupplyOrderById(id: string, creatorId: string) {
    return await this.db.delete(SupplyOrderTable)
      .where(and(eq(SupplyOrderTable.id, id), eq(SupplyOrderTable.creatorId, creatorId)))
      .returning({
        id: SupplyOrderTable.id,
        deletedAt: SupplyOrderTable.updatedAt,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
