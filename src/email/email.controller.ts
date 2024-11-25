import { Controller, Get, Res } from "@nestjs/common";
import { EmailService } from "./email.service";
import { Response } from "express";
import { HttpStatusCode } from "../enums";

@Controller('/email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Get('test')
    async test(
        @Res() response: Response, 
    ) {
        try {
            const res = await this.emailService.sendWelcomeEmail("iamjeffhi67@gmail.com", "Jeff");
            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            response.status(error.status).send(error);
        }
    }
};