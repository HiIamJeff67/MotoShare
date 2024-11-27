import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
export declare class PurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
    private updateExpiredPurchaseOrders;
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    searchPurchaseOrdersByCreatorId(creatorId: string, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
        description: string | null;
        updatedAt: Date;
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
        autoAccept: boolean;
        createdAt: Date;
        isUrgent: boolean;
        creator: {
            userName: string;
            info: {
                isOnline: boolean;
                avatorUrl: string | null;
            } | null;
        };
    } | undefined>;
    searchPaginationPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    searchAboutToStartPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    searchCurAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchDestAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchSimilarRoutePurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto): Promise<{
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
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    startPurchaseOrderWithoutInvite(id: string, userId: string, acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto): Promise<{
        orderId: string;
        price: number;
        finalStartCord: {
            x: number;
            y: number;
        };
        finalEndCord: {
            x: number;
            y: number;
        };
        finalStartAddress: string;
        finalEndAddress: string;
        startAfter: Date;
        endedAt: Date;
        orderStatus: "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED";
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    getAllPurchaseOrders(): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
        description: string | null;
        updatedAt: Date;
        creatorId: string;
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
        autoAccept: boolean;
        createdAt: Date;
        isUrgent: boolean;
    }[]>;
    searchPaginationPurchaseOrdersWithUpdateExpired(updateExpiredData: boolean, userName: string | undefined, limit: number, offset: number): Promise<{
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
}
