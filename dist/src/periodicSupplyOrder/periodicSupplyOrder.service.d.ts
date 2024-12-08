import { CreatePeriodicSupplyOrderDto } from './dto/create-periodicSupplyOrder.dto';
import { UpdatePeriodicSupplyOrderDto } from './dto/update-periodicSupplyOrder.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DaysOfWeekType } from '../types';
export declare class PeriodicSupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    createPeriodicSupplyOrderByCreatorId(creatorId: string, createPeriodicSupplyOrderDto: CreatePeriodicSupplyOrderDto): Promise<{
        id: string;
    }[]>;
    getPeriodicSupplyOrderById(id: string, creatorId: string): Promise<{
        id: string;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        startAfter: Date;
        endedAt: Date;
        scheduledDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
        tolerableRDV: number;
        autoAccept: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    searchPaginationPeriodicSupplyOrders(creatorId: string, scheduledDay: DaysOfWeekType | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
        id: string;
        scheduledDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
        autoAccept: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updatePeriodicSupplyOrderById(id: string, creatorId: string, updatePeriodicSupplyOrderDto: UpdatePeriodicSupplyOrderDto): Promise<{
        id: string;
    }[]>;
    deletePeriodicSupplyOrderById(id: string, creatorId: string): Promise<{
        id: string;
    }[]>;
}
