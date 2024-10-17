import { PurchaseOrderService } from './purchaseOrder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    createPurchaseOrder(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        id: string;
        creatorId: string | null;
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
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED";
    }[]>;
    getPurchaseOrderByCreatorId(creatorId: string): Promise<{
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
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED";
    }[]>;
    getAllPurchaseOrders(): Promise<{
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
        updatedAt: Date;
        startAfter: Date;
        isUrgent: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED";
    }[]>;
    update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): string;
    remove(id: string): string;
}
