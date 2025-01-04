import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { SupabaseStorageService } from '../supabaseStorage/supabaseStorage.service';
import { DeletePassengerDto } from './dto/delete-passenger.dto';
export declare class PassengerService {
    private config;
    private storage;
    private db;
    constructor(config: ConfigService, storage: SupabaseStorageService, db: DrizzleDB);
    private _getPassengerById;
    getPassengerWithInfoByUserName(userName: string): Promise<{
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
        } | null;
    } | undefined>;
    getPassengerWithInfoByPhoneNumber(phoneNumber: string): Promise<{
        createdAt: Date;
        isOnline: boolean;
        age: number | null;
        selfIntroduction: string | null;
        avatorUrl: string | null;
        avgStarRating: number;
        updatedAt: Date;
        user: {
            userName: string;
            email: string;
        };
    } | undefined>;
    getPassengerWithInfoByUserId(userId: string): Promise<{
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
                tolerableRDV: number;
                status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
            avgStarRating: number;
        } | null;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        userName: string;
        eamil: string;
    }[]>;
    updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto, uploadedAvatorFile?: Express.Multer.File | undefined): Promise<{
        isOnline: boolean;
        age: number | null;
        phoneNumber: string | null;
        emergencyUserRole: "Passenger" | "Ridder" | "Admin" | "Guest" | null;
        emergencyPhoneNumber: string | null;
        selfIntroduction: string | null;
        avatorUrl: string | null;
    }[]>;
    resetPassengerAccessTokenById(id: string): Promise<{
        accessToken: string;
    }[]>;
    deletePassengerById(id: string, deletePassengerDto: DeletePassengerDto): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getAllPassengers(): Promise<{
        id: string;
        userName: string;
    }[]>;
}
