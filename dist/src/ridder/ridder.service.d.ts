import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class RidderService {
    private config;
    private db;
    private supabase;
    constructor(config: ConfigService, db: DrizzleDB, supabase: SupabaseClient);
    private getRidderById;
    getRidderWithInfoByUserName(userName: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            createdAt: Date;
            motocycleType: string | null;
            motocyclePhotoUrl: string | null;
        } | null;
    } | undefined>;
    getRidderWithInfoByUserId(userId: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            phoneNumber: string | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            createdAt: Date;
            motocycleLicense: string | null;
            motocycleType: string | null;
            motocyclePhotoUrl: string | null;
        } | null;
    } | undefined>;
    getRidderWithCollectionByUserId(userId: string): Promise<{
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
                status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
                isUrgent: boolean;
                creator: {
                    userName: string;
                };
            };
        }[];
    } | undefined>;
    searchPaginationRidders(userName: string | undefined, limit: number, offset: number): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            avatorUrl: string | null;
            motocycleType: string | null;
        } | null;
    }[]>;
    updateRidderById(id: string, updateRidderDto: UpdateRidderDto): Promise<{
        userName: string;
        eamil: string;
    }[]>;
    updateRidderInfoByUserId(userId: string, updateRidderInfoDto: UpdateRidderInfoDto, uploadedFile?: Express.Multer.File | undefined): Promise<import("pg").QueryResult<never>>;
    deleteRiddderById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    testBcryptHashing(secretText: string, hash: string | undefined): Promise<{
        originalData: string;
        hashData: string;
        isMatch: boolean;
    }>;
    getAllRidders(): Promise<{
        id: string;
        userName: string;
    }[]>;
}
