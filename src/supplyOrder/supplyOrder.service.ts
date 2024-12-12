import { Inject, Injectable } from '@nestjs/common';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { SupplyOrderTable } from '../../src/drizzle/schema/supplyOrder.schema';
import { and, asc, desc, eq, gte, like, lt, lte, ne, not, sql } from 'drizzle-orm';
import { 
  GetAdjacentSupplyOrdersDto, 
  GetBetterSupplyOrderDto, 
  GetSimilarRouteSupplyOrdersDto, 
  GetSimilarTimeSupplyOrderDto
} from './dto/get-supplyOrder.dto';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { point } from '../interfaces/point.interface';
import { 
  ClientCreateOrderException, 
  ClientCreatePassengerNotificationException, 
  ClientCreateRidderNotificationException, 
  ClientEndBeforeStartException, 
  ClientInviteNotFoundException, 
  ClientSupplyOrderNotFoundException, 
  ServerNeonAutoUpdateExpiredSupplyOrderException 
} from '../exceptions';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
import { PassengerInviteTable } from '../drizzle/schema/passengerInvite.schema';
import { OrderTable } from '../drizzle/schema/order.schema';
import { 
  NotificationTemplateOfCancelingSupplyOrder, 
  NotificationTemplateOfRejectingPassengerInvite, 
  NotificationTemplateOfDirectlyStartOrder 
} from '../notification/notificationTemplate';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { SearchPriorityType } from '../types';

@Injectable()
export class SupplyOrderService {
  constructor(
    private passengerNotification: PassengerNotificationService, 
    private ridderNotification: RidderNotificationService, 
    @Inject(DRIZZLE) private db: DrizzleDB
  ) {}

  /* ================================= Detect And Update Expired SupplyOrders operation ================================= */
  private async updateExpiredSupplyOrders() {
    const response = await this.db.update(SupplyOrderTable).set({
      status: "EXPIRED",
    }).where(and(
      eq(SupplyOrderTable.status, "POSTED"),
      lt(SupplyOrderTable.startAfter, new Date()),
    )).returning({
      id: SupplyOrderTable.id,
    });
    if (!response) {
      throw ServerNeonAutoUpdateExpiredSupplyOrderException;
    }

    return response.length;
  }
  /* ================================= Detect And Update Expired SupplyOrders operation ================================= */


  /* ================================= Create operations ================================= */
  async createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingConflictSupplyOrders = await tx.select({
        id: SupplyOrderTable.id, 
      }).from(SupplyOrderTable)
        .where(and(
          eq(SupplyOrderTable.creatorId, creatorId), 
          not(lte(SupplyOrderTable.endedAt, new Date(createSupplyOrderDto.startAfter))), 
          not(gte(SupplyOrderTable.startAfter, new Date(createSupplyOrderDto.endedAt))), 
        ));

      const responseOfCreatingSupplyOrder = await tx.insert(SupplyOrderTable).values({
        creatorId: creatorId,
        description: createSupplyOrderDto.description,
        initPrice: createSupplyOrderDto.initPrice,
        startCord: sql`ST_SetSRID(
          ST_MakePoint(${createSupplyOrderDto.startCordLongitude}, ${createSupplyOrderDto.startCordLatitude}), 
          4326
        )`,
        endCord: sql`ST_SetSRID(
          ST_MakePoint(${createSupplyOrderDto.endCordLongitude}, ${createSupplyOrderDto.endCordLatitude}), 
          4326
        )`,
        startAddress: createSupplyOrderDto.startAddress,
        endAddress: createSupplyOrderDto.endAddress,
        startAfter: new Date(createSupplyOrderDto.startAfter),
        endedAt: new Date(createSupplyOrderDto.endedAt),
        tolerableRDV: createSupplyOrderDto.tolerableRDV,
        autoAccept: createSupplyOrderDto.autoAccept,
      }).returning({
        id: SupplyOrderTable.id,
        status: SupplyOrderTable.status,
      });

