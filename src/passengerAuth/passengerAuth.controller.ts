import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UnauthorizedException, NotFoundException, InternalServerErrorException, NotAcceptableException, ConflictException, BadRequestException } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { JwtPassengerGuard } from '../auth/guard';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ClientPassengerNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { ResetPassengerPasswordDto, UpdatePassengerEmailPasswordDto, ValidatePassengerInfoDto } from './dto/update-passengerAuth.dto';

@Controller('passengerAuth')
export class PassengerAuthController {
    constructor(private readonly passengerAuthService: PassengerAuthService) {}

    /* ================================= Send AuthCode ================================= */
    @UseGuards(JwtPassengerGuard)
    @Get('sendAuthCodeForEmail')
    async sendAuthCodeForEmail(
        @Passenger() passenger: PassengerType, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeById(
                passenger.id, 
                "Vailate Your Email"
            );
            
            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }

    @UseGuards(JwtPassengerGuard)
    @Get('sendAuthCodeToResetForgottenPassword')
    async sendAuthCodeToResetForgottenPassword(
        @Passenger() passenger: PassengerType, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeById(
                passenger.id, 
                "Reset Your Password"
            );
            
            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }

    @UseGuards(JwtPassengerGuard)
    @Get('sendAuthCodeToResetEmailOrPassword')
    async sendAuthCodeToResetEmailOrPassword(
        @Passenger() passenger: PassengerType, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeById(
                passenger.id, 
                "Reset Your Email or Password"
            );
            
            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }
    /* ================================= Send AuthCode ================================= */


    /* ================================= Validate AuthCode ================================= */
    @UseGuards(JwtPassengerGuard)
    @Post('validateAuthCodeForEmail')
    async validateAuthCodeForEmail(
        @Passenger() passenger: PassengerType, 
        @Body() validatePassengerInfoDto: ValidatePassengerInfoDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeForEmail(
                passenger.id, 
                validatePassengerInfoDto, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof NotAcceptableException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }

    @UseGuards(JwtPassengerGuard)
    @Post('validateAuthCodeToResetForgottenPassword')
    async validateAuthCodeToResetForgottenPassword(
        @Passenger() passenger: PassengerType, 
        @Body() resetPassengerPasswordDto: ResetPassengerPasswordDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeToResetForgottenPassword(
                passenger.id, 
                resetPassengerPasswordDto, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof NotAcceptableException
                || error instanceof ConflictException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }

    @UseGuards(JwtPassengerGuard)
    @Post('validateAuthCodeToResetEmailOrPassword')
    async validateAuthCodeToResetEmailOrPassword(
        @Passenger() passenger: PassengerType, 
        @Body() updatePassengerEmailPasswordDto: UpdatePassengerEmailPasswordDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeToResetEmailOrPassword(
                passenger.id, 
                updatePassengerEmailPasswordDto, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException
                || error instanceof NotAcceptableException
                || error instanceof ConflictException
                || error instanceof BadRequestException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }
    /* ================================= Validate AuthCode ================================= */
}
