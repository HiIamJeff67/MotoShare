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
    private _getRidderById;
    getRidderWithInfoByUserName(userName: string): Promise<{
        userName: string;
        email: string;
        info: {
            createdAt: Date;
            isOnline: boolean;
            age: number | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            avgStarRating: number;
            updatedAt: Date;
            motocycleType: string | null;
            motocyclePhotoUrl: string | null;
        } | null;
    } | undefined>;
    getRidderWithInfoByPhoneNumber(phoneNumber: string): Promise<{
        createdAt: Date;
        isOnline: boolean;
        age: number | null;
        selfIntroduction: string | null;
        avatorUrl: string | null;
        avgStarRating: number;
        updatedAt: Date;
        motocycleLicense: string | null;
        motocycleType: string | null;
        motocyclePhotoUrl: string | null;
        user: {
            userName: string;
            email: string;
        };
    } | undefined>;
    getRidderWithInfoByUserId(userId: string): Promise<{
        userName: string;
        email: string;
        info: {
            createdAt: Date;
            isOnline: boolean;
            age: number | null;
            phoneNumber: string | null;
            emergencyUserRole: "Passenger" | "Ridder" | "Admin" | "Guest" | null;
            emergencyPhoneNumber: string | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            avgStarRating: number;
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
                createdAt: Date;
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
            avgStarRating: number;
            motocycleType: string | null;
        } | null;
    }[]>;
    updateRidderById(id: string, updateRidderDto: UpdateRidderDto): Promise<{
        userName: string;
        eamil: string;
    }[]>;
    updateRidderInfoByUserId(userId: string, updateRidderInfoDto: UpdateRidderInfoDto, uploadedAvatorFile?: Express.Multer.File | undefined, uploadedMotocyclePhotoFile?: Express.Multer.File | undefined): Promise<{
        isOnline: boolean;
        age: number | null;
        phoneNumber: string | null;
        emergencyUserRole: "Passenger" | "Ridder" | "Admin" | "Guest" | null;
        emergencyPhoneNumber: string | null;
        selfIntroduction: string | null;
        avatorUrl: string | null;
        motocycleLicense: string | null;
        motocycleType: string | null;
        motocyclePhotoUrl: string | null;
    }[]>;
    resetRidderAccessTokenById(id: string): Promise<{
        accessToken: string;
    }[]>;
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
