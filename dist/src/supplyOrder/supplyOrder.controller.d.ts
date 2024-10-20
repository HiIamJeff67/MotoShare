import { SupplyOrderService } from './supplyOrder.service';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { GetCurAdjacentSupplyOrderDto } from './dto/get-supplyOrder.dto';
export declare class SupplyOrderController {
    private readonly supplyOrderService;
    constructor(supplyOrderService: SupplyOrderService);
    create(id: string, createSupplyOrderDto: CreateSupplyOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        createdAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getSupplyOrderById(id: string): Promise<{
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getSupplyOrdersByCreatorId(id: string, limit?: string, offset?: string): Promise<{
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getSupplyOrders(limit?: string, offset?: string): Promise<{
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    getCurAdjacentSupplyOrders(limit: string | undefined, offset: string | undefined, getCurAdjacentSupplyOrderDto: GetCurAdjacentSupplyOrderDto): Promise<{
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
        status: "POSTED" | "EXPIRED" | "CANCEL";
        distance: unknown;
    }[]>;
    updateSupplyOrderById(id: string, updateSupplyOrderDto: UpdateSupplyOrderDto): Promise<{
        id: string;
        creatorId: string | null;
        updatedAt: Date;
        status: "POSTED" | "EXPIRED" | "CANCEL";
    }[]>;
    deleteSupplyOrderById(id: string): Promise<import("pg").QueryResult<never>>;
}
