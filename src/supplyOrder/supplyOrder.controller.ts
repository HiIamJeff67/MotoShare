import { Controller, 
  Get, Post, Body, Patch, Delete, Query, Res, UseGuards,
  BadRequestException, 
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException} from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException,
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
  GetSimilarRouteSupplyOrdersDto 
} from './dto/get-supplyOrder.dto';

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
  @UseGuards(JwtRidderGuard)
  @Get('getMySupplyOrders')
  async getMySupplyOrders(
    @Ridder() ridder: RidderType,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.getSupplyOrdersByCreatorId(ridder.id, +limit, +offset);

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
  @Get('searchPaginationSupplyOrders')
  async searchPaginationSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchPaginationSupplyOrders(creatorName, +limit, +offset);

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Get('searchCurAdjacentSupplyOrders')
  async searchCurAdjacentSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchCurAdjacentSupplyOrders(
        creatorName, 
        +limit, 
        +offset, 
        getAdjacentSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Get('searchDestAdjacentSupplyOrders')
  async searchDestAdjacentSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchDestAdjacentSupplyOrders(
        creatorName,
        +limit, 
        +offset, 
        getAdjacentSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @Get('searchSimilarRouteSupplyOrders')
  async searchSimilarRouteSupplyOrders(
    @Query('creatorName') creatorName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchSimilarRouteSupplyOrders(
        creatorName,
        +limit, 
        +offset, 
        getSimilarRouteSupplyOrdersDto
      );

      if (!res || res.length === 0) throw ClientSupplyOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
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
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
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
