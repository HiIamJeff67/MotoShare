import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { ClientPassengerNotFoundException } from '../exceptions';
import { and, eq, like } from 'drizzle-orm';
import { RidderPreferences } from '../drizzle/schema/ridderPreferences.schema';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';

@Injectable()
export class RidderPreferencesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createRidderPreferenceByPreferenceUserName(
    userId: string, 
    preferenceUserName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const preferenceUser = await tx.select({
        id: PassengerTable.id, 
      }).from(PassengerTable)
        .where(eq(PassengerTable.userName, preferenceUserName));
      if (!preferenceUser || preferenceUser.length === 0) {
        throw ClientPassengerNotFoundException;
      }
  
      const responseOfCreatingRiddePreference = await tx.insert(RidderPreferences).values({
        userId: userId, 
        preferenceUserId: preferenceUser[0].id, 
      }).returning();

      return responseOfCreatingRiddePreference && responseOfCreatingRiddePreference.length !== 0 ? [{}] : undefined;
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Search operations ================================= */
  async searchPaginationRidderPreferences(
    userId: string, 
    preferenceUserName: string | undefined = undefined, 
    limit: number, 
    offset: number, 
  ) {
    return await this.db.select({
      preferenceUserName: PassengerTable.userName, 
      preferenceUserAvatorUrl: PassengerInfoTable.avatorUrl, 
      isPreferenceUserOnline: PassengerInfoTable.isOnline, 
    }).from(RidderPreferences)
    .leftJoin(PassengerTable, eq(RidderPreferences.preferenceUserId, PassengerTable.id))
    .where(and(
      eq(RidderPreferences.userId, userId), 
      like(PassengerTable.userName, preferenceUserName + "%"), 
    )).leftJoin(PassengerInfoTable, eq(PassengerTable.id, PassengerInfoTable.userId))
      .limit(limit)
      .offset(offset);
  }
  /* ================================= Search operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRidderPreferenceByUserIdAndPreferenceUserId(
    userId: string, 
    preferenceUserName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const preferenceUser = await tx.select({
        id: PassengerTable.id, 
      }).from(PassengerTable)
        .where(eq(PassengerTable.userName, preferenceUserName));
      if (!preferenceUser || preferenceUser.length === 0) {
        throw ClientPassengerNotFoundException;
      }

      const responseOfDeletingRidderPreference = await tx.delete(RidderPreferences)
        .where(and(
          eq(RidderPreferences.userId, userId), 
          eq(RidderPreferences.preferenceUserId, preferenceUser[0].id)
        )).returning();

      return responseOfDeletingRidderPreference && responseOfDeletingRidderPreference.length !== 0 ? [{}] : undefined;
    });
  }
  /* ================================= Delete operations ================================= */
}
