import { DaysOfWeekType } from "../../types";
export declare class CreatePeriodicSupplyOrderDto {
    scheduledDay: DaysOfWeekType;
    initPrice: number;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    startAddress: string;
    endAddress: string;
    startAfter: string;
    endedAt: string;
    tolerableRDV?: number;
    autoAccept?: boolean;
}
