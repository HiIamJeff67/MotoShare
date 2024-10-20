import { RidderService } from './ridder.service';
import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdatePassengerInfoDto } from 'src/passenger/dto/update-info.dto';
export declare class RidderController {
    private readonly ridderService;
    constructor(ridderService: RidderService);
    createRidderWithInfoAndCollection(createRidderDto: CreateRidderDto): Promise<{
        ridderId: string;
        infoId: string;
        collectionId: string;
    }>;
    getRidderById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getRidderWithInfoByUserId(id: string): Promise<{
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
    getRidderWithCollectionByUserId(id: string): Promise<{
        password: string;
        id: string;
        userName: string;
        email: string;
        collection: {
            id: string;
            userId: string;
        } | null;
    } | undefined>;
    getPaginationRidders(limit: string, offset: string): Promise<{
        id: string;
        userName: string;
    }[]>;
    getAllRidders(): Promise<{
        id: string;
        userName: string;
    }[]>;
    updateRidderById(id: string, updateRidderDto: UpdateRidderDto): Promise<{
        id: string;
    }[]>;
    updateRidderInfoByUserId(id: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
    }[]>;
    deleteRidderById(id: string): Promise<import("pg").QueryResult<never>>;
}
