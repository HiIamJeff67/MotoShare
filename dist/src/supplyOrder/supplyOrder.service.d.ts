import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';
export declare class SupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getSupplyOrderById(id: string): Promise<{
        id: string;
        creatorId: string | null;
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
    getSupplyOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
        id: string;
        creatorId: string | null;
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
    getSupplyOrders(limit: number, offset: number): Promise<{
        id: string;
        creatorId: string | null;
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
    getCurAdjacentSupplyOrders(limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorId: string | null;
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
    getDestAdjacentSupplyOrders(limit: number, offset: number, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
        id: string;
        creatorId: string | null;
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
    getSimilarRouteSupplyOrders(limit: number, offset: number, getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto): Promise<{
        id: string;
        creatorId: string | null;
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
    updateSupplyOrderById(id: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deleteSupplyOrderById(id: string): Promise<import("pg").QueryResult<never>>;
}
