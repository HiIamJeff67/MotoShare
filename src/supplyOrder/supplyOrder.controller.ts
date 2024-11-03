import { Controller, Get, Post, Body, Patch, Delete, Query, Res, BadRequestException, UnauthorizedException, UseGuards, NotFoundException } from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { TokenExpiredError } from '@nestjs/jwt';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';

import { JwtRidderGuard } from '../auth/guard';
import { RidderType } from '../interfaces/auth.interface';
import { Ridder } from '../auth/decorator';

import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';

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

      if (!res || res.length === 0) {
        throw new BadRequestException("Cannot create supply order by the current ridder");
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized 
        : (error instanceof BadRequestException
          ? HttpStatusCode.BadRequest
          : HttpStatusCode.UnknownError ?? 520)
      ).send({
        message: error.message,
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

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the supply orders of the current ridder");
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized 
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtRidderGuard)
  @Get('getSupplyOrderById')
  async getSupplyOrderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.getSupplyOrderById(id);

      if (!res || res.length === 0) {
        throw new NotFoundException(`Cannot find the supply order with the given orderId: ${id}`);
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }

  /* ================= Search operations ================= */
  @Get('searchSupplyOrdersByCreatorName')
  async searchSupplyOrdersByCreatorName(
    @Query('userName') userName: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchSupplyOrderByCreatorName(userName, +limit, +offset);

      if (!res || res.length === 0) {
        throw new NotFoundException(`Cannot find the ridder with the given userName: ${userName}`);
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException
        ? HttpStatusCode.NotFound
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @Get('searchPaginationSupplyOrders')
  async searchPaginationSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchPaginationSupplyOrders(+limit, +offset);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find any purchase orders");
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException
        ? HttpStatusCode.NotFound
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @Get('searchCurAdjacentSupplyOrders')
  async searchCurAdjacentSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchCurAdjacentSupplyOrders(+limit, +offset, getAdjacentSupplyOrdersDto);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find any supply orders");
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException
        ? HttpStatusCode.NotFound
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @Get('searchDestAdjacentSupplyOrders')
  async searchDestAdjacentSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchDestAdjacentSupplyOrders(+limit, +offset, getAdjacentSupplyOrdersDto);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find any supply orders");
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException
        ? HttpStatusCode.NotFound
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @Get('searchSimilarRouteSupplyOrders')
  async searchSimilarRouteSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.supplyOrderService.searchSimilarRouteSupplyOrders(+limit, +offset, getSimilarRouteSupplyOrdersDto);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find any supply orders");
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException
        ? HttpStatusCode.NotFound
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
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
      const res = await this.supplyOrderService.updateSupplyOrderById(id, ridder.id, updateSupplyOrderDto);

      if (!res || res.length === 0) {
        throw new NotFoundException(`
          Cannot find any supply orders with the given orderId: ${id}, 
          or the current ridder cannot update the order which is not created by himself/herself
        `);
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
            ? HttpStatusCode.NotFound
            : HttpStatusCode.UnknownError ?? 520)
      ).send({
        message: error.message,
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
      const res = await this.supplyOrderService.deleteSupplyOrderById(id, ridder.id);

      if (!res || res.length === 0) {
        throw new NotFoundException(`
          Cannot find any supply orders with the given orderId: ${id}, 
          or the current ridder cannot delete the order which is not created by himself/herself
        `);
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
            ? HttpStatusCode.NotFound
            : HttpStatusCode.UnknownError ?? 520)
      ).send({
        message: error.message,
      });
    }
  }
  /* ================================= Delete operations ================================= */
}
