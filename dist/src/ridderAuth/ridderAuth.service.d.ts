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
    validateAuthCodeForEmail(id: string, validateRidderInfoDto: ValidateRidderInfoDto): Promise<{
        isEmailAuthenticated: boolean;
    }[]>;
    validateAuthCodeToResetForgottenPassword(id: string, resetRidderPasswordDto: ResetRidderPasswordDto): Promise<{
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
