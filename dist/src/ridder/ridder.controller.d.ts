import { RidderService } from './ridder.service';
import { Response } from 'express';
import { RidderType } from '../interfaces/auth.interface';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { DeleteRidderDto } from './dto/delete-ridder.dto';
export declare class RidderController {
    private readonly ridderService;
    constructor(ridderService: RidderService);
    getMe(ridder: RidderType, response: Response): Promise<void>;
    getRidderWithInfoByUserName(ridder: RidderType, userName: string, response: Response): Promise<void>;
    getMyInfo(ridder: RidderType, response: Response): Promise<void>;
    getMyCollection(ridder: RidderType, response: Response): Promise<void>;
    searchPaginationRidders(userName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMe(ridder: RidderType, updateRidderDto: UpdateRidderDto, response: Response): Promise<void>;
    updateMyInfo(ridder: RidderType, updateRidderInfoDto: UpdateRidderInfoDto, files: {
        avatorFile?: Express.Multer.File[];
        motocyclePhotoFile?: Express.Multer.File[];
    }, response: Response): Promise<void>;
    deleteMe(ridder: RidderType, deleteRidderDto: DeleteRidderDto, response: Response): Promise<void>;
    getAllRidders(response: Response): Promise<void>;
}
