import { Inject, Injectable } from '@nestjs/common';
import { desc, and, eq, sql, like, ne } from 'drizzle-orm';
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

@Injectable()
export class PurchaseOrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return await this.db.insert(PurchaseOrderTable).values({
      creatorId: creatorId,
      description: createPurchaseOrderDto.description,
      initPrice: createPurchaseOrderDto.initPrice,
      startCord: sql`ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.startCordLongitude}, ${createPurchaseOrderDto.startCordLatitude}),
        4326
      )`,
      endCord: sql`ST_SetSRID(
        ST_MakePoint(${createPurchaseOrderDto.endCordLongitude}, ${createPurchaseOrderDto.endCordLatitude}),
        4326
      )`,
      startAddress: createPurchaseOrderDto.startAddress,
      endAddress: createPurchaseOrderDto.endAddress,
      startAfter: new Date(createPurchaseOrderDto.startAfter || new Date()),
      endedAt: new Date(createPurchaseOrderDto.endedAt || new Date()),
      isUrgent: createPurchaseOrderDto.isUrgent,
    }).returning({
      id: PurchaseOrderTable.id,
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
    return await this.db.query.PurchaseOrderTable.findMany({
      where: and(
        ne(PurchaseOrderTable.status, "RESERVED"),
        eq(PurchaseOrderTable.creatorId, creatorId),
      ),
      columns: {
        id: true,
        initPrice: true,
        startCord: true,
        endCord: true,
        startAddress: true,
        endAddress: true,
        createdAt: true,
        endedAt: true,
        updatedAt: true,
        startAfter: true,
        isUrgent: true,
        status: true,
      },
      orderBy: desc(PurchaseOrderTable.updatedAt),
      limit: limit,
      offset: offset,
    });
    // return await this.db.select({
    //   id: PurchaseOrderTable.id,
    //   initPrice: PurchaseOrderTable.initPrice,
    //   startCord: PurchaseOrderTable.startCord,
    //   endCord: PurchaseOrderTable.endCord,
    //   createdAt: PurchaseOrderTable.createdAt,
    //   updatedAt: PurchaseOrderTable.updatedAt,
    //   startAfter: PurchaseOrderTable.startAfter,
    //   isUrgent: PurchaseOrderTable.isUrgent,
    //   status: PurchaseOrderTable.status,
    // }).from(PurchaseOrderTable)
    //   .where(eq(PurchaseOrderTable.creatorId, creatorId))
    //   .orderBy(desc(PurchaseOrderTable.updatedAt))
    //   .limit(limit)
    //   .offset(offset);
  }

  // for specifying the details of the other purchaseOrders
  async getPurchaseOrderById(id: string) {
    return await this.db.query.PurchaseOrderTable.findFirst({
      where: and(
        eq(PurchaseOrderTable.status, "POSTED"),
        eq(PurchaseOrderTable.id, id),
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
        endedAt: true,
        updatedAt: true,
        startAfter: true,
        isUrgent: true,
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
              }
            }
          }
        }
      }
    });
    // return await this.db.select({
    //   id: PurchaseOrderTable.id,
    //   creatorName: PassengerTable.userName,
    //   avatorUrl: PassengerInfoTable.avatorUrl,
    //   initPrice: PurchaseOrderTable.initPrice,
    //   startCord: PurchaseOrderTable.startCord,
    //   endCord: PurchaseOrderTable.endCord,
    //   createdAt: PurchaseOrderTable.createdAt,
    //   updatedAt: PurchaseOrderTable.updatedAt,
    //   startAfter: PurchaseOrderTable.startAfter,
    //   isUrgent: PurchaseOrderTable.isUrgent,
    //   status: PurchaseOrderTable.status,
    // }).from(PurchaseOrderTable)
    //   .where(eq(PurchaseOrderTable.id, id)) // basically, should only get one result
    //   .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
    //   .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
    //   .limit(1);
  }

  /* ================= Search operations ================= */
  async searchPaginationPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number,
  ) {
    const query = this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
    
    if (creatorName) {
      query.where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        like(PassengerTable.userName, creatorName + "%"),
      ));
    } else {
      query.where(eq(PurchaseOrderTable.status, "POSTED"));
    }
      
    query.leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
         .orderBy(desc(PurchaseOrderTable.updatedAt))
         .limit(limit)
         .offset(offset);
    
    return await query; // await should be place here, since we done the query right here
  }

  async searchCurAdjacentPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    const query = this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
    
    if (creatorName) {
      query.where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        like(PassengerTable.userName, creatorName + "%")
      ));
    } else {
      query.where(eq(PurchaseOrderTable.status, "POSTED"));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.startCord},
            ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
          )`)
          .limit(limit)
          .offset(offset);

    return await query;
  }

  async searchDestAdjacentPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    const query = this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
      isUrgent: PurchaseOrderTable.isUrgent,
      status: PurchaseOrderTable.status,
      distance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));

    if (creatorName) {
      query.where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        like(PassengerTable.userName, creatorName + "%"),
      ));
    } else {
      query.where(eq(PurchaseOrderTable.status, "POSTED"));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
          .orderBy(sql`ST_Distance(
            ${PurchaseOrderTable.endCord},
            ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
          )`)
          .limit(limit)
          .offset(offset);
    
    return await query;
  }

  async searchSimilarRoutePurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto
  ) {
    const query = this.db.select({
      id: PurchaseOrderTable.id,
      creatorName: PassengerTable.userName,
      avatorUrl: PassengerInfoTable.avatorUrl,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
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
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));

    if (creatorName) {
      query.where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        like(PassengerTable.userName, creatorName + "%"),
      ));
    } else {
      query.where(eq(PurchaseOrderTable.status, "POSTED"));
    }

    query.leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
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
    
      return await query;
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
      startAddress: updatePurchaseOrderDto.startAddress,
      endAddress: updatePurchaseOrderDto.endAddress,
      updatedAt: new Date(),
      startAfter: new Date(updatePurchaseOrderDto.startAfter || new Date()),
      endedAt: new Date(updatePurchaseOrderDto.endedAt || new Date()),
      isUrgent: updatePurchaseOrderDto.isUrgent,
      status: updatePurchaseOrderDto.status,
    }).where(and(
      ne(PurchaseOrderTable.status, "RESERVED"),
      eq(PurchaseOrderTable.id, id), 
      eq(PurchaseOrderTable.creatorId, creatorId),
    )).returning({
        id: PurchaseOrderTable.id,
        status: PurchaseOrderTable.status,
      });
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePurchaseOrderById(id: string, creatorId: string) {
    // do the same check as update, since the passenger can only delete the order created by himself
    return await this.db.delete(PurchaseOrderTable)
      .where(and(
        ne(PurchaseOrderTable.status, "RESERVED"),
        eq(PurchaseOrderTable.id, id), 
        eq(PurchaseOrderTable.creatorId, creatorId)
      )).returning({
        id: PurchaseOrderTable.id,
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
