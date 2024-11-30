import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailValidationType } from '../interfaces';

@Injectable()
export class EmailService {
    constructor(
        private config: ConfigService, 
        private mailer: MailerService, 
    ) {}

    async sendWelcomeEmail(to: string, userName: string) {
        return await this.mailer.sendMail({
            to: to, 
            subject: 'Welcome to MotoShare', 
            template: this.config.get("BACKEND_DEVELOPER") 
                && userName.includes(this.config.get("BACKEND_DEVELOPER") as string)
                    ? './bounsWelcomeEmail'
                    : './welcomeEmail', 
            context: {
                userName: userName,
                titleDecorationUrl: this.config.get("MOTOSHARE_DECORATION_1"),
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                currentYear: new Date().getFullYear(), 
            }
        });
    }

    async sendValidationEamil(to: string, payload: EmailValidationType) {
        return await this.mailer.sendMail({
            to: to, 
            subject: 'MotoShare Authentication Code', 
            template: './validatedEmail', 
            context: {
                ...payload, 
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"), 
                currentYear: new Date().getFullYear(), 
            }, 
        });
    }
}
