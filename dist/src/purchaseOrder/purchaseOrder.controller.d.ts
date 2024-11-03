import { PurchaseOrderService } from './purchaseOrder.service';
import { Response } from 'express';
import { PassengerType } from '../interfaces/auth.interface';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    createPurchaseOrder(passenger: PassengerType, createPurchaseOrderDto: CreatePurchaseOrderDto, response: Response): Promise<void>;
    getMyPurchaseOrders(passenger: PassengerType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    getPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    searchPurchaseOrdersByCreatorName(userName: string, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchPaginationPurchaseOrders(limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentPurchaseOrders(limit: string | undefined, offset: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchDestAdjacentPurchaseOrders(limit: string | undefined, offset: string | undefined, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto, response: Response): Promise<void>;
    searchSimilarRoutePurchaseOrders(limit: string | undefined, offset: string | undefined, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto, response: Response): Promise<void>;
    updateMyPurchaseOrderById(passenger: PassengerType, id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto, response: Response): Promise<void>;
    deleteMyPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
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
