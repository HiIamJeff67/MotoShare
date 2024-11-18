import { RidderService } from './ridder.service';
import { Response } from 'express';
import { RidderType } from '../interfaces/auth.interface';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
export declare class RidderController {
    private readonly ridderService;
    constructor(ridderService: RidderService);
    getMe(ridder: RidderType, response: Response): Promise<void>;
    getRidderWithInfoByUserName(ridder: RidderType, userName: string, response: Response): Promise<void>;
    getMyInfo(ridder: RidderType, response: Response): Promise<void>;
    getMyCollection(ridder: RidderType, response: Response): Promise<void>;
    searchPaginationRidders(userName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMe(ridder: RidderType, updateRidderDto: UpdateRidderDto, response: Response): Promise<void>;
    updateMyInfo(ridder: RidderType, updateRidderInfoDto: UpdateRidderInfoDto, file: Express.Multer.File | undefined, response: Response): Promise<void>;
    deleteMe(ridder: RidderType, response: Response): Promise<void>;
    getAllRidders(response: Response): Promise<void>;
}
