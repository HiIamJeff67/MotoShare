import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';
export declare class SupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    getSupplyOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
        id: string;
        createdAt: Date;
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
        updatedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    getSupplyOrderById(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
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
        updatedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
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
        manhattanDistance: unknown;
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
        manhattanDistance: unknown;
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
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    deleteSupplyOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
}
