import { BadRequestException, Controller, Delete, Get, NotAcceptableException, NotFoundException, Patch, Query, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RidderNotificationService } from "./ridderNotification.service";
import { JwtRidderGuard } from "../auth/guard";
import { Ridder } from "../auth/decorator";
import { RidderType } from "../interfaces";
import { Response } from "express";
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientRidderNotificationNotFoundException, ClientUnknownException } from "../exceptions";
import { HttpStatusCode } from "axios";
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from "../constants";
import { toNumber } from "../utils";

@Controller('ridderNotification')
export class RidderNotificationController {
    constructor(private ridderNotificationService: RidderNotificationService) {}

    /* ================================= Get operations ================================= */
    @UseGuards(JwtRidderGuard)
    @Get('getMyNotifications')
    async getMyNotifications(
        @Ridder() ridder: RidderType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.ridderNotificationService.getRidderNotificationById(
                id, 
                ridder.id, 
            );

            if (!res || res.length === 0) ClientRidderNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res);
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
    @UseGuards(JwtRidderGuard)
    @Get('searchMyPaginationRidderNotifications')
    async searchMyPaginationRidderNotifications(
        @Ridder() ridder: RidderType, 
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

            const res = await this.ridderNotificationService.searchPaginationRidderNotifications(
                ridder.id, 
                toNumber(limit, true), 
                toNumber(offset, true), 
            );

            if (!res || res.length === 0) throw ClientRidderNotificationNotFoundException;

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
    @UseGuards(JwtRidderGuard)
    @Patch('updateMyRidderNotificationToReadStatus')
    async updateMyRidderNotificationToReadStatus(
        @Ridder() ridder: RidderType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.ridderNotificationService.updateRidderNotificationToReadStatus(
                id, 
                ridder.id, 
            );

            if (!res || res.length === 0) throw ClientRidderNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res);
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
    @UseGuards(JwtRidderGuard)
    @Delete('deleteMyRidderNotification')
    async deleteMyRidderNotifications(
        @Ridder() ridder: RidderType, 
        @Query('id') id: string, 
        @Res() response: Response, 
    ) {
        try {
            if (!id) {
                throw ApiMissingParameterException;
            }

            const res = await this.ridderNotificationService.deleteRidderNotification(
                id, 
                ridder.id, 
            );

            if (!res || res.length === 0) throw ClientRidderNotificationNotFoundException;

            response.status(HttpStatusCode.Ok).send(res);
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