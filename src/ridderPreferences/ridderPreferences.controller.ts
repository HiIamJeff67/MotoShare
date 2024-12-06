import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { RidderPreferencesService } from './ridderPreferences.service';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientCreateRidderPreferenceException, ClientRidderPreferenceNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from 'axios';
import { toNumber } from '../utils';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';

@Controller('ridderPreferences')
export class RidderPreferencesController {
  constructor(private readonly ridderPreferencesService: RidderPreferencesService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('createMyPreferenceByUserName')
  async createMyPreferenceByUserName(
    @Ridder() ridder: RidderType, 
    @Query('preferenceUserName') preferenceUserName: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!preferenceUserName) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderPreferencesService.createRidderPreferenceByPreferenceUserName(
        ridder.id, 
        preferenceUserName, 
      );

      if (!res || res.length === 0) throw ClientCreateRidderPreferenceException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(), 
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException 
        || error instanceof BadRequestException 
        || error instanceof ForbiddenException 
        || error instanceof NotFoundException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response, 
      });
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Search operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Get('searchMyPaginationPreferences')
  async searchMyPaginationPreferences(
    @Ridder() ridder: RidderType, 
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

      const res = await this.ridderPreferencesService.searchPaginationRidderPreferences(
        ridder.id, 
        preferenceUserName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
      );

      if (!res || res.length === 0) throw ClientRidderPreferenceNotFoundException;

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
  @UseGuards(JwtRidderGuard)
  @Delete('deleteMyPreferenceByUserName')
  async deleteMyPreferenceByUserName(
    @Ridder() ridder: RidderType, 
    @Query('preferenceUserName') preferenceUserName: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!preferenceUserName) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderPreferencesService.deleteRidderPreferenceByUserIdAndPreferenceUserId(
        ridder.id, 
        preferenceUserName, 
      );

      if (!res || res.length === 0) throw ClientRidderPreferenceNotFoundException;

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
