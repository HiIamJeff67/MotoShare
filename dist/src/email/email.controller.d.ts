import { EmailService } from "./email.service";
import { Response } from "express";
import { SendReportEmailDto } from "./dto/send-reportEmail.dto";
export declare class EmailController {
    private emailService;
    constructor(emailService: EmailService);
    sendPassengerReportEmailToDeveloper(sendReportEmailDto: SendReportEmailDto, response: Response): Promise<void>;
    sendRidderReportEmailToDeveloper(sendReportEmailDto: SendReportEmailDto, response: Response): Promise<void>;
}
