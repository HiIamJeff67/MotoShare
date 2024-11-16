import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';
export declare class SupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    getSupplyOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
        startAddress: string;
        endAddress: string;
        initPrice: number;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
        createdAt: Date;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        updatedAt: Date;
    }[]>;
    getSupplyOrderById(id: string): Promise<{
        startAddress: string;
        endAddress: string;
        description: string | null;
        initPrice: number;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
        createdAt: Date;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        updatedAt: Date;
        creator: {
            userName: string;
            info: {
                isOnline: boolean;
                avatorUrl: string | null;
                motocycleType: string | null;
                motocyclePhotoUrl: string | null;
            } | null;
        };
    } | undefined>;
    searchPaginationSupplyOrders(creatorName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: never;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    searchCurAdjacentSupplyOrders(creatorName: string | undefined, limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: never;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        distance: unknown;
    }[]>;
    searchDestAdjacentSupplyOrders(creatorName: string | undefined, limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: never;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        distance: unknown;
    }[]>;
    searchSimilarRouteSupplyOrders(creatorName: string | undefined, limit: number, offset: number, getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: never;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        RDV: unknown;
    }[]>;
    updateSupplyOrderById(id: string, creatorId: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    deleteSupplyOrderById(id: string, creatorId: string): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
}
