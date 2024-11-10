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
        status: "POSTED" | "EXPIRED" | "CANCEL";
        isUrgent: boolean;
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
        isUrgent: boolean;
        creator: {
            userName: string;
            info: {
                isOnline: boolean;
                avatorUrl: string | null;
            } | null;
        } | null;
    } | undefined>;
    searchPaginationPurchaseOrders(creatorName: string | undefined, limit: number, offset: number): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    searchCurAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    searchDestAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    searchSimilarRoutePurchaseOrders(creatorName: string | undefined, limit: number, offset: number, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto): Promise<{
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
    }[]>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
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
        startAfter: Date;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        isUrgent: boolean;
    }[]>;
}
