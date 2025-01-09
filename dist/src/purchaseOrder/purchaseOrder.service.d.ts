import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
import { GetAdjacentPurchaseOrdersDto, GetBetterPurchaseOrderDto, GetSimilarRoutePurchaseOrdersDto, GetSimilarTimePurchaseOrderDto } from './dto/get-purchaseOrder.dto';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { SearchPriorityType } from '../types';
export declare class PurchaseOrderService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    private updateExpiredPurchaseOrders;
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        hasConflict: boolean;
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
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
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        creator: {
            userName: string;
            info: {
                isOnline: boolean;
                avatorUrl: string | null;
            } | null;
        };
    } | undefined>;
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
    searchSimliarTimePurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getSimilarTimePurchaseOrderDto: GetSimilarTimePurchaseOrderDto): Promise<{
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
    searchBetterFirstPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getBetterPurchaseOrderDto: GetBetterPurchaseOrderDto, searchPriorities: SearchPriorityType): Promise<{
        passenger: any;
        purchaseOrder: any;
        passengerInfo: any;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        hasConflict: any;
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
        orderStatus: "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED";
    }[]>;
    cancelPurchaseOrderById(id: string, creatorId: string, creatorName: string): Promise<{
        id: string;
        stauts: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
}
