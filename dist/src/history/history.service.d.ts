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
        passengerStartCord: {
            x: number;
            y: number;
        };
        passengerEndCord: {
            x: number;
            y: number;
        };
        ridderStartCord: {
            x: number;
            y: number;
        };
        passengerStartAddress: string;
        passengerEndAddress: string;
        ridderStartAddress: string;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        motocyclePhotoUrl: string | null;
        motocycleLicense: string | null;
        motocycleType: string | null;
    }[]>;
    searchPaginationHistoryByPassengerId(passengerId: string, limit: number, offset: number): Promise<{
        id: string;
        ridderStartAddress: string;
        ridderName: string | null;
        ridderAvatorUrl: string | null;
        finalPrice: number;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        ridderPhoneNumber: string | null;
        motocycleType: string | null;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchPaginationHistoryByRidderId(ridderId: string, limit: number, offset: number): Promise<{
        id: string;
        passengerStartAddress: string;
        passengerEndAddress: string;
        passengerAvatorUrl: string | null;
        finalPrice: number;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        passengerPhoneNumber: string | null;
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    rateAndCommentHistoryForPassengerById(id: string, passengerId: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    rateAndCommentHistoryForRidderById(id: string, ridderId: string, rateAndCommentHistoryDto: RateAndCommentHistoryDto): Promise<{
        status: "FINISHED" | "EXPIRED" | "CANCEL";
    }[]>;
    delinkHistoryByPassengerId(id: string, passengerId: string): Promise<{
        id: string;
    }[]>;
    delinkHistoryByRidderId(id: string, ridderId: string): Promise<{
        id: string;
    }[]>;
}
