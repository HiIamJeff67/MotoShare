import { Inject, Injectable } from '@nestjs/common';
import { desc, and, eq, sql, like, ne, gte, lt, asc, or, lte, not } from 'drizzle-orm';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
import { point } from '../../src/interfaces';

import { PurchaseOrderTable } from '../../src/drizzle/schema/purchaseOrder.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { 
  GetAdjacentPurchaseOrdersDto, 
  GetBetterPurchaseOrderDto, 
  GetSimilarRoutePurchaseOrdersDto, 
  GetSimilarTimePurchaseOrderDto
} from './dto/get-purchaseOrder.dto';
import { 
  ClientCreateOrderException, 
  ClientCreatePassengerNotificationException, 
  ClientCreateRidderNotificationException, 
  ClientEndBeforeStartException, 
  ClientInviteNotFoundException, 
  ClientPurchaseOrderNotFoundException, 
  ServerNeonAutoUpdateExpiredPurchaseOrderException 
} from '../exceptions';
import { RidderInviteTable } from '../drizzle/schema/ridderInvite.schema';
import { OrderTable } from '../drizzle/schema/order.schema';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { 
  NotificationTemplateOfCancelingPurchaseOrder, 
  NotificationTemplateOfRejectingRiddererInvite, 
  NotificationTemplateOfDirectlyStartOrder, 
} from '../notification/notificationTemplate';
import { SearchPriorityType } from '../types';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private passengerNotification: PassengerNotificationService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Detect And Update Expired PurchaseOrders operation ================================= */
  private async updateExpiredPurchaseOrders() {
    const response = await this.db.update(PurchaseOrderTable).set({
      status: "EXPIRED",
    }).where(and(
      eq(PurchaseOrderTable.status, "POSTED"),
      lt(PurchaseOrderTable.startAfter, new Date()),
    )).returning({
      id: PurchaseOrderTable.id,
    });
    if (!response) {  // response.length can potentially be 0, since there's no expited orders
      throw ServerNeonAutoUpdateExpiredPurchaseOrderException;
    }

    return response.length;
  }
  /* ================================= Detect And Update Expired PurchaseOrders operation ================================= */


  /* ================================= Create operations ================================= */
  async createPurchaseOrderByCreatorId(
    creatorId: string, 
    createPurchaseOrderDto: CreatePurchaseOrderDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingConflictPurchaseOrders = await tx.select({
        id: PurchaseOrderTable.id, 
      }).from(PurchaseOrderTable)
        .where(and(
          eq(PurchaseOrderTable.creatorId, creatorId), 
          not(lte(PurchaseOrderTable.endedAt, new Date(createPurchaseOrderDto.startAfter))), 
          not(gte(PurchaseOrderTable.startAfter, new Date(createPurchaseOrderDto.endedAt))), 
        )); // [start1, end1], [start2, end2], not conflict if [start1, end1, start2, end2] or [start2, end2, start1, end1]
            // so conflict if ![start1, end1, start2, end2] and ![start2, end2, start1, end1] -> and(not(end1 < start2), not(start1 > end2))

      const responseOfCreatingPurchaseOrder = await tx.insert(PurchaseOrderTable).values({
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
        startAfter: new Date(createPurchaseOrderDto.startAfter),
        endedAt: new Date(createPurchaseOrderDto.endedAt),
        isUrgent: createPurchaseOrderDto.isUrgent,
        autoAccept: createPurchaseOrderDto.autoAccept, 
      }).returning({
        id: PurchaseOrderTable.id,
        status: PurchaseOrderTable.status,
      });

      return [{
        hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0), 
        ...responseOfCreatingPurchaseOrder[0], 
      }];
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  // for specifying the details of the other purchaseOrders
  async getPurchaseOrderById(id: string) {
    return await this.db.query.PurchaseOrderTable.findFirst({
      where: and(
        ne(PurchaseOrderTable.status, "RESERVED"),
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
        startAfter: true,
        endedAt: true,
        isUrgent: true,
        status: true,
        autoAccept: true,
        createdAt: true,
        updatedAt: true,
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
  async searchPurchaseOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
  ) {
    return await this.db.select({
      id: PurchaseOrderTable.id,
      initPrice: PurchaseOrderTable.initPrice,
      startCord: PurchaseOrderTable.startCord,
      endCord: PurchaseOrderTable.endCord,
      startAddress: PurchaseOrderTable.startAddress,
      endAddress: PurchaseOrderTable.endAddress,
      startAfter: PurchaseOrderTable.startAfter,
      endedAt: PurchaseOrderTable.endedAt,
      createdAt: PurchaseOrderTable.createdAt,
      updatedAt: PurchaseOrderTable.updatedAt,
      isUrgent: PurchaseOrderTable.isUrgent,
      autoAccept: PurchaseOrderTable.autoAccept,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .where(and(
        eq(PurchaseOrderTable.creatorId, creatorId), 
        ne(PurchaseOrderTable.status, "RESERVED"), 
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
      )).orderBy(desc(PurchaseOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }
  
  async searchPaginationPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number,
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredPurchaseOrders();

    return await this.db.select({
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
      autoAccept: PurchaseOrderTable.autoAccept,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined),
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
        .orderBy(desc(PurchaseOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }

  async searchAboutToStartPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredPurchaseOrders();

    return await this.db.select({
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
      autoAccept: PurchaseOrderTable.autoAccept,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
        .orderBy(asc(PurchaseOrderTable.startAfter))
        .limit(limit)
        .offset(offset);
  }

  async searchSimliarTimePurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getSimilarTimePurchaseOrderDto: GetSimilarTimePurchaseOrderDto, 
  ) {
    await this.updateExpiredPurchaseOrders();

    return await this.db.select({
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
      autoAccept: PurchaseOrderTable.autoAccept,
      status: PurchaseOrderTable.status,
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"), 
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
        .orderBy(
          sql`ABS(EXTRACT(EPOCH FROM (${PurchaseOrderTable.startAfter} - ${getSimilarTimePurchaseOrderDto.startAfter}))) +
              ABS(EXTRACT(EPOCH FROM (${PurchaseOrderTable.endedAt} - ${getSimilarTimePurchaseOrderDto.endedAt}))) ASC`, 
        ).limit(limit)
         .offset(offset);
  }

  async searchCurAdjacentPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    await this.updateExpiredPurchaseOrders();

    return await this.db.select({
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
      autoAccept: PurchaseOrderTable.autoAccept,
      status: PurchaseOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${PurchaseOrderTable.startCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"), 
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
        .orderBy(sql`ST_Distance(
          ${PurchaseOrderTable.startCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
        )`)
        .limit(limit)
        .offset(offset);
  }

  async searchDestAdjacentPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
    getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, 
  ) {
    await this.updateExpiredPurchaseOrders();

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
      autoAccept: PurchaseOrderTable.autoAccept, 
      status: PurchaseOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${PurchaseOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentPurchaseOrdersDto.cordLongitude}, ${getAdjacentPurchaseOrdersDto.cordLatitude}), 4326)
      )`
    }).from(PurchaseOrderTable)
      .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
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
    isAutoAccept: boolean, 
    getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto, 
  ) {
    await this.updateExpiredPurchaseOrders();

    return await this.db.select({
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
      autoAccept: PurchaseOrderTable.autoAccept,
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
      .where(and(
        eq(PurchaseOrderTable.status, "POSTED"), 
        (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined), 
        or(
          (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
          (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
        ), 
      )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
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

  /* ================= Powerful Search operations ================= */
  async searchBetterFirstPurchaseOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
    getBetterPurchaseOrderDto: GetBetterPurchaseOrderDto, 
    searchPriorities: SearchPriorityType, 
  ) {
      let timeQuery: any = undefined, 
          routeQuery: any = undefined, startQuery: any = undefined, destQuery: any = undefined, 
          updatedAtQuery: any = undefined, aboutToStartQuery: any = undefined;
      let spaceResponseField: any = {};
      let timeResponseField: any = {};
      
      if (getBetterPurchaseOrderDto.startAfter || getBetterPurchaseOrderDto.endedAt) {
          timeQuery = sql`(
            ${getBetterPurchaseOrderDto.startAfter ? 
                sql`ABS(EXTRACT(EPOCH FROM (${PurchaseOrderTable.startAfter} - ${getBetterPurchaseOrderDto.startAfter})))` : 
                sql``}
            ${getBetterPurchaseOrderDto.startAfter && getBetterPurchaseOrderDto.endedAt ? sql` + ` : sql``}
            ${getBetterPurchaseOrderDto.endedAt ? 
                sql`ABS(EXTRACT(EPOCH FROM (${PurchaseOrderTable.endedAt} - ${getBetterPurchaseOrderDto.endedAt})))` : 
                sql``}
          ) ASC`;
          timeResponseField = { timeDiff: timeQuery };
      }

      if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude
          && getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude
      ) {
          routeQuery = sql`(
            ST_Distance(
                ${PurchaseOrderTable.startCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326)
            ) 
          + ST_Distance(
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326),
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326)
            ) 
          + ST_Distance(
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326),
                ${PurchaseOrderTable.endCord}
            ) 
          - ST_Distance(
                ${PurchaseOrderTable.startCord},
                ${PurchaseOrderTable.endCord}
            )
          ) ASC`;
          spaceResponseField = { RDV: routeQuery }
      }
      if (getBetterPurchaseOrderDto.startCordLongitude && getBetterPurchaseOrderDto.startCordLatitude) {
          startQuery = sql`(
            ST_Distance(
                ${PurchaseOrderTable.startCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.startCordLongitude}, ${getBetterPurchaseOrderDto.startCordLatitude}), 4326)
            )
          ) ASC`;
          spaceResponseField = { ...spaceResponseField, startManhattanDistance: startQuery }
      }
      if (getBetterPurchaseOrderDto.endCordLongitude && getBetterPurchaseOrderDto.endCordLatitude) {
          destQuery = sql`(
            ST_Distance(
                ${PurchaseOrderTable.endCord},
                ST_SetSRID(ST_MakePoint(${getBetterPurchaseOrderDto.endCordLongitude}, ${getBetterPurchaseOrderDto.endCordLatitude}), 4326)
            )
          ) ASC`;
          spaceResponseField = { ...spaceResponseField, destManhattanDistance: destQuery }
      }

      updatedAtQuery = sql`${PurchaseOrderTable.updatedAt} DESC`;
      aboutToStartQuery = sql`${PurchaseOrderTable.startAfter} ASC`;

      const sortMap = {
          'T': timeQuery, 
          'R': routeQuery, 
          'S': startQuery, 
          'D': destQuery, 
          'U': updatedAtQuery, 
      };

      const searchQueries = searchPriorities.split('')
          .map(symbol => sortMap[symbol])
          .filter(query => query !== undefined);
      searchQueries.push(aboutToStartQuery);

      await this.updateExpiredPurchaseOrders();

      return await this.db.select({
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
        autoAccept: PurchaseOrderTable.autoAccept,
        status: PurchaseOrderTable.status,
        ...timeResponseField, 
        ...spaceResponseField, 
      }).from(PurchaseOrderTable)
        .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id))
        .where(and(
          eq(PurchaseOrderTable.status, "POSTED"),
          (isAutoAccept ? eq(PurchaseOrderTable.autoAccept, true) : undefined),
          or(
            (creatorName ? like(PassengerTable.userName, creatorName + "%") : undefined),
            (creatorName ? like(PassengerTable.email, creatorName + "%") : undefined)
          ), 
        ))
        .leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
        .orderBy(...searchQueries)
        .limit(limit)
        .offset(offset);
  }
  /* ================= Powerful Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updatePurchaseOrderById(
    id: string, // id of the order, for finding the specific order
    creatorId: string,  // id of the passenger who want to update this order, for checking the validation
    updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ) {
    return await this.db.transaction(async (tx) => {
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

      let responseOfSelectingConflictPurchaseOrders: any = undefined;
      if (updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt) {
        const [startAfter, endedAt] = [new Date(updatePurchaseOrderDto.startAfter), new Date(updatePurchaseOrderDto.endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPurchaseOrders = await tx.select({
          id: PurchaseOrderTable.id, 
        }).from(PurchaseOrderTable)
          .where(and(
            eq(PurchaseOrderTable.creatorId, creatorId), 
            not(lte(PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter))), 
            not(gte(PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt))), 
          ));
      } else if (updatePurchaseOrderDto.startAfter && !updatePurchaseOrderDto.endedAt) {
        const tempResponse = await tx.select({
          endedAt: PurchaseOrderTable.endedAt,
        }).from(PurchaseOrderTable)
          .where(and(
            eq(PurchaseOrderTable.id, id), 
            eq(PurchaseOrderTable.creatorId, creatorId),
            ne(PurchaseOrderTable.status, "RESERVED"),
          ));
        if (!tempResponse || tempResponse.length === 0) throw ClientPurchaseOrderNotFoundException;

        const [startAfter, endedAt] = [new Date(updatePurchaseOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPurchaseOrders = await tx.select({
          id: PurchaseOrderTable.id, 
        }).from(PurchaseOrderTable)
          .where(and(
            eq(PurchaseOrderTable.creatorId, creatorId), 
            not(lte(PurchaseOrderTable.endedAt, new Date(updatePurchaseOrderDto.startAfter))),
          ));
      } else if (!updatePurchaseOrderDto.startAfter && updatePurchaseOrderDto.endedAt) {
        const tempResponse = await tx.select({
          startAfter: PurchaseOrderTable.startAfter,
        }).from(PurchaseOrderTable)
          .where(and(
            eq(PurchaseOrderTable.id, id), 
            eq(PurchaseOrderTable.creatorId, creatorId), 
            ne(PurchaseOrderTable.status, "RESERVED"), 
          ));
        if (!tempResponse || tempResponse.length === 0) throw ClientPurchaseOrderNotFoundException;

        const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updatePurchaseOrderDto.endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictPurchaseOrders = await tx.select({
          id: PurchaseOrderTable.id, 
        }).from(PurchaseOrderTable)
          .where(and(
            eq(PurchaseOrderTable.creatorId, creatorId), 
            not(gte(PurchaseOrderTable.startAfter, new Date(updatePurchaseOrderDto.endedAt))), 
          ));
      }

      const responseOfUpdatingPurchaseOrder = await tx.update(PurchaseOrderTable).set({
        description: updatePurchaseOrderDto.description,
        initPrice: updatePurchaseOrderDto.initPrice,
        ...(newStartCord 
          ? { startCord: sql`ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)`}
          : {}
        ),
        ...(newEndCord 
          ? { endCord: sql`ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)`}
          : {}
        ),
        startAddress: updatePurchaseOrderDto.startAddress,
        endAddress: updatePurchaseOrderDto.endAddress,
        ...(updatePurchaseOrderDto.startAfter
          ? { startAfter: new Date(updatePurchaseOrderDto.startAfter) }
          : {}
        ),
        ...(updatePurchaseOrderDto.endedAt
          ? { endedAt: new Date(updatePurchaseOrderDto.endedAt) }
          : {}
        ),
        isUrgent: updatePurchaseOrderDto.isUrgent,
        autoAccept: updatePurchaseOrderDto.autoAccept,
        status: updatePurchaseOrderDto.status,
        updatedAt: new Date(),
      }).where(and(
        ne(PurchaseOrderTable.status, "RESERVED"),
        (updatePurchaseOrderDto.startAfter || updatePurchaseOrderDto.endedAt 
          ? undefined 
          : ne(PurchaseOrderTable.status, "EXPIRED")
        ), // if the user don't update startAfter or endedAt in this time, 
          // then we add the constrant of excluding the "EXPIRED" purchaseOrder
        eq(PurchaseOrderTable.id, id), 
        eq(PurchaseOrderTable.creatorId, creatorId),
      )).returning({
        id: PurchaseOrderTable.id,
        status: PurchaseOrderTable.status,
      });

      return [{
        hasConflict: (responseOfSelectingConflictPurchaseOrders && responseOfSelectingConflictPurchaseOrders.length !== 0), 
        ...responseOfUpdatingPurchaseOrder[0], 
      }];
    });
  }

  /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
  async startPurchaseOrderWithoutInvite(
    id: string, 
    userId: string, 
    userName: string, 
    acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto,
  ) {
    return await this.db.transaction(async (tx) => {
      const purchaseOrder = await tx.select({
        passengerName: PassengerTable.userName, 
      }).from(PurchaseOrderTable)
        .where(eq(PurchaseOrderTable.id, id))
        .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
      if (!purchaseOrder || purchaseOrder.length === 0) {
        throw ClientPurchaseOrderNotFoundException;
      }

      const responseOfRejectingOtherRidderInvites = await tx.update(RidderInviteTable).set({
        status: "REJECTED",
        updatedAt: new Date(),
      }).where(and(
        eq(RidderInviteTable.orderId, id),
        eq(RidderInviteTable.status, "CHECKING"), 
      )).returning({
        id: RidderInviteTable.id, 
        userId: RidderInviteTable.userId, 
      });
      if (responseOfRejectingOtherRidderInvites && responseOfRejectingOtherRidderInvites.length !== 0) {
        const responseOfCreatingNotificationToRejectOters = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
          responseOfRejectingOtherRidderInvites.map((content) => {
            return NotificationTemplateOfRejectingRiddererInvite(
              purchaseOrder[0].passengerName as string, 
              `${purchaseOrder[0].passengerName}'s order purchase order has started directly by some other ridder`, 
              content.userId, 
              content.id, 
            )
          })
        );
        if (!responseOfCreatingNotificationToRejectOters
            || responseOfCreatingNotificationToRejectOters.length !== responseOfRejectingOtherRidderInvites.length) {
              throw ClientCreateRidderNotificationException;
        }
      }

      const responseOfDeletingPurchaseOrder = await tx.update(PurchaseOrderTable).set({
        status: "RESERVED",
        updatedAt: new Date(),
      }).where(and(
        eq(PurchaseOrderTable.id, id), 
        eq(PurchaseOrderTable.status, "POSTED"), 
        eq(PurchaseOrderTable.autoAccept, true), // require this field
      )).returning();
      if (!responseOfDeletingPurchaseOrder || responseOfDeletingPurchaseOrder.length === 0) {
        throw ClientPurchaseOrderNotFoundException;
      }

      const responseOfCreatingOrder = await tx.insert(OrderTable).values({
        ridderId: userId,
        passengerId: responseOfDeletingPurchaseOrder[0].creatorId,
        prevOrderId: "PurchaseOrder" + " " + responseOfDeletingPurchaseOrder[0].id, 
        finalPrice: responseOfDeletingPurchaseOrder[0].initPrice, // the receiver accept the suggest price
        passengerDescription: responseOfDeletingPurchaseOrder[0].description,
        ridderDescription: acceptAutoAcceptPurchaseOrderDto.description,
        finalStartCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDeletingPurchaseOrder[0].startCord.x}, ${responseOfDeletingPurchaseOrder[0].startCord.y}), 4326)`,
        finalEndCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDeletingPurchaseOrder[0].endCord.x}, ${responseOfDeletingPurchaseOrder[0].endCord.y}), 4326)`,
        finalStartAddress: responseOfDeletingPurchaseOrder[0].startAddress,
        finalEndAddress: responseOfDeletingPurchaseOrder[0].endAddress,
        startAfter: responseOfDeletingPurchaseOrder[0].startAfter,  // the receiver accept the suggest start time
        endedAt: responseOfDeletingPurchaseOrder[0].endedAt,
      }).returning({
        id: OrderTable.id,
        finalPrice: OrderTable.finalPrice,
        finalStartCord: OrderTable.finalStartCord, 
        finalEndCord: OrderTable.finalEndCord, 
        finalStartAddress: OrderTable.finalStartAddress, 
        finalEndAddress: OrderTable.finalEndAddress, 
        startAfter: OrderTable.startAfter,
        endedAt: OrderTable.endedAt,
        status: OrderTable.passengerStatus, // use either passengerStatus or ridderStatus is fine
      });
      if (!responseOfCreatingOrder || responseOfCreatingOrder.length === 0) {
        throw ClientCreateOrderException;
      }

      const responseOfCreatingNotification = await this.passengerNotification.createPassengerNotificationByUserId(
        NotificationTemplateOfDirectlyStartOrder(
          userName, 
          responseOfDeletingPurchaseOrder[0].creatorId, 
          responseOfCreatingOrder[0].id, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreatePassengerNotificationException;
      }

      return [{
        orderId: responseOfCreatingOrder[0].id,
        price: responseOfCreatingOrder[0].finalPrice,
        finalStartCord: responseOfCreatingOrder[0].finalStartCord, 
        finalEndCord: responseOfCreatingOrder[0].finalEndCord,
        finalStartAddress: responseOfCreatingOrder[0].finalStartAddress,
        finalEndAddress: responseOfCreatingOrder[0].finalEndAddress,
        startAfter: responseOfCreatingOrder[0].startAfter,
        endedAt: responseOfCreatingOrder[0].endedAt,
        orderStatus: responseOfCreatingOrder[0].status, // use either passengerStatus or ridderStatus is fine
      }];
    });
  }
  /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async cancelPurchaseOrderById(
    id: string, 
    creatorId: string, 
    creatorName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfCancelingPurchaseOrder = await tx.update(PurchaseOrderTable).set({
        status: "CANCEL", 
      }).where(and(
        eq(PurchaseOrderTable.id, id), 
        eq(PurchaseOrderTable.creatorId, creatorId), 
        eq(PurchaseOrderTable.status, "POSTED"),
      )).returning({
        id: PurchaseOrderTable.id, 
        stauts: PurchaseOrderTable.status, 
      });
      if (!responseOfCancelingPurchaseOrder || responseOfCancelingPurchaseOrder.length === 0) {
        throw ClientPurchaseOrderNotFoundException;
      }
  
      const responseOfCancelingRidderInvite = await tx.update(RidderInviteTable).set({
        status: "CANCEL", 
      }).where(and(
        eq(RidderInviteTable.orderId, id), 
        eq(RidderInviteTable.status, "CHECKING"), 
      )).returning({
        id: RidderInviteTable.id, 
        ridderId: RidderInviteTable.userId, 
      });
      if (!responseOfCancelingRidderInvite || responseOfCancelingRidderInvite.length === 0) {
          throw ClientInviteNotFoundException;
      }
  
      const responseOfCreatingNotification = await this.ridderNotification.createMultipleRidderNotificationsByUserId(
        responseOfCancelingRidderInvite.map((content) => {
          return NotificationTemplateOfCancelingPurchaseOrder(
            creatorName, 
            content.ridderId, 
            responseOfCancelingPurchaseOrder[0].id, 
          );
        })
      )
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
      }
  
      return responseOfCancelingPurchaseOrder;
    });
  }

  async deletePurchaseOrderById(id: string, creatorId: string) {
    return await this.db.delete(PurchaseOrderTable)
      .where(and(
        ne(PurchaseOrderTable.status, "POSTED"),
        eq(PurchaseOrderTable.id, id), 
        eq(PurchaseOrderTable.creatorId, creatorId)
      )).returning({
        id: PurchaseOrderTable.id,
        status: PurchaseOrderTable.status,
      });
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Test operations ================================= */
  // async getAllPurchaseOrders() {
  //   return await this.db.select().from(PurchaseOrderTable);
  // }

  // async searchPaginationPurchaseOrdersWithUpdateExpired(updateExpiredData: boolean, userName: string | undefined = undefined, limit: number, offset: number) {
  //   if (updateExpiredData) {
  //     const responseOfUpdatingExpiredPurchaseOrder = await this.db.update(PurchaseOrderTable).set({
  //       status: "EXPIRED",
  //     }).where(and(
  //       eq(PurchaseOrderTable.status, "POSTED"),
  //       gte(PurchaseOrderTable.startAfter, new Date()),
  //     )).returning({
  //       id: PurchaseOrderTable.id,
  //     });
  //     if (!responseOfUpdatingExpiredPurchaseOrder) {
  //       throw { message: "test" }
  //     }
  //   }

  //   const query = this.db.select({
  //     id: PurchaseOrderTable.id,
  //     creatorName: PassengerTable.userName,
  //     avatorUrl: PassengerInfoTable.avatorUrl,
  //     initPrice: PurchaseOrderTable.initPrice,
  //     startCord: PurchaseOrderTable.startCord,
  //     endCord: PurchaseOrderTable.endCord,
  //     startAddress: PurchaseOrderTable.startAddress,
  //     endAddress: PurchaseOrderTable.endAddress,
  //     createdAt: PurchaseOrderTable.createdAt,
  //     updatedAt: PurchaseOrderTable.updatedAt,
  //     startAfter: PurchaseOrderTable.startAfter,
  //     endedAt: PurchaseOrderTable.endedAt,
  //     isUrgent: PurchaseOrderTable.isUrgent,
  //     status: PurchaseOrderTable.status,
  //   }).from(PurchaseOrderTable)
  //     .leftJoin(PassengerTable, eq(PurchaseOrderTable.creatorId, PassengerTable.id));
    
  //   if (userName) {
  //     query.where(and(
  //       eq(PurchaseOrderTable.status, "POSTED"),
  //       like(PassengerTable.userName, userName + "%"),
  //     ));
  //   } else {
  //     query.where(eq(PurchaseOrderTable.status, "POSTED"));
  //   }
      
  //   query.leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
  //        .orderBy(desc(PurchaseOrderTable.updatedAt))
  //        .limit(limit)
  //        .offset(offset);
    
  //   return await query; // await should be place here, since we done the query right here
  // }
  /* ================================= Test operations ================================= */
}
