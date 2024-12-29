import { RidderAuthService } from './ridderAuth.service';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { BindRidderDefaultAuthDto, BindRidderGoogleAuthDto, ResetRidderPasswordDto, UpdateRidderEmailPasswordDto, ValidateRidderInfoDto } from './dto/update-ridderAuth.dto';
export declare class RidderAuthController {
    private readonly ridderAuthService;
    constructor(ridderAuthService: RidderAuthService);
    sendAuthCodeForEmail(ridder: RidderType, response: Response): Promise<void>;
    sendAuthCodeToResetForgottenPassword(ridder: RidderType, response: Response): Promise<void>;
    sendAuthCodeToResetEmailOrPassword(ridder: RidderType, response: Response): Promise<void>;
    getMyAuth(ridder: RidderType, response: Response): Promise<void>;
    validateAuthCodeForEmail(ridder: RidderType, validateRidderInfoDto: ValidateRidderInfoDto, response: Response): Promise<void>;
    validateAuthCodeToResetForgottenPassword(ridder: RidderType, resetRidderPasswordDto: ResetRidderPasswordDto, response: Response): Promise<void>;
    validateAuthCodeToResetEmailOrPassword(ridder: RidderType, updateRidderEmailPasswordDto: UpdateRidderEmailPasswordDto, response: Response): Promise<void>;
    bindDefaultAuth(ridder: RidderType, bindRidderDefaultAuthDto: BindRidderDefaultAuthDto, response: Response): Promise<void>;
    bindGoogleAuth(ridder: RidderType, bindRidderGoogleAuthDto: BindRidderGoogleAuthDto, response: Response): Promise<void>;
}
