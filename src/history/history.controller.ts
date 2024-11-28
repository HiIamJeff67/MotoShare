import { Controller, Get, Post, Body, Delete, UseGuards, Query, Res, BadRequestException, UnauthorizedException, NotFoundException, NotAcceptableException, Patch } from '@nestjs/common';
import { HistoryService } from './history.service';
import { RateAndCommentHistoryDto } from './dto/update-history.dto';
import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { Passenger, Ridder } from '../auth/decorator';
import { PassengerType, RidderType } from '../interfaces';
import { Response } from 'express';
import { ApiMissingParameterException, ApiSearchingLimitTooLarge, ClientHistoryNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { MAX_SEARCH_LIMIT } from '../constants';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  /* ================================= Get operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/getHistoryById')
  async getHistoryForPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.getHistoryById(id, passenger.id);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      console.log(error)
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

  @UseGuards(JwtRidderGuard)
  @Get('ridder/getHistoryById')
  async getHistoryForRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.getHistoryById(id, ridder.id);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

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

  /* ================= Search operations ================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchPaginationHistories')
  async searchPaginationHistoriesByPassengerId(
    @Passenger() passenger: PassengerType,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
      }

      const res = await this.historyService.searchPaginationHistoryByPassengerId(passenger.id, +limit, +offset);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof UnauthorizedException 
        || error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
          error = ClientUnknownException;
      }
      
      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @UseGuards(JwtRidderGuard)
  @Get('ridder/searchPaginationHistories')
  async searchPaginationHistoriesByRidderId(
    @Ridder() ridder: RidderType,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
      }

      const res = await this.historyService.searchPaginationHistoryByRidderId(ridder.id, +limit, +offset);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof UnauthorizedException 
        || error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
          error = ClientUnknownException;
      }
      
      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Patch('passenger/rateAndCommentHistoryById')
  async rateAndCommentHistoryForPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Body() rateAndCommentHistoryDto: RateAndCommentHistoryDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.rateAndCommentHistoryForPassengerById(id, passenger.id, rateAndCommentHistoryDto);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

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

  @UseGuards(JwtRidderGuard)
  @Patch('ridder/rateAndCommentHistoryById')
  async rateAndCommentHistoryForRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Body() rateAndCommentHistoryDto: RateAndCommentHistoryDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.rateAndCommentHistoryForRidderById(id, ridder.id, rateAndCommentHistoryDto);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

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
  @Delete('passenger/delinkHistoryById')
  async delinkHistoryForPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.delinkHistoryByPassengerId(id, passenger.id);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

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

  @UseGuards(JwtRidderGuard)
  @Delete('ridder/delinkHistoryById')
  async delinkHistoryForRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.historyService.delinkHistoryByRidderId(id, ridder.id);

      if (!res || res.length === 0) throw ClientHistoryNotFoundException;

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
