import { BadRequestException, Controller, Delete, Get, NotAcceptableException, NotFoundException, Patch, Query, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { PassengerNotificationService } from "./passenerNotification.service";
import { JwtPassengerGuard, JwtRidderGuard } from "../auth/guard";
import { Passenger } from "../auth/decorator";
import { PassengerType } from "../interfaces";
import { Response } from "express";
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientPassengerNotificationNotFoundException, ClientUnknownException } from "../exceptions";
import { HttpStatusCode } from "../enums";
import { toNumber } from "../utils";
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from "../constants";

@Controller('passengerNotification')
export class PassengerNotificationController {
    constructor(private readonly passengerNotificationService: PassengerNotificationService) {}

    /* ================================= Get operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Get('getMyPassengerNotificationById')
    async getMyPassengerNotificationById(
        @Passenger() passenger: PassengerType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.passengerNotificationService.getPassengerNotificationById(
                id, 
                passenger.id, 
            );

            if (!res || res.length === 0) ClientPassengerNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof BadRequestException 
                || error instanceof UnauthorizedException 
                || error instanceof NotFoundException)) {
                  error = ClientUnknownException;
            }
        
            response.status(error.status).send({
                ...error.response,
            });
        }
    }

    /* ================================= Search operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Get('searchMyPaginationPassengerNotifications')
    async searchMyPaginationPassengerNotifications(
        @Passenger() passenger: PassengerType, 
        @Query('limit') limit = "10", 
        @Query('offset') offset = "0", 
        @Res() response: Response, 
    ) {
        try {
            if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
                throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
            }
            if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
                throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
            }

            const res = await this.passengerNotificationService.searchPaginationPassengerNotifications(
                passenger.id, 
                toNumber(limit, true), 
                toNumber(offset, true), 
            );

            if (!res || res.length === 0) throw ClientPassengerNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof UnauthorizedException 
                || error instanceof NotFoundException
                || error instanceof NotAcceptableException)) {
                  error = ClientUnknownException;
            }
        
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Search operations ================================= */

    /* ================================= Get operations ================================= */


    /* ================================= Update operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Patch('updateMyPassengerNotificationToReadStatus')
    async updateMyPassengerNotificationToReadStatus(
        @Passenger() passenger: PassengerType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.passengerNotificationService.updatePassengerNotificationToReadStatus(
                id, 
                passenger.id, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof UnauthorizedException 
                || error instanceof NotFoundException)) {
                    error = ClientUnknownException;
            }
        
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Update operations ================================= */


    /* ================================= Delete operations ================================= */
    @UseGuards(JwtPassengerGuard)
    @Delete('deleteMyPassengerNotification')
    async deleteMyPassengerNotifications(
        @Passenger() passenger: PassengerType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.passengerNotificationService.deletePassengerNotification(
                id, 
                passenger.id, 
            );

            if (!res || res.length === 0) throw ClientPassengerNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res[0]);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof UnauthorizedException 
                || error instanceof NotFoundException)) {
                    error = ClientUnknownException;
            }
        
            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Delete operations ================================= */
}