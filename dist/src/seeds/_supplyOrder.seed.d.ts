import { SeedingRidderType, SeedingSupplyOrderType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
declare const SupplyOrderSeedingOperator_base: typeof _DatabaseInstace;
export declare class SupplyOrderSeedingOperator extends SupplyOrderSeedingOperator_base {
    _seedSupplyOrders: (ridders: SeedingRidderType[], isStartAfterSoon?: boolean, options?: {
        startAfterDays?: number;
        startAfterYears?: number;
        endedAtDays?: number;
        endedAtYears?: number;
    }) => Promise<SeedingSupplyOrderType[] | undefined>;
    _getRandomSupplyOrders: (quantity: number) => Promise<SeedingSupplyOrderType[] | undefined>;
}
export {};
