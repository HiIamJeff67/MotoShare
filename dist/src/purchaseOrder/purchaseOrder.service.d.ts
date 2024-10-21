import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
export declare class PurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrders(limit: number, offset: number): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getCurAdjacentPurchaseOrders(limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    getDestAdjacentPurchaseOrders(limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    getSimilarRoutePurchaseOrders(limit: number, offset: number, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deletePurchaseOrderById(id: string): Promise<import("pg").QueryResult<never>>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
        isUrgent: boolean;
    }[]>;
}
