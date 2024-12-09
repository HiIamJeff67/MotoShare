import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, ForbiddenException, UnauthorizedException, NotFoundException, Query, BadRequestException, NotAcceptableException } from '@nestjs/common';
import { PeriodicSupplyOrderService } from './periodicSupplyOrder.service';
import { CreatePeriodicSupplyOrderDto } from './dto/create-periodicSupplyOrder.dto';
import { UpdatePeriodicSupplyOrderDto } from './dto/update-periodicSupplyOrder.dto';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientCreatePeriodicSupplyOrderException, ClientPeriodicSupplyOrderNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { DaysOfWeekType } from '../types';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';
import { toBoolean, toNumber } from '../utils';

@Controller('periodicSupplyOrder')
export class PeriodicSupplyOrderController {
  constructor(private readonly periodicSupplyOrderService: PeriodicSupplyOrderService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('createMyPeriodicSupplyOrder')
  async createMyPeriodicSupplyOrder(
    @Ridder() ridder: RidderType, 
    @Body() createPeriodicSupplyOrderDto: CreatePeriodicSupplyOrderDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.periodicSupplyOrderService.createPeriodicSupplyOrderByCreatorId(
        ridder.id, 
        createPeriodicSupplyOrderDto
      );

      if (!res || res.length === 0) throw ClientCreatePeriodicSupplyOrderException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      console.log(error)
      if (!(error instanceof ForbiddenException 
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Get('getMyPeriodicSupplyOrderById')
  async getMyPeriodicSupplyOrderById(
    @Ridder() ridder: RidderType, 
    @Query('id') id: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicSupplyOrderService.getPeriodicSupplyOrderById(
        id, 
        ridder.id, 
      );

      if (!res) throw ClientPeriodicSupplyOrderNotFoundException;

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
  @Get('searchMyPaginationPeriodicSupplyOrders')
  async searchMyPaginationPeriodicSupplyOrders(
    @Ridder() ridder: RidderType, 
    @Query('scheduledDay') scheduledDay: DaysOfWeekType | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.periodicSupplyOrderService.searchPaginationPeriodicSupplyOrders(
        ridder.id, 
        scheduledDay, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientPeriodicSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof NotFoundException
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
  @Patch('updateMyPeriodicSupplyOrderById')
  async updateMyPeriodicSupplyOrderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string, 
    @Body() updatePeriodicSupplyOrderDto: UpdatePeriodicSupplyOrderDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicSupplyOrderService.updatePeriodicSupplyOrderById(
        id, 
        ridder.id, 
        updatePeriodicSupplyOrderDto, 
      );

      if (!res || res.length === 0) throw ClientPeriodicSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof BadRequestException
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException
        || error instanceof ForbiddenException)) {
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
  @Delete('deleteMyPeriodicSupplyOrderById')
  async deleteMyPeriodicSupplyOrderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicSupplyOrderService.deletePeriodicSupplyOrderById(
        id, 
        ridder.id
      );

      if (!res || res.length === 0) throw ClientPeriodicSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(),
        ...res[0],
      });
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
