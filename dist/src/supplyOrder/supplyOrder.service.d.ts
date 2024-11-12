import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';
export declare class SupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        id: string;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        startAfter: Date;
        updatedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        startAfter: Date;
        updatedAt: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        tolerableRDV: number;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL";
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        tolerableRDV: number;
        motocycleType: never;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        RDV: unknown;
    }[]>;
    updateSupplyOrderById(id: string, creatorId: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deleteSupplyOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
}
