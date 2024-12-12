import { Controller, 
  Get, Post, Body, Delete, Query, Res, UseGuards,
  BadRequestException, 
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException,
  NotAcceptableException,
  Patch} from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException,
  ApiSearchingLimitLessThanZeroException,
  ApiSearchingLimitTooLargeException,
  ApiWrongSearchPriorityTypeException,
  ClientCreateOrderException,
  ClientCreateSupplyOrderException,
  ClientSupplyOrderNotFoundException,
  ClientUnknownException, 
} from '../exceptions';

import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { Passenger, Ridder } from '../auth/decorator';

import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { 
  GetAdjacentSupplyOrdersDto, 
  GetBetterSupplyOrderDto, 
  GetSimilarRouteSupplyOrdersDto, 
  GetSimilarTimeSupplyOrderDto
} from './dto/get-supplyOrder.dto';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';
import { toBoolean, toNumber } from '../utils/stringParser';
import { AcceptAutoAcceptSupplyOrderDto } from './dto/accept-supplyOrder.dto';
import { SearchPriorityType, SearchPriorityTypes } from '../types';

@Controller('supplyOrder')
export class SupplyOrderController {
  constructor(private readonly supplyOrderService: SupplyOrderService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('createSupplyOrder')
  async createSupplyOrder(
    @Ridder() ridder: RidderType,
    @Body() createSupplyOrderDto: CreateSupplyOrderDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.createSupplyOrderByCreatorId(ridder.id, createSupplyOrderDto);

      if (!res || res.length === 0) throw ClientCreateSupplyOrderException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof ForbiddenException 
        || error instanceof UnauthorizedException)) {
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
  @Get('getSupplyOrderById')
  async getSupplyOrderById(
    @Passenger() passenger: PassengerType,  // only the authenticated passenger can see the details of supplyOrders
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }
      
      const res = await this.supplyOrderService.getSupplyOrderById(id);

      if (!res) throw ClientSupplyOrderNotFoundException;

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

  /* ================= Search operations ================= */
  @UseGuards(JwtRidderGuard)
  @Get('searchMySupplyOrders')
  async searchMySupplyOrders(
    @Ridder() ridder: RidderType,
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

      const res = await this.supplyOrderService.searchSupplyOrdersByCreatorId(
        ridder.id, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
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

  @Get('searchPaginationSupplyOrders')
  async searchPaginationSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
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

      const res = await this.supplyOrderService.searchPaginationSupplyOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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

  @Get('searchAboutToStartSupplyOrders')
  async searchAboutToStartSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
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

      const res = await this.supplyOrderService.searchAboutToStartSupplyOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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

  @Post('searchSimilarTimeSupplyOrders')
  async seachSimilarTimeSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined, 
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getSimilarTimeSupplyOrderDto: GetSimilarTimeSupplyOrderDto, 
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.supplyOrderService.searchSimilarTimeSupplyOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getSimilarTimeSupplyOrderDto, 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      console.log(error);
      if (!(error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Post('searchCurAdjacentSupplyOrders')
  async searchCurAdjacentSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.supplyOrderService.searchCurAdjacentSupplyOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getAdjacentSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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

  @Post('searchDestAdjacentSupplyOrders')
  async searchDestAdjacentSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.supplyOrderService.searchDestAdjacentSupplyOrders(
        creatorName,
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getAdjacentSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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

  @Post('searchSimilarRouteSupplyOrders')
  async searchSimilarRouteSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.supplyOrderService.searchSimilarRouteSupplyOrders(
        creatorName,
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getSimilarRouteSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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
  /* ================= Search operations ================= */

  /* ================= Powerful Search operations ================= */
  @Post('searchBetterFirstSupplyOrders')
  async searchBetterFirstSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Query('searchPriorities') searchPriorities: SearchPriorityType = "RTSDU", 
    @Body() getBetterSupplyOrderDto: GetBetterSupplyOrderDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }
      if (!SearchPriorityTypes.includes(searchPriorities)) {
        throw ApiWrongSearchPriorityTypeException;
      }

      const res = await this.supplyOrderService.searchBetterFirstSupplyOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getBetterSupplyOrderDto, 
        searchPriorities, 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      console.log(error)
      if (!(error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================= Powerful Search operations ================= */

  /* ================================= Get operations ================================= */



  /* ================================= Update operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Patch('updateMySupplyOrderById')
  async updateMySupplyOrderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Body() updateSupplyOrderDto: UpdateSupplyOrderDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.supplyOrderService.updateSupplyOrderById(id, ridder.id, updateSupplyOrderDto);

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
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

  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('startSupplyOrderWithoutInvite')
  async startSupplyOrderWithoutInvite(
    @Passenger() passenger: PassengerType, 
    @Query('id') id: string, 
    @Body() acceptAutoAcceptSupplyOrder: AcceptAutoAcceptSupplyOrderDto, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.supplyOrderService.startSupplyOrderWithoutInvite(
        id, 
        passenger.id, 
        passenger.userName, 
        acceptAutoAcceptSupplyOrder, 
      );

      if (!res || res.length === 0) throw ClientCreateOrderException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(), 
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
  /* ================================= Start with AutoAccept SupplyOrders operations ================================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Delete('cancelMySupplyOrderById')
  async cancelMySupplyOrderById(
    @Ridder() ridder: RidderType, 
    @Query('id') id: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.supplyOrderService.cancelSupplyOrderById(
        id, 
        ridder.id, 
        ridder.userName, 
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        canceled: new Date(), 
        ...res[0], 
      })
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

  @UseGuards(JwtRidderGuard)
  @Delete('deleteMySupplyOrderById')
  async deleteMySupplyOrderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.supplyOrderService.deleteSupplyOrderById(id, ridder.id);

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

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
