import { PassengerRecordService } from './passengerRecord.service';
import { StorePassengerRecordDto } from './dto/store-passengerRecord.dto';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
export declare class PassengerRecordController {
    private readonly passengerRecordService;
    constructor(passengerRecordService: PassengerRecordService);
    storeSearchRecordByUserId(passenger: PassengerType, storePassengerRecordDto: StorePassengerRecordDto, response: Response): Promise<void>;
    getSearchRecordsByUserId(passenger: PassengerType, response: Response): Promise<void>;
}
