import { EmailService } from "./email.service";
import { Response } from "express";
export declare class EmailController {
    private emailService;
    constructor(emailService: EmailService);
    test(response: Response): Promise<void>;
}
