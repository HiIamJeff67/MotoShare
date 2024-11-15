import { Inject, Injectable } from '@nestjs/common';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { and, desc, eq, or } from 'drizzle-orm';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { OrderTable } from '../drizzle/schema/order.schema';

@Injectable()
export class HistoryService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Get operations ================================= */
  async getHistoryById(id: string, userId: string) {
    return await this.db.select({
      id: HistoryTable.id,
      passengerName: PassengerTable.userName,
      passengerAvatorUrl: PassengerInfoTable.avatorUrl, 
      passengerPhoneNumber: PassengerInfoTable.phoneNumber,
      ridderName: RidderTable.userName,
      ridderAvatorUrl: RidderInfoTable.avatorUrl, 
      ridderPhoneNumber: RidderInfoTable.phoneNumber, 
      finalPrice: HistoryTable.finalPrice, 
      passengerStartCord: HistoryTable.passengerStartCord, 
      passengerEndCord: HistoryTable.passengerEndCord, 
      ridderStartCord: HistoryTable.ridderStartCord, 
      passengerStartAddress: HistoryTable.passengerStartAddress, 
      passengerEndAddress: HistoryTable.passengerEndAddress, 
      ridderStartAddress: HistoryTable.ridderStartAddress, 
      startAfter: HistoryTable.startAfter, 
      endedAt: HistoryTable.endedAt, 
      createdAt: HistoryTable.createdAt, 
      motocyclePhotoUrl: RidderInfoTable.motocyclePhotoUrl,
      motocycleLicense: RidderInfoTable.motocycleLicense,
      motocycleType: RidderInfoTable.motocycleType,
    }).from(HistoryTable)
      .leftJoin(PassengerTable, eq(PassengerTable.id, HistoryTable.passengerId))
      .leftJoin(RidderTable, eq(RidderTable.id, HistoryTable.ridderId))
      .where(and(
        eq(HistoryTable.id, id),
        or(
          eq(PassengerTable.id, userId),
          eq(RidderTable.id, userId),
        )
      ))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id));
  }

  /* ================= Search operations ================= */
  async searchPaginationHistoryByPassengerId(
    passengerId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: HistoryTable.id, 
      ridderStartAddress: HistoryTable.ridderStartAddress,
      ridderName: RidderTable.userName,
      ridderAvatorUrl: RidderInfoTable.avatorUrl, 
      finalPrice: HistoryTable.finalPrice, 
      startAfter: HistoryTable.startAfter, 
      createdAt: HistoryTable.createdAt,
      ridderPhoneNumber: RidderInfoTable.phoneNumber,
      motocycleType: RidderInfoTable.motocycleType,
      status: HistoryTable.status,
    }).from(HistoryTable)
      .where(eq(HistoryTable.passengerId, passengerId))
      .leftJoin(RidderTable, eq(RidderTable.id, HistoryTable.ridderId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, RidderTable.id))
      .orderBy(desc(HistoryTable.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  async searchPaginationHistoryByRidderId(
    ridderId: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.select({
      id: HistoryTable.id,
      passengerStartAddress: HistoryTable.passengerStartAddress, 
      passengerEndAddress: HistoryTable.passengerEndAddress, 
      passengerAvatorUrl: PassengerInfoTable.avatorUrl, 
      finalPrice: HistoryTable.finalPrice, 
      startAfter: HistoryTable.startAfter, 
      createdAt: HistoryTable.createdAt,
      passengerPhoneNumber: PassengerInfoTable.phoneNumber,
      status: HistoryTable.status,
    }).from(HistoryTable)
    .where(eq(HistoryTable.ridderId, ridderId))
    .leftJoin(PassengerTable, eq(PassengerTable.id, HistoryTable.ridderId))
    .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, PassengerTable.id))
    .orderBy(desc(HistoryTable.updatedAt))
    .limit(limit)
    .offset(offset);
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async rateAndCommentHistoryForPassengerById(
    id: string, 
    passengerId: string, 
    updateHistoryDto: UpdateHistoryDto, 
  ) {
    return await this.db.update(HistoryTable).set({
      starRatingByPassenger: updateHistoryDto.starRating,
      commentByPassenger: updateHistoryDto.comment,
    }).where(and(
      eq(HistoryTable.id, id),
      eq(HistoryTable.passengerId, passengerId),
    )).returning({
      status: HistoryTable.status,
    });
  }

  async rateAndCommentHistoryForRidderById(
    id: string, 
    ridderId: string, 
    updateHistoryDto: UpdateHistoryDto,
  ) {
    return await this.db.update(HistoryTable).set({
      starRatingByPassenger: updateHistoryDto.starRating,
      commentByPassenger: updateHistoryDto.comment,
    }).where(and(
      eq(HistoryTable.id, id),
      eq(HistoryTable.ridderId, ridderId),
    )).returning({
      status: HistoryTable.status,
    });
  }
  /* ================================= Update operations ================================= */
}
