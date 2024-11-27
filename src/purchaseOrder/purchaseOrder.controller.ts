import { Controller, 
  Get, Post, Body, Delete, Query, UseGuards, Res, 
  NotFoundException, 
  BadRequestException, 
  UnauthorizedException, 
  ForbiddenException,
  NotAcceptableException
} from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException,
  ApiSearchingLimitTooLarge,
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
  GetSimilarRoutePurchaseOrdersDto 
} from './dto/get-purchaseOrder.dto';
import { MAX_SEARCH_LIMIT } from '../constants';
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
  // @Get('getPurchaseOrderById')
  // getPurchaseOrderById(@Query('id') id: string) {
  //   return this.purchaseOrderService.getPurchaseOrderById(id);
  // }
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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

  @Get('searchCurAdjacentPurchaseOrders')
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
      if (!(error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Get('searchDestAdjacentPurchaseOrders')
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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

  @Get('searchSimilarRoutePurchaseOrders')
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
  @Post('updateMyPurchaseOrderById')
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
        || error instanceof NotFoundException)) {
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
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
