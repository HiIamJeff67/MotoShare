import { BindPassengerDefaultAuthDto, BindPassengerGoogleAuthDto, ResetPassengerPasswordDto, UpdatePassengerEmailPasswordDto, ValidatePassengerInfoDto } from './dto/update-passengerAuth.dto';
import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { EmailService } from '../email/email.service';
export declare class PassengerAuthService {
    private config;
    private email;
    private db;
    constructor(config: ConfigService, email: EmailService, db: DrizzleDB);
    private _generateAuthCode;
    sendAuthenticationCodeById(id: string, title: string): Promise<{
        email: string;
        authCodeExpiredAt: Date;
    }[]>;
    validateAuthCodeForEmail(id: string, validatePassengerInfoDto: ValidatePassengerInfoDto): Promise<{
        isEmailAuthenticated: boolean;
    }[]>;
    validateAuthCodeToResetForgottenPassword(id: string, resetPassengerPasswordDto: ResetPassengerPasswordDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    validateAuthCodeToResetEmailOrPassword(id: string, updatePassengerEmailPasswordDto: UpdatePassengerEmailPasswordDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    bindDefaultAuth(id: string, bindPassengerDefaultAuthDto: BindPassengerDefaultAuthDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    bindGoogleAuth(id: string, bindPassengerGoogleAuthDto: BindPassengerGoogleAuthDto): Promise<{
        userName: string;
        email: string;
    }[]>;
}
