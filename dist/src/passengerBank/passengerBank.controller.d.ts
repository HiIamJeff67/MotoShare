import { PassengerBankService } from './passengerBank.service';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
export declare class PassengerBankController {
    private readonly passengerBankService;
    constructor(passengerBankService: PassengerBankService);
    listCostomers(): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Customer>>>;
    getCustomerId(passenger: PassengerType, response: Response): Promise<void>;
}
