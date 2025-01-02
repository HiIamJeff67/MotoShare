import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { BindRidderDefaultAuthDto, BindRidderGoogleAuthDto, ResetRidderPasswordDto, UpdateRidderEmailPasswordDto, ValidateRidderInfoDto } from './dto/update-ridderAuth.dto';
export declare class RidderAuthService {
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
    getRidderAuthByUserId(userId: string): Promise<{
        isEmailAuthenticated: boolean;
        isPhoneAuthenticated: boolean;
        isDefaultAuthenticated: boolean;
        isGoogleAuthenticated: boolean;
    }[]>;
    validateAuthCodeForEmail(id: string, validateRidderInfoDto: ValidateRidderInfoDto): Promise<{
        isEmailAuthenticated: boolean;
    }[]>;
    validateAuthCodeToResetForgottenPassword(resetRidderPasswordDto: ResetRidderPasswordDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    validateAuthCodeToResetEmailOrPassword(id: string, updateRidderEmailPasswordDto: UpdateRidderEmailPasswordDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    bindDefaultAuth(id: string, bindRidderDefaultAuthDto: BindRidderDefaultAuthDto): Promise<{
        userName: string;
        email: string;
    }[]>;
    bindGoogleAuth(id: string, bindRidderGoogleAuthDto: BindRidderGoogleAuthDto): Promise<{
        userName: string;
        email: string;
    }[]>;
}
