import { SupplyOrderService } from './supplyOrder.service';
import { Response } from 'express';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { GetAdjacentSupplyOrdersDto, GetBetterSupplyOrderDto, GetSimilarRouteSupplyOrdersDto, GetSimilarTimeSupplyOrderDto } from './dto/get-supplyOrder.dto';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
import { SearchPriorityType } from '../types';
export declare class SupplyOrderController {
    private readonly supplyOrderService;
    constructor(supplyOrderService: SupplyOrderService);
    createSupplyOrder(ridder: RidderType, createSupplyOrderDto: CreateSupplyOrderDto, response: Response): Promise<void>;
    getSupplyOrderById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    searchMySupplyOrders(ridder: RidderType, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    searchPaginationSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    searchAboutToStartSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, response: Response): Promise<void>;
    seachSimilarTimeSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getSimilarTimeSupplyOrderDto: GetSimilarTimeSupplyOrderDto, response: Response): Promise<void>;
    searchCurAdjacentSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto, response: Response): Promise<void>;
    searchDestAdjacentSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto, response: Response): Promise<void>;
    searchSimilarRouteSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto, response: Response): Promise<void>;
    searchBetterFirstSupplyOrders(creatorName: string | undefined, limit: string | undefined, offset: string | undefined, isAutoAccept: string | undefined, searchPriorities: SearchPriorityType | undefined, getBetterSupplyOrderDto: GetBetterSupplyOrderDto, response: Response): Promise<void>;
    updateMySupplyOrderById(ridder: RidderType, id: string, updateSupplyOrderDto: UpdateSupplyOrderDto, response: Response): Promise<void>;
    startSupplyOrderWithoutInvite(passenger: PassengerType, id: string, acceptAutoAcceptSupplyOrder: AcceptAutoAcceptSupplyOrderDto, response: Response): Promise<void>;
    cancelMySupplyOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    deleteMySupplyOrderById(ridder: RidderType, id: string, response: Response): Promise<void>;
}
