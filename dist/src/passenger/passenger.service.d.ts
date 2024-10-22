import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { SignInPassengerDto } from './dto/signIn-passenger.dto';
export declare class PassengerService {
    private db;
    constructor(db: DrizzleDB);
    createPassenger(createPassengerDto: CreatePassengerDto): Promise<{
        id: string;
    }[]>;
    createPassengerInfoByUserId(userId: string): Promise<{
        id: string;
        userId: string;
    }[]>;
    createPassengerCollectionByUserId(userId: string): Promise<{
        id: string;
        userId: string;
    }[]>;
    signInPassengerByEamilAndPassword(signInPassengerDto: SignInPassengerDto): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getPassengerById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getPassengerWithInfoByUserId(userId: string): Promise<{
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
        } | null;
    } | undefined>;
    getPassengerWithCollectionByUserId(userId: string): Promise<{
        password: string;
        id: string;
        userName: string;
        email: string;
        collection: {
            id: string;
            userId: string;
        } | null;
    } | undefined>;
    getAllPassengers(): Promise<{
        id: string;
        userName: string;
    }[]>;
    getPaginationPassengers(limit: number, offset: number): Promise<{
        id: string;
        userName: string;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        id: string;
    }[]>;
    updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
    }[]>;
    deletePassengerById(id: string): Promise<import("pg").QueryResult<never>>;
}
