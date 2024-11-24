import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private config: ConfigService, 
        private mailer: MailerService, 
    ) {}

    async sendWelcomeEmail(to: string, userName: string) {
        await this.mailer.sendMail({
            to, 
            subject: 'Welcome to MotoShare', 
            template: './welcomeEmail', 
            context: {
                userName: userName,
                titleDecorationUrl: this.config.get("MOTOSHARE_DECORATION_1"),
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"),
                currentYear: new Date().getFullYear()
            }
        });
    }
}
