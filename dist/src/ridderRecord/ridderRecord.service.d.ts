import { DrizzleDB } from '../drizzle/types/drizzle';
import { StoreRidderRecordDto } from './dto/store-ridderRecord.dto';
export declare class RidderRecordService {
    private db;
    constructor(db: DrizzleDB);
    storeSearchRecordByUserId(id: string, storeRidderRecordDto: StoreRidderRecordDto): Promise<{
        searchRecords: unknown[];
    }[]>;
    getSearchRecordsByUserId(id: string): Promise<{
        searchRecords: unknown[];
    }[]>;
}
