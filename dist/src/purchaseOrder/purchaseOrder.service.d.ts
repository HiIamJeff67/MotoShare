import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
export declare class PurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    getPurchaseOrdersByCreatorId(creatorId: string, limit: number, offset: number): Promise<{
        startAddress: string;
        endAddress: string;
        initPrice: number;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
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
    getPurchaseOrderById(id: string): Promise<{
        startAddress: string;
        endAddress: string;
        description: string | null;
        initPrice: number;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
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
            } | null;
        };
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    getAllPurchaseOrders(): Promise<{
        startAddress: string;
        endAddress: string;
        description: string | null;
        initPrice: number;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
        createdAt: Date;
        creatorId: string;
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
}
