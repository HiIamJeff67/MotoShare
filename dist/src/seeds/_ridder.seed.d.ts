import { _DatabaseInstace } from "./_db";
import { SeedingRidderType } from "../interfaces";
declare const RidderSeedingOperator_base: typeof _DatabaseInstace;
export declare class RidderSeedingOperator extends RidderSeedingOperator_base {
    private __getRandomAuthCode;
    _seedRidders: (quantity: number) => Promise<SeedingRidderType[] | undefined>;
    _getRandomRidders: (quantity: number) => Promise<{
        id: string;
        userName: string;
    }[] | undefined>;
}
export {};
