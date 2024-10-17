import { PassengerInfoService } from './passengerInfo.service';
import { CreatePassengerInfoDto } from './dto/create-passengerInfo.dto';
import { UpdatePassengerInfoDto } from './dto/update-passengerInfo.dto';
export declare class PassengerInfoController {
    private readonly passengerInfoService;
    constructor(passengerInfoService: PassengerInfoService);
    create(createPassengerInfoDto: CreatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    findAll(): string;
    findOne(id: string): string;
    updatePassengerInfoyById(id: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    updatePassengerInfoByUserId(id: string, updatePassengerInfoDto: UpdatePassengerInfoDto): Promise<{
        id: string;
        userId: string;
    }[]>;
    remove(id: string): string;
}
