import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, ForbiddenException, UnauthorizedException, NotFoundException, Query, BadRequestException, NotAcceptableException } from '@nestjs/common';
import { PeriodicPurchaseOrderService } from './periodicPurchaseOrder.service';
import { CreatePeriodicPurchaseOrderDto } from './dto/create-periodicPurchaseOrder.dto';
import { UpdatePeriodicPurchaseOrderDto } from './dto/update-periodicPurchaseOrder.dto';
import { JwtPassengerGuard } from '../auth/guard';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ApiMissingParameterException, ApiSearchingLimitLessThanZeroException, ApiSearchingLimitTooLargeException, ClientCreatePeriodicPurchaseOrderException, ClientPeriodicPurchaseOrderNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { toBoolean, toNumber } from '../utils';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';
import { DaysOfWeekType } from '../types';

@Controller('periodicPurchaseOrder')
export class PeriodicPurchaseOrderController {
  constructor(private readonly periodicPurchaseOrderService: PeriodicPurchaseOrderService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('createMyPeriodicPurchaseOrder')
  async createMyPeriodicPurchaseOrder(
    @Passenger() passenger: PassengerType, 
    @Body() createPeriodicPurchaseOrderDto: CreatePeriodicPurchaseOrderDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.periodicPurchaseOrderService.createPeriodicPurchaseOrderByCreatorId(
        passenger.id, 
        createPeriodicPurchaseOrderDto
      );

      if (!res || res.length === 0) throw ClientCreatePeriodicPurchaseOrderException;

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
  @UseGuards(JwtPassengerGuard)
  @Get('getMyPeriodicPurchaseOrderById')
  async getMyPeriodicPurchaseOrderById(
    @Passenger() passenger: PassengerType, 
    @Query('id') id: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicPurchaseOrderService.getPeriodicPurchaseOrderById(
        id, 
        passenger.id, 
      );

      if (!res) throw ClientPeriodicPurchaseOrderNotFoundException;

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
  @UseGuards(JwtPassengerGuard)
  @Get('searchMyPaginationPeriodicPurchaseOrders')
  async searchMyPaginationPeriodicPurchaseOrders(
    @Passenger() passenger: PassengerType, 
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

      const res = await this.periodicPurchaseOrderService.searchPaginationPeriodicPurchaseOrders(
        passenger.id, 
        scheduledDay, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientPeriodicPurchaseOrderNotFoundException;

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
  @UseGuards(JwtPassengerGuard)
  @Patch('updateMyPeriodicPurchaseOrderById')
  async updateMyPeriodicPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string, 
    @Body() updatePeriodicPurchaseOrderDto: UpdatePeriodicPurchaseOrderDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicPurchaseOrderService.updatePeriodicPurchaseOrderById(
        id, 
        passenger.id, 
        updatePeriodicPurchaseOrderDto, 
      );

      if (!res || res.length === 0) throw ClientPeriodicPurchaseOrderNotFoundException;

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
  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMyPeriodicPurchaseOrderById')
  async deleteMyPeriodicPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.periodicPurchaseOrderService.deletePeriodicPurchaseOrderById(
        id, 
        passenger.id
      );

      if (!res || res.length === 0) throw ClientPeriodicPurchaseOrderNotFoundException;

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
