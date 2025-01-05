import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { EmailService } from "./email.service";
import { Response } from "express";
import { HttpStatusCode } from "../enums";
import { AnyGuard, JwtPassengerGuard, JwtRidderGuard } from "../auth/guard";
import { SendReportEmailDto } from "./dto/send-reportEmail.dto";

@Controller('/email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    // @Get('test')
    // async test(
    //     @Res() response: Response, 
    // ) {
    //     try {
    //         const res = await this.emailService.sendWelcomeEmail("iamjeffhi67@gmail.com", "Jeff");
    //         response.status(HttpStatusCode.Ok).send(res);
    //     } catch (error) {
    //         response.status(error.status).send(error);
    //     }
    // }


    @UseGuards(JwtPassengerGuard)
    @Post('passenger/sendReportEmailToDeveloper')
    async sendPassengerReportEmailToDeveloper(
        @Body() sendReportEmailDto: SendReportEmailDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.emailService.sendReportEmailToDeveloper("Passenger", sendReportEmailDto);

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            response.status(error.status).send(error);
        }
    }

    @UseGuards(JwtRidderGuard)
    @Post('ridder/sendReportEmailToDeveloper')
    async sendRidderReportEmailToDeveloper(
        @Body() sendReportEmailDto: SendReportEmailDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.emailService.sendReportEmailToDeveloper("Ridder", sendReportEmailDto);

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            response.status(error.status).send(error);
        }
    }
};