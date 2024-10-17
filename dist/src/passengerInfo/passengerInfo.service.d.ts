import { CreatePassengerInfoDto } from './dto/create-passengerInfo.dto';
import { UpdatePassengerInfoDto } from './dto/update-passengerInfo.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
export declare class PassengerInfoService {
    private db;
    constructor(db: DrizzleDB);
    createPassengerInfo(createPassengerInfoDto: CreatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    findAll(): string;
    findOne(id: number): string;
    updatePassengerInfoById(infoId: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    remove(id: number): string;
}
