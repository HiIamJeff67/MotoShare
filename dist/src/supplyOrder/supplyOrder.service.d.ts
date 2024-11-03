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
    getSupplyOrderById(id: string): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
    searchSupplyOrderByCreatorName(creatorName: string, limit: number, offset: number): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
    searchPaginationSupplyOrders(limit: number, offset: number): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
    searchCurAdjacentSupplyOrders(limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
        distance: unknown;
    }[]>;
    searchDestAdjacentSupplyOrders(limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
        distance: unknown;
    }[]>;
    searchSimilarRouteSupplyOrders(limit: number, offset: number, getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
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
        deletedAt: Date;
    }[]>;
}
