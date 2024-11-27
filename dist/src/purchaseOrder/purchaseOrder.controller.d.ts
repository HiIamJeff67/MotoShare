import { PurchaseOrderService } from './purchaseOrder.service';
import { Response } from 'express';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    createPurchaseOrder(passenger: PassengerType, createPurchaseOrderDto: CreatePurchaseOrderDto, response: Response): Promise<void>;
    searchMyPurchaseOrders(passenger: PassengerType, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    getPurchaseOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchPaginationPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    searchAboutToStartPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchDestAdjacentPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchSimilarRoutePurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto, response: Response): Promise<void>;
    updateMyPurchaseOrderById(passenger: PassengerType, id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto, response: Response): Promise<void>;
    startPurchaseOrderWithoutInvite(ridder: RidderType, id: string, acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto, response: Response): Promise<void>;
    deleteMyPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        creatorId: string;
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
        startAddress: string;
        endAddress: string;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    testWithExpired(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    testWithoutExpired(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
}
