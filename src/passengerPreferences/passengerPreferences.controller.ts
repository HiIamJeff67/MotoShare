import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException, NotAcceptableException, ConflictException } from '@nestjs/common';
import { PassengerPreferencesService } from './passengerPreferences.service';
import { JwtPassengerGuard } from '../auth/guard';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientCreatePassengerPreferenceException, ClientPassengerPreferenceNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { toNumber } from '../utils';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';

@Controller('passengerPreferences')
export class PassengerPreferencesController {
  constructor(private readonly passengerPreferencesService: PassengerPreferencesService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('createMyPreferenceByUserName')
  async createMyPreferenceByUserName(
    @Passenger() passenger: PassengerType, 
    @Query('preferenceUserName') preferenceUserName: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!preferenceUserName) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerPreferencesService.createPassengerPreferenceByPreferenceUserName(
        passenger.id, 
        preferenceUserName, 
      );

      if (!res || res.length === 0) throw ClientCreatePassengerPreferenceException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(), 
      });
    } catch (error) {
      response.status(error.status ?? 500).send({
        case: error.case ?? "E-C-999", 
        message: error.message, 
      });
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Search operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('searchMyPaginationPreferences')
  async searchMyPaginationPreferences(
    @Passenger() passenger: PassengerType, 
    @Query('preferenceUserName') preferenceUserName: string | undefined = undefined, 
    @Query('limit') limit: string = "10", 
    @Query('offset') offset: string = "0", 
    @Res() response: Response, 
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.passengerPreferencesService.searchPaginationPassengerPreferences(
        passenger.id, 
        preferenceUserName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
      );

      if (!res || res.length === 0) throw ClientPassengerPreferenceNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof UnauthorizedException
        || error instanceof NotAcceptableException
        || error instanceof NotFoundException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response, 
      });
    }
  }
  /* ================================= Search operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMyPreferenceByUserName')
  async deleteMyPreferenceByUserName(
    @Passenger() passenger: PassengerType, 
    @Query('preferenceUserName') preferenceUserName: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!preferenceUserName) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerPreferencesService.deletePassengerPreferenceByUserIdAndPreferenceUserId(
        passenger.id, 
        preferenceUserName, 
      );

      if (!res || res.length === 0) throw ClientPassengerPreferenceNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(), 
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException
        || error instanceof BadRequestException
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