      return [{
        hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0), 
        ...responseOfCreatingSupplyOrder[0], 
      }];
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  // for specifying the details of that other SupplyOrders
  async getSupplyOrderById(id: string) {
    return await this.db.query.SupplyOrderTable.findFirst({
      where: and(
        eq(SupplyOrderTable.status, "POSTED"),
        eq(SupplyOrderTable.id, id),
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
        updatedAt: true,
        startAfter: true,
        endedAt: true,
        tolerableRDV: true,
        autoAccept: true,
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
                motocycleType: true,
                motocyclePhotoUrl: true,
              }
            }
          }
        }
      }
    });
    // return await this.db.select({
    //   id: SupplyOrderTable.id,
    //   creatorName: RidderTable.userName,
    //   avatorUrl: RidderInfoTable.avatorUrl,
    //   initPrice: SupplyOrderTable.initPrice,
    //   startCord: SupplyOrderTable.startCord,
    //   endCord: SupplyOrderTable.endCord,
    //   createdAt: SupplyOrderTable.createdAt,
    //   updatedAt: SupplyOrderTable.updatedAt,
    //   startAfter: SupplyOrderTable.startAfter,
    //   tolerableRDV: SupplyOrderTable.tolerableRDV,
    //   status: SupplyOrderTable.status,
    // }).from(SupplyOrderTable)
    //   .where(eq(SupplyOrderTable.id, id))
    //   .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
    //   .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
    //   .limit(1);
  }

  /* ================= Search operations ================= */
  async searchSupplyOrdersByCreatorId(
    creatorId: string, 
    limit: number, 
    offset: number,
    isAutoAccept: boolean, 
  ) {
    return await this.db.select({
      id: SupplyOrderTable.id,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .where(and(
        eq(SupplyOrderTable.creatorId, creatorId), 
        ne(SupplyOrderTable.status, "RESERVED"), 
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
      )).orderBy(desc(SupplyOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }

  async searchPaginationSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined), 
      )).leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
        .orderBy(desc(SupplyOrderTable.updatedAt))
        .limit(limit)
        .offset(offset);
  }

  async searchAboutToStartSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
        .orderBy(asc(SupplyOrderTable.startAfter))
        .limit(limit)
        .offset(offset);
  }

  async searchSimilarTimeSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getSimilarTimeSupplyOrderDto: GetSimilarTimeSupplyOrderDto, 
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined), 
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(
          sql`ABS(EXTRACT(EPOCH FROM (${SupplyOrderTable.startAfter} - ${getSimilarTimeSupplyOrderDto.startAfter}))) + 
              ABS(EXTRACT(EPOCH FROM (${SupplyOrderTable.endedAt} - ${getSimilarTimeSupplyOrderDto.endedAt})))`
        ).limit(limit)
         .offset(offset);
  }
  
  async searchCurAdjacentSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number, 
    offset: number, 
    isAutoAccept: boolean, 
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.startCord}, 
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined), 
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(sql`ST_Distance(
          ${SupplyOrderTable.startCord}, 
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
        .limit(limit)
        .offset(offset);
  }

  async searchDestAdjacentSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
      status: SupplyOrderTable.status,
      manhattanDistance: sql`ST_Distance(
        ${SupplyOrderTable.endCord},
        ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
      )`
    }).from(SupplyOrderTable)
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
        .orderBy(sql`ST_Distance(
          ${SupplyOrderTable.endCord},
          ST_SetSRID(ST_MakePoint(${getAdjacentSupplyOrdersDto.cordLongitude}, ${getAdjacentSupplyOrdersDto.cordLatitude}), 4326)
        )`)
        .limit(limit)
        .offset(offset);
  }

  async searchSimilarRouteSupplyOrders(
    creatorName: string | undefined = undefined,
    limit: number,
    offset: number,
    isAutoAccept: boolean, 
    getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto
  ) {
    await this.updateExpiredSupplyOrders();
    // consider the similarity of the given route and every other passible route in SupplyOrderTable
    // RDV = (|ridder.start - passenger.start| + |passenger.start - passenger.end| + |passenger.end - ridder.end|) - (|ridder.start - ridder.end|)

    return await this.db.select({
      id: SupplyOrderTable.id,
      creatorName: RidderTable.userName,
      avatorUrl: RidderInfoTable.avatorUrl,
      initPrice: SupplyOrderTable.initPrice,
      startCord: SupplyOrderTable.startCord,
      endCord: SupplyOrderTable.endCord,
      startAddress: SupplyOrderTable.startAddress,
      endAddress: SupplyOrderTable.endAddress,
      createdAt: SupplyOrderTable.createdAt,
      updatedAt: SupplyOrderTable.updatedAt,
      startAfter: SupplyOrderTable.startAfter,
      endedAt: SupplyOrderTable.endedAt,
      tolerableRDV: SupplyOrderTable.tolerableRDV,
      motocycleType: RidderInfoTable.motocycleType,
      autoAccept: SupplyOrderTable.autoAccept,
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
      .leftJoin(RidderTable, eq(RidderTable.id, SupplyOrderTable.creatorId))
      .where(and(
        eq(SupplyOrderTable.status, "POSTED"),
        (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined), 
        (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
      )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
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

  /* ================= Powerful Search operations ================= */
  async searchBetterFirstSupplyOrders(
      creatorName: string | undefined = undefined,
      limit: number, 
      offset: number, 
      isAutoAccept: boolean, 
      getBetterSupplyOrderDto: GetBetterSupplyOrderDto, 
      searchPriorities: SearchPriorityType, 
    ) {
        let timeQuery: any = undefined, aboutToStartQuery: any = undefined, 
            routeQuery: any = undefined, startQuery: any = undefined, destQuery: any = undefined, 
            updatedAtQuery: any = undefined;
        let spaceResponseField: any = {};
        
        if (getBetterSupplyOrderDto.startAfter || getBetterSupplyOrderDto.endedAt) {
            timeQuery = sql`(
              ${getBetterSupplyOrderDto.startAfter ? 
                  sql`ABS(EXTRACT(EPOCH FROM (${SupplyOrderTable.startAfter} - ${getBetterSupplyOrderDto.startAfter})))` : 
                  sql``}
              ${getBetterSupplyOrderDto.startAfter && getBetterSupplyOrderDto.endedAt ? sql` + ` : sql``}
              ${getBetterSupplyOrderDto.endedAt ? 
                  sql`ABS(EXTRACT(EPOCH FROM (${SupplyOrderTable.endedAt} - ${getBetterSupplyOrderDto.endedAt})))` : 
                  sql``}
            ) ASC`;
        }
  
        if (getBetterSupplyOrderDto.startCordLongitude && getBetterSupplyOrderDto.startCordLatitude
            && getBetterSupplyOrderDto.endCordLongitude && getBetterSupplyOrderDto.endCordLatitude
        ) {
            routeQuery = sql`(
              ST_Distance(
                  ${SupplyOrderTable.startCord},
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.startCordLongitude}, ${getBetterSupplyOrderDto.startCordLatitude}), 4326)
              ) 
            + ST_Distance(
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.startCordLongitude}, ${getBetterSupplyOrderDto.startCordLatitude}), 4326),
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.endCordLongitude}, ${getBetterSupplyOrderDto.endCordLatitude}), 4326)
              ) 
            + ST_Distance(
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.endCordLongitude}, ${getBetterSupplyOrderDto.endCordLatitude}), 4326),
                  ${SupplyOrderTable.endCord}
              ) 
            - ST_Distance(
                  ${SupplyOrderTable.startCord},
                  ${SupplyOrderTable.endCord}
              )
            ) ASC`;
            spaceResponseField = { RDV: routeQuery }
        } else if (getBetterSupplyOrderDto.startCordLongitude && getBetterSupplyOrderDto.startCordLatitude) {
            startQuery = sql`(
              ST_Distance(
                  ${SupplyOrderTable.startCord},
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.startCordLongitude}, ${getBetterSupplyOrderDto.startCordLatitude}), 4326)
              )
            ) ASC`;
            spaceResponseField = { ...spaceResponseField,  startManhattanDistance: startQuery }
        } else if (getBetterSupplyOrderDto.endCordLongitude && getBetterSupplyOrderDto.endCordLatitude) {
            destQuery = sql`(
              ST_Distance(
                  ${SupplyOrderTable.endCord},
                  ST_SetSRID(ST_MakePoint(${getBetterSupplyOrderDto.endCordLongitude}, ${getBetterSupplyOrderDto.endCordLatitude}), 4326)
              )
            ) ASC`;
            spaceResponseField = { ...spaceResponseField, destManhattanDistance: destQuery }
        }
  
        updatedAtQuery = sql`${SupplyOrderTable.updatedAt} DESC`;
        aboutToStartQuery = sql`${SupplyOrderTable.startAfter} ASC`
  
        const sortMap = {
            'T': timeQuery, 
            'R': routeQuery,
            'S': startQuery, 
            'D': destQuery,  
            'U': updatedAtQuery, 
        }
  
        const searchQueries = searchPriorities.split('')
            .map(symbol => sortMap[symbol])
            .filter(query => query !== undefined);
        searchQueries.push(aboutToStartQuery);
  
        await this.updateExpiredSupplyOrders();
  
        return await this.db.select({
          id: SupplyOrderTable.id,
          creatorName: RidderTable.userName,
          avatorUrl: RidderInfoTable.avatorUrl,
          initPrice: SupplyOrderTable.initPrice,
          startCord: SupplyOrderTable.startCord,
          endCord: SupplyOrderTable.endCord,
          startAddress: SupplyOrderTable.startAddress,
          endAddress: SupplyOrderTable.endAddress,
          createdAt: SupplyOrderTable.createdAt,
          updatedAt: SupplyOrderTable.updatedAt,
          startAfter: SupplyOrderTable.startAfter,
          endedAt: SupplyOrderTable.endedAt,
          tolerableRDV: SupplyOrderTable.tolerableRDV,
          autoAccept: SupplyOrderTable.autoAccept,
          status: SupplyOrderTable.status,
          ...spaceResponseField, 
        }).from(SupplyOrderTable)
          .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id))
          .where(and(
            eq(SupplyOrderTable.status, "POSTED"),
            (isAutoAccept ? eq(SupplyOrderTable.autoAccept, true) : undefined),
            (creatorName ? like(RidderTable.userName, creatorName + "%") : undefined),
          ))
          .leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
          .orderBy(...searchQueries)
          .limit(limit)
          .offset(offset);
    }
  /* ================= Powerful Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateSupplyOrderById(
    id: string, 
    creatorId: string,
    updateSupplyOrderDto: UpdateSupplyOrderDto
  ) {
    return await this.db.transaction(async (tx) => {
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
  
      let responseOfSelectingConflictSupplyOrders: any = undefined;
      if (updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
        const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(updateSupplyOrderDto.endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictSupplyOrders = await tx.select({
          id: SupplyOrderTable.id, 
        }).from(SupplyOrderTable)
          .where(and(
            eq(SupplyOrderTable.creatorId, creatorId), 
            not(lte(SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter))), 
            not(gte(SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt))), 
          ));
      } else if (updateSupplyOrderDto.startAfter && !updateSupplyOrderDto.endedAt) {
        const tempResponse = await tx.select({
          endedAt: SupplyOrderTable.endedAt,
        }).from(SupplyOrderTable)
          .where(and(
            ne(SupplyOrderTable.status, "RESERVED"),
            eq(SupplyOrderTable.id, id), 
            eq(SupplyOrderTable.creatorId, creatorId),
          ));
        if (!tempResponse || tempResponse.length === 0) throw ClientSupplyOrderNotFoundException;
  
        const [startAfter, endedAt] = [new Date(updateSupplyOrderDto.startAfter), new Date(tempResponse[0].endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictSupplyOrders = await tx.select({
          id: SupplyOrderTable.id, 
        }).from(SupplyOrderTable)
          .where(and(
            eq(SupplyOrderTable.creatorId, creatorId), 
            not(lte(SupplyOrderTable.endedAt, new Date(updateSupplyOrderDto.startAfter))), 
          ));
      } else if (!updateSupplyOrderDto.startAfter && updateSupplyOrderDto.endedAt) {
        const tempResponse = await tx.select({
          startAfter: SupplyOrderTable.startAfter,
        }).from(SupplyOrderTable)
          .where(and(
            ne(SupplyOrderTable.status, "RESERVED"),
            eq(SupplyOrderTable.id, id), 
            eq(SupplyOrderTable.creatorId, creatorId),
          ));
        if (!tempResponse || tempResponse.length === 0) throw ClientSupplyOrderNotFoundException;
  
        const [startAfter, endedAt] = [new Date(tempResponse[0].startAfter), new Date(updateSupplyOrderDto.endedAt)];
        if (startAfter >= endedAt) throw ClientEndBeforeStartException;

        responseOfSelectingConflictSupplyOrders = await tx.select({
          id: SupplyOrderTable.id, 
        }).from(SupplyOrderTable)
          .where(and(
            eq(SupplyOrderTable.creatorId, creatorId), 
            not(gte(SupplyOrderTable.startAfter, new Date(updateSupplyOrderDto.endedAt))), 
          ));
      }
  
      const resposeOfUpdatingSupplyOrder = await tx.update(SupplyOrderTable).set({
        description: updateSupplyOrderDto.description,
        initPrice: updateSupplyOrderDto.initPrice,
        ...(newStartCord 
          ? { startCord: sql`ST_SetSRID(ST_MakePoint(${newStartCord.x}, ${newStartCord.y}), 4326)`}
          : {}
        ),
        ...(newEndCord 
          ? { endCord: sql`ST_SetSRID(ST_MakePoint(${newEndCord.x}, ${newEndCord.y}), 4326)`}
          : {}
        ),
        startAddress: updateSupplyOrderDto.startAddress,
        endAddress: updateSupplyOrderDto.endAddress,
        ...(updateSupplyOrderDto.startAfter
          ? { startAfter: new Date(updateSupplyOrderDto.startAfter) }
          : {}
        ),
        ...(updateSupplyOrderDto.endedAt
          ? { endedAt: new Date(updateSupplyOrderDto.endedAt) }
          : {}
        ),
        tolerableRDV: updateSupplyOrderDto.tolerableRDV,
        autoAccept: updateSupplyOrderDto.autoAccept,
        status: updateSupplyOrderDto.status,
        updatedAt: new Date(),
      }).where(and(
        ne(SupplyOrderTable.status, "RESERVED"),
        (updateSupplyOrderDto.startAfter || updateSupplyOrderDto.endedAt 
          ? undefined 
          : ne(SupplyOrderTable.status, "EXPIRED")
        ), // if the user don't update startAfter or endedAt in this time, 
           // then we add the constrant of excluding the "EXPIRED" supplyOrder
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.creatorId, creatorId),
      )).returning({
        id: SupplyOrderTable.id,
        status: SupplyOrderTable.status,
      });
      
      return [{
        hasConflict: (responseOfSelectingConflictSupplyOrders && responseOfSelectingConflictSupplyOrders.length !== 0), 
        ...resposeOfUpdatingSupplyOrder[0], 
      }];
    });
  }
  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */
  async startSupplyOrderWithoutInvite(
    id: string, 
    userId: string, 
    userName: string, 
    acceptAutoAcceptSupplyOrderDto: AcceptAutoAcceptSupplyOrderDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      const supplyOrder = await tx.select({
        ridderName: RidderTable.userName, 
      }).from(SupplyOrderTable)
        .where(eq(SupplyOrderTable.id, id))
        .leftJoin(RidderTable, eq(SupplyOrderTable.creatorId, RidderTable.id));
      if (!supplyOrder || supplyOrder.length === 0) {
        throw ClientSupplyOrderNotFoundException;
      }

      const responseOfRejectingOtherPassengerInvites = await tx.update(PassengerInviteTable).set({
        status: "REJECTED",
        updatedAt: new Date(),
      }).where(and(
        eq(PassengerInviteTable.orderId, id),
        eq(PassengerInviteTable.status, "CHECKING"),
      )).returning({
        id: PassengerInviteTable.id, 
        userId: PassengerInviteTable.userId, 
      });
      if (responseOfRejectingOtherPassengerInvites && responseOfRejectingOtherPassengerInvites.length !== 0) {
        const responseOfCreatingNotificationToRejectOthers = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
          responseOfRejectingOtherPassengerInvites.map((content) => {
            return NotificationTemplateOfRejectingPassengerInvite(
              supplyOrder[0].ridderName as string, 
              `${supplyOrder[0].ridderName}'s supply order has started directly by some other passenger`, 
              content.userId, 
              content.id, 
            )
          })
        );
        if (!responseOfCreatingNotificationToRejectOthers 
            || responseOfCreatingNotificationToRejectOthers.length !== responseOfRejectingOtherPassengerInvites.length) {
              throw ClientCreatePassengerNotificationException;
        }
      }

      const responseOfDeletingSupplyOrder = await tx.update(SupplyOrderTable).set({ // will delete this supplyOrder later
        status: "RESERVED",
        updatedAt: new Date(),
      }).where(and(
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.status, "POSTED"), 
        eq(SupplyOrderTable.autoAccept, true), // require this field
      )).returning();
      if (!responseOfDeletingSupplyOrder || responseOfDeletingSupplyOrder.length === 0) {
        throw ClientSupplyOrderNotFoundException;
      }

      const responseOfCreatingOrder = await tx.insert(OrderTable).values({
        ridderId: responseOfDeletingSupplyOrder[0].creatorId,
        passengerId: userId,
        prevOrderId: "PurchaseOrder" + " " + responseOfDeletingSupplyOrder[0].id, 
        finalPrice: responseOfDeletingSupplyOrder[0].initPrice, // the receiver accept the suggest price
        passengerDescription: responseOfDeletingSupplyOrder[0].description,
        ridderDescription: acceptAutoAcceptSupplyOrderDto.description,
        finalStartCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDeletingSupplyOrder[0].startCord.x}, ${responseOfDeletingSupplyOrder[0].startCord.y}), 4326)`,
        finalEndCord: sql`ST_SetSRID(ST_MakePoint(${responseOfDeletingSupplyOrder[0].endCord.x}, ${responseOfDeletingSupplyOrder[0].endCord.y}), 4326)`,
        finalStartAddress: responseOfDeletingSupplyOrder[0].startAddress,
        finalEndAddress: responseOfDeletingSupplyOrder[0].endAddress,
        startAfter: responseOfDeletingSupplyOrder[0].startAfter,  // the receiver accept the suggest start time
        endedAt: responseOfDeletingSupplyOrder[0].endedAt,
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

      const responseOfCreatingNotification = await this.ridderNotification.createRidderNotificationByUserId(
        NotificationTemplateOfDirectlyStartOrder(
          userName, 
          responseOfDeletingSupplyOrder[0].creatorId, 
          responseOfCreatingOrder[0].id, 
        )
      );
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreateRidderNotificationException;
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
  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async cancelSupplyOrderById(
    id: string, 
    creatorId: string, 
    creatorName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfCancelingSupplyOrder = await tx.update(SupplyOrderTable).set({
        status: "CANCEL", 
      }).where(and(
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.creatorId, creatorId), 
        eq(SupplyOrderTable.status, "POSTED"),
      )).returning({
        id: SupplyOrderTable.id, 
        stauts: SupplyOrderTable.status, 
      });
      if (!responseOfCancelingSupplyOrder || responseOfCancelingSupplyOrder.length === 0) {
        throw ClientSupplyOrderNotFoundException;
      }
  
      const responseOfCancelingPassengerInvite = await tx.update(PassengerInviteTable).set({
        status: "CANCEL", 
      }).where(and(
        eq(PassengerInviteTable.orderId, id), 
        eq(PassengerInviteTable.status, "CHECKING"), 
      )).returning({
        id: PassengerInviteTable.id, 
        passengerId: PassengerInviteTable.userId, 
      });
      if (!responseOfCancelingPassengerInvite || responseOfCancelingPassengerInvite.length === 0) {
          throw ClientInviteNotFoundException;
      }
  
      const responseOfCreatingNotification = await this.passengerNotification.createMultiplePassengerNotificationByUserId(
        responseOfCancelingPassengerInvite.map((content) => {
          return NotificationTemplateOfCancelingSupplyOrder(
            creatorName, 
            content.passengerId, 
            responseOfCancelingSupplyOrder[0].id, 
          );
        })
      )
      if (!responseOfCreatingNotification || responseOfCreatingNotification.length === 0) {
        throw ClientCreatePassengerNotificationException;
      }
  
      return responseOfCancelingSupplyOrder;
    });
  }

  async deleteSupplyOrderById(id: string, creatorId: string) {
    return await this.db.delete(SupplyOrderTable)
      .where(and(
        ne(SupplyOrderTable.status, "POSTED"),
        eq(SupplyOrderTable.id, id), 
        eq(SupplyOrderTable.creatorId, creatorId),
      )).returning({
        id: SupplyOrderTable.id,
        status: SupplyOrderTable.status,
      });
  }
  /* ================================= Delete operations ================================= */
}
