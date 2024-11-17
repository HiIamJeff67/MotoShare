import { PassengerInviteService } from './passengerInvite.service';
import { Response } from 'express';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
export declare class PassengerInviteController {
    private readonly passengerInviteService;
    constructor(passengerInviteService: PassengerInviteService);
    createPassengerInviteByOrderId(passenger: PassengerType, orderId: string, createPassengerInviteDto: CreatePassengerInviteDto, response: Response): Promise<void>;
    getPassengerInviteForPassengerById(passenger: PassengerType, id: string, response: Response): Promise<void>;
    getPassengerInviteForRidderById(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchPaginationPassengerInvitesByInviterId(passenger: PassengerType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentPassengerInvitesByInviterId(passenger: PassengerType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchDestAdjacentPassengerInvitesByInviterId(passenger: PassengerType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchSimilarRoutePassengerInvitesByInviterId(passenger: PassengerType, receiverName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchPaginationPasssengerInvitesByReceiverId(ridder: RidderType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchCurAdjacentPassengerInvitesByReceiverId(ridder: RidderType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchDestAdjacentPassengerInvitesByReceiverId(ridder: RidderType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    searchMySimilarRoutePassengerInvitesByReceverId(ridder: RidderType, inviterName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMyPassengerInviteById(passenger: PassengerType, id: string, updatePassengerInviteDto: UpdatePassengerInviteDto, response: Response): Promise<void>;
    decidePassengerInviteById(ridder: RidderType, id: string, decidePassengerInviteDto: DecidePassengerInviteDto, response: Response): Promise<void>;
    deleteMyPassengerInviteById(passenger: PassengerType, id: string, response: Response): Promise<void>;
}
