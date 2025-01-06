import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { GetAdjacentSupplyOrdersDto, GetBetterSupplyOrderDto, GetSimilarRouteSupplyOrdersDto, GetSimilarTimeSupplyOrderDto } from './dto/get-supplyOrder.dto';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { SearchPriorityType } from '../types';
export declare class SupplyOrderService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    private updateExpiredSupplyOrders;
    createSupplyOrderByCreatorId(creatorId: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        hasConflict: boolean;
    }[]>;
    getSupplyOrderById(id: string): Promise<{
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
        tolerableRDV: number;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    searchSimilarTimeSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getSimilarTimeSupplyOrderDto: GetSimilarTimeSupplyOrderDto): Promise<{
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        RDV: unknown;
    }[]>;
    searchBetterFirstSupplyOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getBetterSupplyOrderDto: GetBetterSupplyOrderDto, searchPriorities: SearchPriorityType): Promise<{
        supplyOrder: any;
        ridder: any;
        ridderInfo: any;
    }[]>;
    updateSupplyOrderById(id: string, creatorId: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        hasConflict: any;
    }[]>;
    startSupplyOrderWithoutInvite(id: string, userId: string, userName: string, acceptAutoAcceptSupplyOrderDto: AcceptAutoAcceptSupplyOrderDto): Promise<{
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
    cancelSupplyOrderById(id: string, creatorId: string, creatorName: string): Promise<{
        id: string;
        stauts: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    deleteSupplyOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
}
