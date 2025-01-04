import { Controller, Get, Post, Body, UseGuards, Res, UnauthorizedException, NotFoundException, InternalServerErrorException, NotAcceptableException, ConflictException, BadRequestException, Put } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { JwtPassengerGuard } from '../auth/guard';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ClientPassengerAuthNotFoundException, ClientPassengerNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { BindPassengerDefaultAuthDto, BindPassengerGoogleAuthDto, ResetPassengerPasswordDto, UpdatePassengerEmailPasswordDto, ValidatePassengerInfoDto } from './dto/update-passengerAuth.dto';
import { SendAuthCodeByEmailDto } from './dto/create-passengerAuth.dto';

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
                "Vailate Your Email",
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

    @Post('sendAuthCodeToResetForgottenPassword')
    async sendAuthCodeToResetForgottenPassword(
        @Body() sendAuthCodeByEmailDto: SendAuthCodeByEmailDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.sendAuthenticationCodeByEmail(
                sendAuthCodeByEmailDto.email, 
                "Reset Your Password",
            );
            
            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof NotFoundException
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
                "Reset Your Email or Password",
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


    /* ================================= Get Operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Get('getMyAuth')
    async getMyAuth(
        @Passenger() passenger: PassengerType, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.getPassengerAuthByUserId(passenger.id);

            if (!res || res.length === 0) throw ClientPassengerAuthNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof UnauthorizedException
                || error instanceof NotFoundException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response, 
            });
        }
    }
    /* ================================= Get Operations ================================= */


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

    @Post('validateAuthCodeToResetForgottenPassword')
    async validateAuthCodeToResetForgottenPassword(
        @Body() resetPassengerPasswordDto: ResetPassengerPasswordDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.validateAuthCodeToResetForgottenPassword(
                resetPassengerPasswordDto, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            console.log(error);
            if (!(error instanceof NotFoundException
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


    /* ================================= Binding Operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Put('bindDefaultAuth')
    async bindDefaultAuth(
        @Passenger() passenger: PassengerType, 
        @Body() bindPassengerDefaultAuthDto: BindPassengerDefaultAuthDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.bindDefaultAuth(
                passenger.id, 
                bindPassengerDefaultAuthDto, 
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
    @Put('bindGoogleAuth')
    async bindGoogleAuth(
        @Passenger() passenger: PassengerType, 
        @Body() bindPassengerGoogleAuthDto: BindPassengerGoogleAuthDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.passengerAuthService.bindGoogleAuth(
                passenger.id, 
                bindPassengerGoogleAuthDto, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            console.log(error);
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
    /* ================================= Binding Operations ================================= */


    /* ================================= Other Operations ================================= */
    // @Put('testBindDefaultAuth')
    // async testBindDefaultAuth(
    //     @Body() bindPassengerDefaultAuthDto: BindPassengerDefaultAuthDto, 
    //     @Res() response: Response, 
    // ) {
    //     try {
    //         const res = await this.passengerAuthService.bindDefaultAuth(
    //             "e711fedc-6d68-4e61-b1e4-eace4294b321", 
    //             bindPassengerDefaultAuthDto, 
    //         );

    //         if (!res || res.length === 0) throw ClientPassengerNotFoundException;

    //         response.status(HttpStatusCode.Ok).send(res[0]);
    //     } catch (error) {
    //         console.log(error)
    //         if (!(error instanceof UnauthorizedException
    //             || error instanceof NotFoundException
    //             || error instanceof NotAcceptableException
    //             || error instanceof ConflictException)) {
    //                 error = ClientUnknownException;
    //         }

    //         response.status(error.status).send({
    //             ...error.response, 
    //         });
    //     }
    // }
    /* ================================= Other Operations ================================= */
}
