import { PassengerService } from './passenger.service';
import { Response } from 'express';
import { PassengerType } from '../../src/interfaces/auth.interface';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengerController {
    private readonly passengerService;
    constructor(passengerService: PassengerService);
    getMe(passenger: PassengerType, response: Response): void;
    getPassengerWithInfoByUserName(passenger: PassengerType, userName: string, response: Response): Promise<void>;
    getMyInfo(passenger: PassengerType, response: Response): Promise<void>;
    getMyCollection(passenger: PassengerType, response: Response): Promise<void>;
    searchPaginationPassengers(userName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMe(passenger: PassengerType, updatePassengerDto: UpdatePassengerDto, response: Response): Promise<void>;
    updateMyInfo(passenger: PassengerType, updatePassengerInfoDto: UpdatePassengerInfoDto, response: Response): Promise<void>;
    deleteMe(passenger: PassengerType, response: Response): Promise<void>;
    getTest(response: Response): void;
    getAllPassengers(response: Response): Promise<void>;
}
