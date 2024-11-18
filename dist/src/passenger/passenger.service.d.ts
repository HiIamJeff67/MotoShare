import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { SupabaseStorageService } from '../supabaseStorage/supabaseStorage.service';
export declare class PassengerService {
    private config;
    private storage;
    private db;
    constructor(config: ConfigService, storage: SupabaseStorageService, db: DrizzleDB);
    private getPassengerById;
    getPassengerWithInfoByUserName(userName: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            createdAt: Date;
        } | null;
    } | undefined>;
    getPassengerWithInfoByUserId(userId: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            phoneNumber: string | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            createdAt: Date;
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
                createdAt: Date;
                initPrice: number;
                startCord: {
                    x: number;
                    y: number;
                };
                endCord: {
                    x: number;
                    y: number;
                };
                startAfter: Date;
                updatedAt: Date;
                tolerableRDV: number;
                status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
                creator: {
                    userName: string;
                };
            };
        }[];
    } | undefined>;
    searchPaginationPassengers(userName: string | undefined, limit: number, offset: number): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            avatorUrl: string | null;
        } | null;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        userName: string;
        eamil: string;
    }[]>;
    updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto, uploadedFile?: Express.Multer.File | undefined): Promise<import("pg").QueryResult<never>>;
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
