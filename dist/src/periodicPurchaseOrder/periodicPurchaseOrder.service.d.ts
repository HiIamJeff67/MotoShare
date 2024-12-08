import { CreatePeriodicPurchaseOrderDto } from './dto/create-periodicPurchaseOrder.dto';
import { UpdatePeriodicPurchaseOrderDto } from './dto/update-periodicPurchaseOrder.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { DaysOfWeekType } from '../types';
export declare class PeriodicPurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
    createPeriodicPurchaseOrderByCreatorId(creatorId: string, createPeriodicPurchaseOrderDto: CreatePeriodicPurchaseOrderDto): Promise<{
        id: string;
    }[]>;
    getPeriodicPurchaseOrderById(id: string, creatorId: string): Promise<{
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
        autoAccept: boolean;
        createdAt: Date;
        updatedAt: Date;
        isUrgent: boolean;
    } | undefined>;
    searchPaginationPeriodicPurchaseOrders(creatorId: string, scheduledDay: DaysOfWeekType | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
        id: string;
        scheduledDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
        autoAccept: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updatePeriodicPurchaseOrderById(id: string, creatorId: string, updatePeriodicPurchaseOrderDto: UpdatePeriodicPurchaseOrderDto): Promise<{
        id: string;
    }[]>;
    deletePeriodicPurchaseOrderById(id: string, creatorId: string): Promise<{
        id: string;
    }[]>;
}
