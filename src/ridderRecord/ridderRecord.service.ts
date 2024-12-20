import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { RidderRecordTable } from '../drizzle/schema/schema';
import { eq, sql } from 'drizzle-orm';
import { ClientMaintainSearchRecordsException, ClientRidderRecordNotFoundException } from '../exceptions';
import { SEARCH_RECORD_MAX_LENGTH } from '../constants';
import { StoreRidderRecordDto } from './dto/store-ridderRecord.dto';

@Injectable()
export class RidderRecordService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Set operations (Setter) ================================= */
  async storeSearchRecordByUserId(
    id: string, 
    storeRidderRecordDto: StoreRidderRecordDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingRidderRecord = await tx.select({
        searchRecords: RidderRecordTable.searchRecords, 
      }).from(RidderRecordTable)
        .where(eq(RidderRecordTable.userId, id))
        .limit(1);
      if (!responseOfSelectingRidderRecord || responseOfSelectingRidderRecord.length === 0) {
        throw ClientRidderRecordNotFoundException;
      }
      
      if (responseOfSelectingRidderRecord[0].searchRecords 
        && responseOfSelectingRidderRecord[0].searchRecords.length >= SEARCH_RECORD_MAX_LENGTH) {
          // manitain the size of searchRecords field
          const trimLength = SEARCH_RECORD_MAX_LENGTH - responseOfSelectingRidderRecord[0].searchRecords.length + 1; // leave one for new comming data
          const responseOfMaintainSizeOfSearchRecords = await tx.update(RidderRecordTable).set({
            searchRecords: sql`${RidderRecordTable.searchRecords}[1:GREATEST(array_length(${RidderRecordTable.searchRecords}, 1) - ${trimLength}, 0)]`,
          }).where(eq(RidderRecordTable.userId, id))
            .returning({
              searchRecords: RidderRecordTable.searchRecords, 
            });
          if (!responseOfMaintainSizeOfSearchRecords || responseOfMaintainSizeOfSearchRecords.length === 0) {
            throw ClientMaintainSearchRecordsException;
          }
      }

      return await tx.update(RidderRecordTable).set({
        searchRecords: sql`array_prepend(
          ${JSON.stringify(storeRidderRecordDto.searchRecord)}::jsonb, 
          ${RidderRecordTable.searchRecords}
        )`, 
      }).where(eq(RidderRecordTable.userId, id))
        .returning({
          searchRecords: RidderRecordTable.searchRecords, 
        });
    });
  }
  /* ================================= Set operations (Setter) ================================= */

  
  /* ================================= Get operations (Getter) ================================= */
  async getSearchRecordsByUserId(
    id: string, 
  ) {
    return await this.db.select({
      searchRecords: RidderRecordTable.searchRecords, 
    }).from(RidderRecordTable)
      .where(eq(RidderRecordTable.userId, id))
      .limit(1);  // default sorted, since we prepend records into the searchRecords field
  }
  /* ================================= Get operations (Getter) ================================= */
}
