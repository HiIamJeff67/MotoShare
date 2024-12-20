import { StorePassengerRecordDto } from './dto/store-passengerRecord.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerRecordService {
    private db;
    constructor(db: DrizzleDB);
    storeSearchRecordByUserId(id: string, storePassengerRecordDto: StorePassengerRecordDto): Promise<{
        searchRecords: unknown[];
    }[]>;
    getSearchRecordsByUserId(id: string): Promise<{
        searchRecords: unknown[];
    }[]>;
}
