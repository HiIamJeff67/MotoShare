import { Inject, Injectable } from '@nestjs/common';
import { RateAndCommentHistoryDto } from './dto/update-history.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { HistoryTable } from '../drizzle/schema/history.schema';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { and, desc, eq, isNull, ne, or } from 'drizzle-orm';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { ClientHistoryNotFoundException } from '../exceptions';

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
      updatedAt: HistoryTable.updatedAt,
      motocyclePhotoUrl: RidderInfoTable.motocyclePhotoUrl, 
      motocycleLicense: RidderInfoTable.motocycleLicense, 
      motocycleType: RidderInfoTable.motocycleType, 
    }).from(HistoryTable)
      .where(and(
        eq(HistoryTable.id, id),
        or(
          eq(HistoryTable.passengerId, userId),
          eq(HistoryTable.ridderId, userId),
        )
      ))
      .leftJoin(PassengerTable, eq(PassengerTable.id, HistoryTable.passengerId))
      .leftJoin(RidderTable, eq(RidderTable.id, HistoryTable.ridderId))
      .leftJoin(PassengerInfoTable, eq(PassengerInfoTable.userId, HistoryTable.passengerId))
      .leftJoin(RidderInfoTable, eq(RidderInfoTable.userId, HistoryTable.ridderId));
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
      endedAt: HistoryTable.endedAt,
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
      endedAt: HistoryTable.endedAt, 
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
    rateAndCommentHistoryDto: RateAndCommentHistoryDto, 
  ) {
    return await this.db.update(HistoryTable).set({
      starRatingByPassenger: rateAndCommentHistoryDto.starRating,
      commentByPassenger: rateAndCommentHistoryDto.comment,
      updatedAt: new Date(),
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
    rateAndCommentHistoryDto: RateAndCommentHistoryDto,
  ) {
    return await this.db.update(HistoryTable).set({
      starRatingByRidder: rateAndCommentHistoryDto.starRating,
      commentByRidder: rateAndCommentHistoryDto.comment,
      updatedAt: new Date(),
    }).where(and(
      eq(HistoryTable.id, id),
      eq(HistoryTable.ridderId, ridderId),
    )).returning({
      status: HistoryTable.status,
    });
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  // since we make the history to contain both the id of passengers and ridders,
  // if the passenger want to delete, we can't just delete the history itself,
  // of the ridder will see the history dispear..., so we cover this functionality with
  // delinking the passengerId or ridderId which I set to allow null value.
  // however, for space complexity, we still need to delete the history
  // once it doesn't contain the passengerId and ridderId anymore
  async delinkHistoryByPassengerId(
    id: string,
    passengerId: string,
  ) {
    const responseOfUpdatingHistory = await this.db.update(HistoryTable).set({
      passengerId: null,
    }).where(and(
      eq(HistoryTable.id, id),
      eq(HistoryTable.passengerId, passengerId),
      ne(HistoryTable.starRatingByPassenger, "0"),
    ))
      .returning({
      passengerId: HistoryTable.passengerId,
      ridderId: HistoryTable.ridderId,
    });
    if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
      throw ClientHistoryNotFoundException;
    }

    if (  // responseOfUpdatingHistory[0].passengerId === null &&
      responseOfUpdatingHistory[0].ridderId === null) {
        const responseOfDeletingHistory = await this.db.delete(HistoryTable)
          .where(and(
            eq(HistoryTable.id, id),
            isNull(HistoryTable.passengerId), // double check if it is null value
            isNull(HistoryTable.ridderId),    // double check if it is null value
          ))
          .returning({
            id: HistoryTable.id,
          });
        if (!responseOfDeletingHistory || responseOfDeletingHistory.length === 0) {
          throw ClientHistoryNotFoundException;
        }
    }

    return [{
      id: id,
    }];
  }

  async delinkHistoryByRidderId(
    id: string,
    ridderId: string,
  ) {
    const responseOfUpdatingHistory = await this.db.update(HistoryTable).set({
      ridderId: null,
    }).where(and(
      eq(HistoryTable.id, id),
      eq(HistoryTable.ridderId, ridderId),
      ne(HistoryTable.starRatingByRidder, "0"),
    ))
      .returning({
      passengerId: HistoryTable.passengerId,
      ridderId: HistoryTable.ridderId,
    });
    if (!responseOfUpdatingHistory || responseOfUpdatingHistory.length === 0) {
      throw ClientHistoryNotFoundException;
    }

    if (responseOfUpdatingHistory[0].passengerId === null
      // && responseOfUpdatingHistory[0].ridderId === null
    ) {
        const responseOfDeletingHistory = await this.db.delete(HistoryTable)
          .where(and(
            eq(HistoryTable.id, id),
            isNull(HistoryTable.passengerId), // double check if it is null value
            isNull(HistoryTable.ridderId),    // double check if it is null value
          ))
          .returning({
            id: HistoryTable.id,
          });
        if (!responseOfDeletingHistory || responseOfDeletingHistory.length === 0) {
          throw ClientHistoryNotFoundException;
        }
    }

    return [{
      id: id,
    }];
  }
  /* ================================= Delete operations ================================= */
}
