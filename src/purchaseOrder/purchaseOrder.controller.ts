import { Controller, 
  Get, Post, Body, Delete, Query, UseGuards, Res, 
  NotFoundException, 
  BadRequestException, 
  UnauthorizedException, 
  ForbiddenException,
  NotAcceptableException,
  Patch
} from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { response, Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException,
  ApiSearchingLimitLessThanZeroException,
  ApiSearchingLimitTooLargeException,
  ClientCreateOrderException,
  ClientCreatePurchaseOrderException,
  ClientPurchaseOrderNotFoundException,
  ClientUnknownException, 
} from '../exceptions';

import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { Passenger, Ridder } from '../auth/decorator';

import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { 
  GetAdjacentPurchaseOrdersDto, 
  GetSimilarRoutePurchaseOrdersDto, 
  GetSimilarTimePurchaseOrderDto
} from './dto/get-purchaseOrder.dto';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';
import { toBoolean, toNumber } from '../utils/stringParser';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';


@Controller('purchaseOrder')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('createPurchaseOrder')
  async createPurchaseOrder(
    @Passenger() passenger: PassengerType,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
    @Res() response: Response,
  ) { 
    try {
      const res = await this.purchaseOrderService.createPurchaseOrderByCreatorId(passenger.id, createPurchaseOrderDto);

      if (!res || res.length === 0) throw ClientCreatePurchaseOrderException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(),
        ...res[0],
      });
    } catch (error) {
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
  // use this route to get detail of a puchase order by the given purchaseOrderId
  @UseGuards(JwtRidderGuard)
  @Get('getPurchaseOrderById')
  async getPurchaseOrderById(
    @Ridder() ridder: RidderType, // only the authenticated ridder can see the details of purchaseOrders
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.purchaseOrderService.getPurchaseOrderById(id);

      if (!res) throw ClientPurchaseOrderNotFoundException;

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
  @UseGuards(JwtPassengerGuard)
  @Get('searchMyPurchaseOrders') // get the purchaseOrder of the passenger
  async searchMyPurchaseOrders(
    @Passenger() passenger: PassengerType,
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

      const res = await this.purchaseOrderService.searchPurchaseOrdersByCreatorId(
        passenger.id, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Get('searchPaginationPurchaseOrders')
  async searchPaginationPurchaseOrders(
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

      const res = await this.purchaseOrderService.searchPaginationPurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Get('searchAboutToStartPurchaseOrders')
  async searchAboutToStartPurchaseOrders(
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

      const res = await this.purchaseOrderService.searchAboutToStartPurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Post('searchSimliarTimePurchaseOrders')
  async searchSimliarTimePurchaseOrders(
    @Query('creatorName') creatorName: string | undefined = undefined, 
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getSimilarTimePurchaseOrderDto: GetSimilarTimePurchaseOrderDto, 
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchSimliarTimePurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getSimilarTimePurchaseOrderDto, 
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Post('searchCurAdjacentPurchaseOrders')
  async searchCurAdjacentPurchaseOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchCurAdjacentPurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getAdjacentPurchaseOrdersDto
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Post('searchDestAdjacentPurchaseOrders')
  async searchDestAdjacentPurchaseOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchDestAdjacentPurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getAdjacentPurchaseOrdersDto
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @Post('searchSimilarRoutePurchaseOrders')
  async searchSimilarRoutePurchaseOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Query('isAutoAccept') isAutoAccept: string = "false", 
    @Body() getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }
      if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
        throw ApiSearchingLimitLessThanZeroException(MIN_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchSimilarRoutePurchaseOrders(
        creatorName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
        toBoolean(isAutoAccept), 
        getSimilarRoutePurchaseOrdersDto
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  /* ================================= Get operations ================================= */
  

  /* ================================= Update operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Patch('updateMyPurchaseOrderById')
  async updateMyPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string, 
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.purchaseOrderService.updatePurchaseOrderById(id, passenger.id, updatePurchaseOrderDto);

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('startPurchaseOrderWithoutInvite')
  async startPurchaseOrderWithoutInvite(
    @Ridder() ridder: RidderType, 
    @Query('id') id: string, 
    @Body() acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.purchaseOrderService.startPurchaseOrderWithoutInvite(
        id,
        ridder.id, 
        ridder.userName, 
        acceptAutoAcceptPurchaseOrderDto, 
      );

      if (!res || res.length === 0) throw ClientCreateOrderException;

      response.status(HttpStatusCode.Ok).send({
        createdAt: new Date(), 
        ...res[0], 
      });
    } catch (error) {
      console.log(error)
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
  /* ================================= Start with AutoAccept PurchaseOrders operations ================================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('cancelMyPurchaseOrderById')
  async cancelMyPurchaseOrderById(
    @Passenger() passenger: PassengerType, 
    @Query('id') id: string, 
    @Res() response: Response, 
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.purchaseOrderService.cancelPurchaseOrderById(
        id, 
        passenger.id, 
        passenger.userName, 
      );

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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

  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMyPurchaseOrderById')
  async deleteMyPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.purchaseOrderService.deletePurchaseOrderById(id, passenger.id);

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

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


  /* ================================= Test operations ================================= */
  @Get('getAllPurchaseOrders')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }

  @Get('testWithExpired')
  async testWithExpired(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchPaginationPurchaseOrdersWithUpdateExpired(true, creatorName, +limit, +offset);

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      console.log(error)
      if (!(error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Get('testWithoutExpired')
  async testWithoutExpired(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLargeException(MAX_SEARCH_LIMIT);
      }

      const res = await this.purchaseOrderService.searchPaginationPurchaseOrdersWithUpdateExpired(false, creatorName, +limit, +offset);

      if (!res || res.length === 0) throw ClientPurchaseOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      console.log(error)
      if (!(error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Test operations ================================= */
}
