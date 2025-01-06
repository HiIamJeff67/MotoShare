import { PassengerBankService } from './passengerBank.service';
export declare class PassengerBankController {
    private readonly passengerBankService;
    constructor(passengerBankService: PassengerBankService);
    listCostomers(): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Customer>>>;
}
