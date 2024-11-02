import { PassengerService } from './passenger.service';
import { Request, Response } from 'express';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengerController {
    private readonly passengerService;
    constructor(passengerService: PassengerService);
    getMe(request: Request, response: Response): void;
    getPassengerInfo(request: Request, response: Response): Promise<void>;
    getPassengerCollection(request: Request, response: Response): Promise<void>;
    searchPassengersByUserName(userName: string, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    getPaginationPassengers(limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMe(request: Request, updatePassengerDto: UpdatePassengerDto, response: Response): Promise<void>;
    updateMyInfo(request: Request, updatePassengerInfoDto: UpdatePassengerInfoDto, response: Response): Promise<void>;
    deleteMe(request: Request, response: Response): Promise<void>;
    getTest(): void;
    getAllPassengers(response: Response): Promise<void>;
}
