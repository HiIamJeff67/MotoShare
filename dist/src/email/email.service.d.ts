import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private mailer;
    constructor(config: ConfigService, mailer: MailerService);
    sendWelcomeEmail(to: string, userName: string): Promise<void>;
}
