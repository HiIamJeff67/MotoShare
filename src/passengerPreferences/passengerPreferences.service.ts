import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerPreferences } from '../drizzle/schema/passengerPreferences.schema';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { and, desc, eq, like, or } from 'drizzle-orm';
import { ClientRidderNotFoundException } from '../exceptions';
import { RidderPreferences } from '../drizzle/schema/ridderPreferences.schema';

@Injectable()
export class PassengerPreferencesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createPassengerPreferenceByPreferenceUserName(
    userId: string, 
    preferenceUserName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const preferenceUser = await tx.select({
        id: RidderTable.id, 
      }).from(RidderTable)
        .where(eq(RidderTable.userName, preferenceUserName));
      if (!preferenceUser || preferenceUser.length === 0) {
        throw ClientRidderNotFoundException;
      }
  
      const responseOfCreatingPassengerPreference = await tx.insert(PassengerPreferences).values({
        userId: userId, 
        preferenceUserId: preferenceUser[0].id, 
      }).returning();

      return responseOfCreatingPassengerPreference && responseOfCreatingPassengerPreference.length !== 0 ? [{}] : undefined;
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Search operations ================================= */
  async searchPaginationPassengerPreferences(
    userId: string, 
    preferenceUserName: string | undefined = undefined, 
    limit: number, 
    offset: number, 
  ) {
    return await this.db.select({
      preferenceUserName: RidderTable.userName, 
      preferenceUserAvatorUrl: RidderInfoTable.avatorUrl, 
      preferenceUserSelfIntroduction: RidderInfoTable.selfIntroduction, 
      isPreferenceUserOnline: RidderInfoTable.isOnline, 
    }).from(PassengerPreferences)
    .leftJoin(RidderTable, eq(PassengerPreferences.preferenceUserId, RidderTable.id))
    .where(and(
      eq(PassengerPreferences.userId, userId), 
      or(
        like(RidderTable.userName, preferenceUserName + "%"), 
        like(RidderTable.email, preferenceUserName + "%"), 
      ), 
    )).leftJoin(RidderInfoTable, eq(RidderTable.id, RidderInfoTable.userId))
      .limit(limit)
      .offset(offset);
  }
  /* ================================= Search operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerPreferenceByUserIdAndPreferenceUserId(
    userId: string, 
    preferenceUserName: string, 
  ) {
    return await this.db.transaction(async (tx) => {
      const ridder = await tx.select({
        id: RidderTable.id, 
      }).from(RidderTable)
        .where(eq(RidderTable.userName, preferenceUserName));
      if (!ridder || ridder.length === 0) {
        throw ClientRidderNotFoundException;
      }

      const responseOfDeletingPassengerPreferences = await tx.delete(PassengerPreferences)
        .where(and(
          eq(PassengerPreferences.userId, userId), 
          eq(PassengerPreferences.preferenceUserId, ridder[0].id)
        )).returning();

      return responseOfDeletingPassengerPreferences && responseOfDeletingPassengerPreferences.length !== 0 ? [{}] : undefined;
    });
  }
  /* ================================= Delete operations ================================= */
}
