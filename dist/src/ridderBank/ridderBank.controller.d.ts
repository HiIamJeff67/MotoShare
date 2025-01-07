import { RidderBankService } from './ridderBank.service';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { CreatePaymentIntentDto } from './dto/create-ridderBank.dto';
export declare class RidderBankController {
    private readonly ridderBankService;
    constructor(ridderBankService: RidderBankService);
    getMyBalance(ridder: RidderType, response: Response): Promise<void>;
    createPaymentIntentForAddingBalanceByUserId(ridder: RidderType, createPaymentIntentDto: CreatePaymentIntentDto, response: Response): Promise<void>;
    payToFinishOrderById(ridder: RidderType, createPaymentIntentDto: CreatePaymentIntentDto, response: Response): Promise<void>;
}
