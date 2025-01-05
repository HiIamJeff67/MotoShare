import { SeedingPurchaseOrderType, SeedingPassengerType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
export declare class PurchaseOrderSeedingOperator extends _DatabaseInstace {
    _seedPurchaseOrders: (passengers: SeedingPassengerType[], isStartAfterSoon?: boolean, options?: {
        startAfterDays?: number;
        startAfterYears?: number;
        endedAtDays?: number;
        endedAtYears?: number;
    }) => Promise<SeedingPurchaseOrderType[] | undefined>;
    _getRandomPurchaseOrders: (quantity: number) => Promise<SeedingPurchaseOrderType[] | undefined>;
}
