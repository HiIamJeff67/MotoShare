import { RateAndCommentHistoryDto } from './dto/update-history.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class HistoryService {
    private db;
    constructor(db: DrizzleDB);
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
        status: "EXPIRED" | "CANCEL" | "FINISHED";
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
        status: "EXPIRED" | "CANCEL" | "FINISHED";
    }[]>;
    rateAndCommentHistoryForPassengerById(id: string, passengerId: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        status: "EXPIRED" | "CANCEL" | "FINISHED";
    }[]>;
    rateAndCommentHistoryForRidderById(id: string, ridderId: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        status: "EXPIRED" | "CANCEL" | "FINISHED";
    }[]>;
    delinkHistoryByPassengerId(id: string, passengerId: string): Promise<{
        id: string;
    }[]>;
    delinkHistoryByRidderId(id: string, ridderId: string): Promise<{
        id: string;
    }[]>;
}
