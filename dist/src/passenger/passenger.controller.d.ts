import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengerController {
    private readonly passengerService;
    constructor(passengerService: PassengerService);
    createPassenger(createPassengerDto: CreatePassengerDto): Promise<{
        id: string;
    }[]>;
    getPassengerById(id: string): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
    getAllPassengers(): Promise<{
        id: string;
        userName: string;
    }[]>;
    updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto): Promise<{
        id: string;
    }[]>;
    deletePassengerById(id: string): Promise<import("pg").QueryResult<never>>;
}
