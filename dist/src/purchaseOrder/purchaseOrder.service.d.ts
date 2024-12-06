import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
export declare class PurchaseOrderService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    private updateExpiredPurchaseOrders;
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    startPurchaseOrderWithoutInvite(id: string, userId: string, userName: string, acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto): Promise<{
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
        orderStatus: "FINISHED" | "UNSTARTED" | "STARTED" | "UNPAID";
    }[]>;
    cancelPurchaseOrderById(id: string, creatorId: string, creatorName: string): Promise<{
        id: string;
        stauts: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
}
