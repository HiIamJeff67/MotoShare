import { Inject, Injectable } from '@nestjs/common';
import { StorePassengerRecordDto } from './dto/store-passengerRecord.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerRecordTable } from '../drizzle/schema/passengerRecord.schema';
import { eq, sql } from 'drizzle-orm';
import { ClientMaintainSearchRecordsException, ClientPassengerRecordNotFoundException } from '../exceptions';
import { SEARCH_RECORD_MAX_LENGTH } from '../constants';

@Injectable()
export class PassengerRecordService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Set operations (Setter) ================================= */
  async storeSearchRecordByUserId(
    id: string, 
    storePassengerRecordDto: StorePassengerRecordDto, 
  ) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingPassengerRecord = await tx.select({
        searchRecords: PassengerRecordTable.searchRecords, 
      }).from(PassengerRecordTable)
        .where(eq(PassengerRecordTable.userId, id))
        .limit(1);
      if (!responseOfSelectingPassengerRecord || responseOfSelectingPassengerRecord.length === 0) {
        throw ClientPassengerRecordNotFoundException;
      }
      
      if (responseOfSelectingPassengerRecord[0].searchRecords 
        && responseOfSelectingPassengerRecord[0].searchRecords.length >= SEARCH_RECORD_MAX_LENGTH) {
          // manitain the size of searchRecords field
          const trimLength = SEARCH_RECORD_MAX_LENGTH - responseOfSelectingPassengerRecord[0].searchRecords.length + 1; // leave one for new comming data
          const responseOfMaintainSizeOfSearchRecords = await tx.update(PassengerRecordTable).set({
            searchRecords: sql`${PassengerRecordTable.searchRecords}[1:GREATEST(array_length(${PassengerRecordTable.searchRecords}, 1) - ${trimLength}, 0)]`,
          }).where(eq(PassengerRecordTable.userId, id))
            .returning({
              searchRecords: PassengerRecordTable.searchRecords, 
            });
          if (!responseOfMaintainSizeOfSearchRecords || responseOfMaintainSizeOfSearchRecords.length === 0) {
            throw ClientMaintainSearchRecordsException;
          }
      }

      return await tx.update(PassengerRecordTable).set({
        searchRecords: sql`array_prepend(
          ${JSON.stringify(storePassengerRecordDto.searchRecord)}::jsonb, 
          ${PassengerRecordTable.searchRecords}
        )`, 
      }).where(eq(PassengerRecordTable.userId, id))
        .returning({
          searchRecords: PassengerRecordTable.searchRecords, 
        });
    });
  }
  /* ================================= Set operations (Setter) ================================= */

  
  /* ================================= Get operations (Getter) ================================= */
  async getSearchRecordsByUserId(
    id: string, 
  ) {
    return await this.db.select({
      searchRecords: PassengerRecordTable.searchRecords, 
    }).from(PassengerRecordTable)
      .where(eq(PassengerRecordTable.userId, id))
      .limit(1);  // default sorted, since we prepend records into the searchRecords field
  }
  /* ================================= Get operations (Getter) ================================= */
}
