import { PassengerAuthService } from './passengerAuth.service';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ResetPassengerPasswordDto, UpdatePassengerEmailPasswordDto, ValidatePassengerInfoDto } from './dto/update-passengerAuth.dto';
export declare class PassengerAuthController {
    private readonly passengerAuthService;
    constructor(passengerAuthService: PassengerAuthService);
    sendAuthCodeForEmail(passenger: PassengerType, response: Response): Promise<void>;
    sendAuthCodeToResetForgottenPassword(passenger: PassengerType, response: Response): Promise<void>;
    sendAuthCodeToResetEmailOrPassword(passenger: PassengerType, response: Response): Promise<void>;
    validateAuthCodeForEmail(passenger: PassengerType, validatePassengerInfoDto: ValidatePassengerInfoDto, response: Response): Promise<void>;
    validateAuthCodeToResetForgottenPassword(passenger: PassengerType, resetPassengerPasswordDto: ResetPassengerPasswordDto, response: Response): Promise<void>;
    validateAuthCodeToResetEmailOrPassword(passenger: PassengerType, updatePassengerEmailPasswordDto: UpdatePassengerEmailPasswordDto, response: Response): Promise<void>;
}
