import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
export declare class PurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchPurchaseOrderByCreatorName(creatorName: string, limit: number, offset: number): Promise<{
        id: string;
        creatorName: never;
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchPaginationPurchaseOrders(limit: number, offset: number): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchCurAdjacentPurchaseOrders(limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    searchDestAdjacentPurchaseOrders(limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    searchSimilarRoutePurchaseOrders(limit: number, offset: number, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        deletedAt: Date;
    }[]>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        creatorId: string | null;
        description: string | null;
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
}
