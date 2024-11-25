import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailValidationType } from '../interfaces';
export declare class EmailService {
    private config;
    private mailer;
    constructor(config: ConfigService, mailer: MailerService);
    sendWelcomeEmail(to: string, userName: string): Promise<any>;
    sendValidationEamil(to: string, payload: EmailValidationType): Promise<any>;
}
