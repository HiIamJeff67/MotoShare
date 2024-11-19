import { PurchaseOrderService } from './purchaseOrder.service';
import { Response } from 'express';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    createPurchaseOrder(passenger: PassengerType, createPurchaseOrderDto: CreatePurchaseOrderDto, response: Response): Promise<void>;
    getMyPurchaseOrders(passenger: PassengerType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    getPurchaseOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchPaginationPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchDestAdjacentPurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchSimilarRoutePurchaseOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto, response: Response): Promise<void>;
    updateMyPurchaseOrderById(passenger: PassengerType, id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto, response: Response): Promise<void>;
    deleteMyPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
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
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL" | "RESERVED";
        isUrgent: boolean;
    }[]>;
    testWithExpired(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    testWithoutExpired(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
}
