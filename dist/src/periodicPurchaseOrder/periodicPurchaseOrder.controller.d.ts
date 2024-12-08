import { PeriodicPurchaseOrderService } from './periodicPurchaseOrder.service';
import { CreatePeriodicPurchaseOrderDto } from './dto/create-periodicPurchaseOrder.dto';
import { UpdatePeriodicPurchaseOrderDto } from './dto/update-periodicPurchaseOrder.dto';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { DaysOfWeekType } from '../types';
export declare class PeriodicPurchaseOrderController {
    private periodicPurchaseOrderService;
    constructor(periodicPurchaseOrderService: PeriodicPurchaseOrderService);
    createMyPeriodicPurchaseOrder(passenger: PassengerType, createPeriodicPurchaseOrderDto: CreatePeriodicPurchaseOrderDto, response: Response): Promise<void>;
    getMyPeriodicPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    searchMyPaginationPeriodicPurchaseOrders(passenger: PassengerType, scheduledDay: DaysOfWeekType | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    updateMyPeriodicPurchaseOrderById(passenger: PassengerType, id: string, updatePeriodicPurchaseOrderDto: UpdatePeriodicPurchaseOrderDto, response: Response): Promise<void>;
    deleteMyPeriodicPurchaseOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
}
