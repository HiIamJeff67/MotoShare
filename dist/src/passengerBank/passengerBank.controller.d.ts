import { PassengerBankService } from './passengerBank.service';
import { CreatePaymentIntentDto } from './dto/create-passengerBank.dto';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
export declare class PassengerBankController {
    private readonly passengerBankService;
    constructor(passengerBankService: PassengerBankService);
    getMyBalance(passenger: PassengerType, response: Response): Promise<void>;
    createPaymentIntentForAddingBalanceByUserId(passenger: PassengerType, createPaymentIntentDto: CreatePaymentIntentDto, response: Response): Promise<void>;
    payToFinishOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
}
