import { RidderRecordService } from './ridderRecord.service';
import { StoreRidderRecordDto } from './dto/store-ridderRecord.dto';
import { RidderType } from '../interfaces';
import { Response } from 'express';
export declare class RidderRecordController {
    private readonly ridderRecordService;
    constructor(ridderRecordService: RidderRecordService);
    storeSearchRecordByUserId(ridder: RidderType, storeRidderRecordDto: StoreRidderRecordDto, response: Response): Promise<void>;
    getSearchRecordsByUserId(ridder: RidderType, response: Response): Promise<void>;
}
