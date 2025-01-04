import { RateAndCommentHistoryDto } from './dto/update-history.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
export declare class HistoryService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    _updateAverageStarRatingByPassengerId(userId: string): Promise<null[] | {
        avgStarRating: number;
    }[]>;
    _updateAverageStarRatingByRidderId(userId: string): Promise<null[] | {
        avgStarRating: number;
    }[]>;
    getHistoryById(id: string, userId: string): Promise<{
        id: string;
        passengerName: string | null;
        passengerAvatorUrl: string | null;
        passengerPhoneNumber: string | null;
        ridderName: string | null;
        ridderAvatorUrl: string | null;
        ridderPhoneNumber: string | null;
        finalPrice: number;
        finalStartCord: {
            x: number;
            y: number;
        };
        finalEndCord: {
            x: number;
            y: number;
        };
        finalStartAddress: string;
        finalEndAddress: string;
        startAfter: Date;
        endedAt: Date;
        motocyclePhotoUrl: string | null;
        motocycleLicense: string | null;
        motocycleType: string | null;
        starRatingByPassenger: "0" | "1" | "2" | "3" | "4" | "5";
        starRatingByRidder: "0" | "1" | "2" | "3" | "4" | "5";
        commentByPassenger: string | null;
        commentByRidder: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchPaginationHistoryByPassengerId(passengerId: string, limit: number, offset: number): Promise<{
        id: string;
        finalStartCord: {
            x: number;
            y: number;
        };
        finalEndCord: {
            x: number;
            y: number;
        };
        finalStartAddress: string;
        finalEndAddress: string;
        ridderName: string | null;
        avatorUrl: string | null;
        finalPrice: number;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        ridderPhoneNumber: string | null;
        motocycleType: string | null;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchPaginationHistoryByRidderId(ridderId: string, limit: number, offset: number): Promise<{
        id: string;
        finalStartCord: {
            x: number;
            y: number;
        };
        finalEndCord: {
            x: number;
            y: number;
        };
        finalStartAddress: string;
        finalEndAddress: string;
        avatorUrl: string | null;
        finalPrice: number;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        passengerPhoneNumber: string | null;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    rateAndCommentHistoryForPassengerById(id: string, passengerId: string, passengerName: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        id: string;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    rateAndCommentHistoryForRidderById(id: string, ridderId: string, ridderName: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        id: string;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    delinkHistoryByPassengerId(id: string, passengerId: string): Promise<{
        id: string;
    }[]>;
    delinkHistoryByRidderId(id: string, ridderId: string): Promise<{
        id: string;
    }[]>;
}
