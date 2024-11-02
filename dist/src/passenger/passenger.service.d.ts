import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengerService {
    private config;
    private db;
    constructor(config: ConfigService, db: DrizzleDB);
    private getPassengerById;
    getPassengerWithInfoByUserId(userId: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            phoneNumber: string | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
        } | null;
    } | undefined>;
    getPassengerWithCollectionByUserId(userId: string): Promise<{
        userName: string;
        collection: {
            userId: string;
            orderId: string;
            order: {
                id: string;
                description: string | null;
                initPrice: number;
                startCord: {
                    x: number;
                    y: number;
                };
                endCord: {
                    x: number;
                    y: number;
                };
                createdAt: Date;
                updatedAt: Date;
                startAfter: Date;
                tolerableRDV: number;
                status: "POSTED" | "EXPIRED" | "CANCEL";
                creator: {
                    userName: string;
                } | null;
            };
        }[];
    } | undefined>;
    searchPassengersByUserName(userName: string, limit: number, offset: number): Promise<{
        userName: string;
        email: string;
        info: {
            selfIntroduction: string | null;
            avatorUrl: string | null;
        } | null;
    }[]>;
    getPaginationPassengers(limit: number, offset: number): Promise<{
        userName: string;
        email: string;
        info: {
            selfIntroduction: string | null;
            avatorUrl: string | null;
        } | null;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        userName: string;
        eamil: string;
    }[]>;
    updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<import("pg").QueryResult<never>>;
    deletePassengerById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getAllPassengers(): Promise<{
        id: string;
        userName: string;
    }[]>;
}
