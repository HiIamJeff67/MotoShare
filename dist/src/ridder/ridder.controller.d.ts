import { RidderService } from './ridder.service';
import { Response } from 'express';
import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdatePassengerInfoDto } from 'src/passenger/dto/update-info.dto';
export declare class RidderController {
    private readonly ridderService;
    constructor(ridderService: RidderService);
    createRidderWithInfoAndCollection(createRidderDto: CreateRidderDto, response: Response): Promise<void>;
    getRidderById(id: string, response: Response): Promise<void>;
    getRidderWithInfoByUserId(id: string, response: Response): Promise<void>;
    getRidderWithCollectionByUserId(id: string, response: Response): Promise<void>;
    getPaginationRidders(limit: string, offset: string, response: Response): Promise<void>;
    getAllRidders(response: Response): Promise<void>;
    updateRidderById(id: string, updateRidderDto: UpdateRidderDto, response: Response): Promise<void>;
    updateRidderInfoByUserId(id: string, updatePassengerInfoDto: UpdatePassengerInfoDto, response: Response): Promise<void>;
    deleteRidderById(id: string, response: Response): Promise<void>;
}
