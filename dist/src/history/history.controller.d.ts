import { HistoryService } from './history.service';
import { RateAndCommentHistoryDto } from './dto/update-history.dto';
import { PassengerType, RidderType } from '../interfaces';
import { Response } from 'express';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistoryForPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    getHistoryForRidderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchPaginationHistoriesByPassengerId(passenger: PassengerType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchPaginationHistoriesByRidderId(ridder: RidderType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    rateAndCommentHistoryForPassengerById(passenger: PassengerType, id: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto, response: Response): Promise<void>;
    rateAndCommentHistoryForRidderById(ridder: RidderType, id: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto, response: Response): Promise<void>;
    delinkHistoryForPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    delinkHistoryForRidderById(ridder: RidderType, id: string, response: Response): Promise<void>;
}
