import { OrderService } from './order.service';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { Response } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getOrderForPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    getOrderForRidderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchPaginationOrderForPassengerById(passenger: PassengerType, ridderName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchPaginationOrderForridderById(ridder: RidderType, passengerName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    toStartedPassengerStatusById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    toUnpaidPassengerStatusById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    toFinishedPassengerStatusById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    toStartedRidderStatusById(ridder: RidderType, id: string, response: Response): Promise<void>;
    toUnpaidRidderStatusById(ridder: RidderType, id: string, response: Response): Promise<void>;
    toFinishedRidderStatusById(ridder: RidderType, id: string, response: Response): Promise<void>;
    cancelAndDeleteOrderForPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
}
