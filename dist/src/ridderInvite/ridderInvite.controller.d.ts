import { RidderInviteService } from './ridderInvite.service';
import { Response } from 'express';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
export declare class RidderInviteController {
    private readonly ridderInviteService;
    constructor(ridderInviteService: RidderInviteService);
    createRidderInviteByOrderId(ridder: RidderType, orderId: string, createRidderInviteDto: CreateRidderInviteDto, response: Response): Promise<void>;
    getRidderInviteOfRidderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    getRidderInviteOfPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    searchPaginationRidderInvitesByInviterId(ridder: RidderType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchAboutToStartRidderInvitesByInviterId(ridder: RidderType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentRidderInvitesByInviterId(ridder: RidderType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchDestAdjacentRidderInvitesByInviterId(ridder: RidderType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchSimilarRouteRidderInvitesByInviterId(ridder: RidderType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchPaginationRidderInvitesByReceiverId(passenger: PassengerType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchAboutToStartRidderInvitesByReceiverId(passenger: PassengerType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentRidderInvitesByReceiverId(passenger: PassengerType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchDestAdjacentRidderInvitesByReceiverId(passenger: PassengerType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchMySimilarRouteRidderInvitesByReceverId(passenger: PassengerType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMyRidderInviteById(ridder: RidderType, id: string, updateRidderInviteDto: UpdateRidderInviteDto, response: Response): Promise<void>;
    decidePassengerInviteById(passenger: PassengerType, id: string, decideRidderInviteDto: DecideRidderInviteDto, response: Response): Promise<void>;
    deleteMyRidderInviteById(ridder: RidderType, id: string, response: Response): Promise<void>;
}
