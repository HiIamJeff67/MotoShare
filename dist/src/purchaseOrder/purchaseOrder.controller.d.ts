import { PurchaseOrderService } from './purchaseOrder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    createPurchaseOrderByCreatorId(id: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrdersByCreatorId(id: string, limit: string, offset: string): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getPurchaseOrders(limit: string, offset: string): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    updatePurchaseOrderById(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deletePurchaseOrderById(id: string): Promise<import("pg").QueryResult<never>>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
        isUrgent: boolean;
    }[]>;
}
