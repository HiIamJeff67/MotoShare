import { SeedingRidderInviteType, SeedingPurchaseOrderType, SeedingRidderType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
declare const RidderInviteSeedingOperator_base: typeof _DatabaseInstace;
export declare class RidderInviteSeedingOperator extends RidderInviteSeedingOperator_base {
    _seedRidderInvites: (ridders: SeedingRidderType[], purchaseOrders: SeedingPurchaseOrderType[], isStartAfterSoon?: boolean, options?: {
        startAfterDays?: number;
        startAfterYears?: number;
        endedAtDays?: number;
        endedAtYears?: number;
    }) => Promise<SeedingRidderInviteType[] | undefined>;
    getRandomRidderInvites: (quantity: number) => Promise<SeedingRidderInviteType[] | undefined>;
}
export {};
