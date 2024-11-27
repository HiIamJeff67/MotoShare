import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { SupabaseStorageService } from '../supabaseStorage/supabaseStorage.service';
import { DeleteRidderDto } from './dto/delete-ridder.dto';
export declare class RidderService {
    private storage;
    private config;
    private db;
    constructor(storage: SupabaseStorageService, config: ConfigService, db: DrizzleDB);
    private getRidderById;
    getRidderWithInfoByUserName(userName: string): Promise<{
        userName: string;
        email: string;
        info: {
            isOnline: boolean;
            age: number | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            updatedAt: Date;
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
            updatedAt: Date;
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
                updatedAt: Date;
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
                status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
                createdAt: Date;
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
    deleteRiddderById(id: string, deleteRidderDto: DeleteRidderDto): Promise<{
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
