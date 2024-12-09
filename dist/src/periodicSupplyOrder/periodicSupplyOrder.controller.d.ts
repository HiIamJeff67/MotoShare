import { PeriodicSupplyOrderService } from './periodicSupplyOrder.service';
import { CreatePeriodicSupplyOrderDto } from './dto/create-periodicSupplyOrder.dto';
import { UpdatePeriodicSupplyOrderDto } from './dto/update-periodicSupplyOrder.dto';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { DaysOfWeekType } from '../types';
export declare class PeriodicSupplyOrderController {
    private readonly periodicSupplyOrderService;
    constructor(periodicSupplyOrderService: PeriodicSupplyOrderService);
    createMyPeriodicSupplyOrder(ridder: RidderType, createPeriodicSupplyOrderDto: CreatePeriodicSupplyOrderDto, response: Response): Promise<void>;
    getMyPeriodicSupplyOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchMyPaginationPeriodicSupplyOrders(ridder: RidderType, scheduledDay: DaysOfWeekType | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    updateMyPeriodicSupplyOrderById(ridder: RidderType, id: string, updatePeriodicSupplyOrderDto: UpdatePeriodicSupplyOrderDto, response: Response): Promise<void>;
    deleteMyPeriodicSupplyOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
}
