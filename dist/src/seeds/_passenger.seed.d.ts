import { _DatabaseInstace } from "./_db";
import { SeedingPassengerType } from "../interfaces";
export declare class PassengerSeedingOperator extends _DatabaseInstace {
    private __getRandomAuthCode;
    _seedPassengers: (quantity: number) => Promise<SeedingPassengerType[] | undefined>;
    _getRandomPassengers: (quantity: number) => Promise<{
        id: string;
        userName: string;
    }[] | undefined>;
}
