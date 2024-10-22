import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { SignInPassengerDto } from './dto/signIn-passenger.dto';
export declare class PassengerController {
    private readonly passengerService;
    constructor(passengerService: PassengerService);
    createPassengerWithInfoAndCollection(createPassengerDto: CreatePassengerDto): Promise<{
        passengerId: string;
        infoId: string;
        collectionId: string;
    }>;
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
    getPassengerWithInfoByUserId(id: string): Promise<{
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
    getPassengerWithCollectionByUserId(id: string): Promise<{
        password: string;
        id: string;
        userName: string;
        email: string;
        collection: {
            id: string;
            userId: string;
        } | null;
    } | undefined>;
    getPaginationPassengers(limit: string, offset: string): Promise<{
        id: string;
        userName: string;
    }[]>;
    getAllPassengers(): Promise<{
        id: string;
        userName: string;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        id: string;
    }[]>;
    updatePassengerInfoByUserId(id: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
    }[]>;
    deletePassengerById(id: string): Promise<import("pg").QueryResult<never>>;
    getTest(): string;
}
