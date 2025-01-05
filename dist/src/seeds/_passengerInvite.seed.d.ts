import { SeedingPassengerInviteType, SeedingPassengerType, SeedingSupplyOrderType } from "../interfaces";
import { _DatabaseInstace } from "./_db";
declare const PassengerInviteSeedingOperator_base: typeof _DatabaseInstace;
export declare class PassengerInviteSeedingOperator extends PassengerInviteSeedingOperator_base {
    _seedPassengerInvites: (passengers: SeedingPassengerType[], supplyOrders: SeedingSupplyOrderType[], isStartAfterSoon?: boolean, options?: {
        startAfterDays?: number;
        startAfterYears?: number;
        endedAtDays?: number;
        endedAtYears?: number;
    }) => Promise<SeedingPassengerInviteType[] | undefined>;
    getRandomPassengerInvites: (quantity: number) => Promise<SeedingPassengerInviteType[] | undefined>;
}
export {};
