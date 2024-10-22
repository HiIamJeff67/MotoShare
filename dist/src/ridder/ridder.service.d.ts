import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { SignInRidderDto } from './dto/signIn-ridder.dto';
export declare class RidderService {
    private db;
    constructor(db: DrizzleDB);
    createRidder(createRidderDto: CreateRidderDto): Promise<{
        id: string;
    }[]>;
    createRidderInfoByUserId(userId: string): Promise<{
        id: string;
        userId: string;
    }[]>;
    createRidderCollectionByUserId(userId: string): Promise<{
        id: string;
        userId: string;
    }[]>;
    signInRidderByEamilAndPassword(signInRidderDto: SignInRidderDto): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getRidderById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getRidderWithInfoByUserId(userId: string): Promise<{
        password: string;
        id: string;
        userName: string;
        email: string;
        info: {
            id: string;
            userId: string;
            isOnline: boolean;
            age: number | null;
            phoneNumber: string | null;
            selfIntroduction: string | null;
            avatorUrl: string | null;
            motocycleLicense: string | null;
            motocyclePhotoUrl: string | null;
        } | null;
    } | undefined>;
    getRidderWithCollectionByUserId(userId: string): Promise<{
        password: string;
        id: string;
        userName: string;
        email: string;
        collection: {
            id: string;
            userId: string;
        } | null;
    } | undefined>;
    getAllRidders(): Promise<{
        id: string;
        userName: string;
    }[]>;
    getPaginationRidders(limit: number, offset: number): Promise<{
        id: string;
        userName: string;
    }[]>;
    updateRidderById(id: string, updateRidderDto: UpdateRidderDto): Promise<{
        id: string;
    }[]>;
    updateRidderInfoByUserId(userId: string, updateRidderInfoDto: UpdateRidderInfoDto): Promise<{
        id: string;
    }[]>;
    deleteRiddderById(id: string): Promise<import("pg").QueryResult<never>>;
}
