import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
export declare class PurchaseOrderService {
    private db;
    constructor(db: DrizzleDB);
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
    update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): string;
    remove(id: number): string;
}
