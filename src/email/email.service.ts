import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailValidationType } from '../interfaces';
import { SendReportEmailDto } from './dto/send-reportEmail.dto';
import { toUTCPlusN } from '../utils/toUTCPlusN';
import { StrictUserRoleType } from '../types';

@Injectable()
export class EmailService {
    constructor(
        private config: ConfigService, 
        private mailer: MailerService, 
    ) {}

    /* ================================= Send Welcome Email operations ================================= */
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
                currentYear: (toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(), 
            }
        });
    }
    /* ================================= Send Welcome Email operations ================================= */


    /* ================================= Send AuthCode(Validation) Email operations ================================= */
    async sendValidationEamil(to: string, payload: EmailValidationType) {
        return await this.mailer.sendMail({
            to: to, 
            subject: 'MotoShare Authentication Code', 
            template: './validatedEmail', 
            context: {
                ...payload, 
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"), 
                currentYear: (toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(), 
            }, 
        });
    }
    /* ================================= Send AuthCode(Validation) Email operations ================================= */
    

    /* ================================= Send Report(Feedback) Email operations ================================= */
    async sendReportEmailToDeveloper(
        userRole: StrictUserRoleType, 
        sendReportEmailDto: SendReportEmailDto, 
        to?: string, 
    ) {
        return await this.mailer.sendMail({
            from: sendReportEmailDto.email,
            to: to ?? this.config.get("GOOGLE_GMAIL"), 
            subject: `The Report of ${userRole} from MotoShare`, 
            template: './reportEmail', 
            context: {
                userName: sendReportEmailDto.userName, 
                userEmail: sendReportEmailDto.email, 
                subject: sendReportEmailDto.subject, 
                content: sendReportEmailDto.content, 
                submitTime: toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET"))), 
                motorbikeImageUrl: this.config.get("MOTOSHARE_ICON"), 
                currentYear: (toUTCPlusN(new Date(), Number(this.config.get("DEFAULT_TIME_ZONE_OFFSET")))).getFullYear(), 
            }, 
        });
    }
    /* ================================= Send Report(Feedback) Email operations ================================= */
}
