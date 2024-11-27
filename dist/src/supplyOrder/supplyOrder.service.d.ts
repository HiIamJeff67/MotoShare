import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
export declare class SupplyOrderService {
    private db;
    constructor(db: DrizzleDB);
    private updateExpiredSupplyOrders;
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    searchSupplyOrdersByCreatorId(creatorId: string, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        tolerableRDV: number;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    getSupplyOrderById(id: string): Promise<{
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
        tolerableRDV: number;
        autoAccept: boolean;
        createdAt: Date;
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
    searchPaginationSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        tolerableRDV: number;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    searchAboutToStartSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
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
        tolerableRDV: number;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
    }[]>;
    searchCurAdjacentSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
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
        tolerableRDV: number;
        motocycleType: string | null;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchDestAdjacentSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto): Promise<{
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
        tolerableRDV: number;
        motocycleType: string | null;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchSimilarRouteSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto): Promise<{
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
        tolerableRDV: number;
        motocycleType: string | null;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        RDV: unknown;
    }[]>;
    updateSupplyOrderById(id: string, creatorId: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
    startSupplyOrderWithoutInvite(id: string, userId: string, acceptAutoAcceptSupplyOrderDto: AcceptAutoAcceptSupplyOrderDto): Promise<{
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
    deleteSupplyOrderById(id: string, creatorId: string): Promise<{
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        id: string;
    }[]>;
}
