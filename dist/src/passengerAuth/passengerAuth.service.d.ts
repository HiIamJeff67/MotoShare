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
    sendAuthenticationCodeByEmail(email: string, title: string): Promise<{
        email: string;
        authCodeExpiredAt: Date;
    }[]>;
    getPassengerAuthByUserId(userId: string): Promise<{
        isEmailAuthenticated: boolean;
        isPhoneAuthenticated: boolean;
        isDefaultAuthenticated: boolean;
        isGoogleAuthenticated: boolean;
    }[]>;
    validateAuthCodeForEmail(id: string, validatePassengerInfoDto: ValidatePassengerInfoDto): Promise<{
        isEmailAuthenticated: boolean;
    }[]>;
    validateAuthCodeToResetForgottenPassword(resetPassengerPasswordDto: ResetPassengerPasswordDto): Promise<{
        email: string;
        userName: string;
    }[]>;
    validateAuthCodeToResetEmailOrPassword(id: string, updatePassengerEmailPasswordDto: UpdatePassengerEmailPasswordDto): Promise<{
        email: string;
        userName: string;
    }[]>;
    bindDefaultAuth(id: string, bindPassengerDefaultAuthDto: BindPassengerDefaultAuthDto): Promise<{
        email: string;
        userName: string;
    }[]>;
    bindGoogleAuth(id: string, bindPassengerGoogleAuthDto: BindPassengerGoogleAuthDto): Promise<{
        email: string;
        userName: string;
    }[]>;
}
