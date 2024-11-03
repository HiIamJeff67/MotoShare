import { Controller, Get, Post, Body, Patch, Delete, Query, UseGuards, Req, Res, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { TokenExpiredError } from '@nestjs/jwt';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';

import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { PassengerType } from '../interfaces/auth.interface';
import { Passenger } from '../auth/decorator';

import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';

@Controller('purchaseOrder')
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

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

      if (!res || res.length === 0) {
        throw new BadRequestException("Cannot create purchase order by the current passenger");
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
  // @Get('getPurchaseOrderById')
  // getPurchaseOrderById(@Query('id') id: string) {
  //   return this.purchaseOrderService.getPurchaseOrderById(id);
  // }
  @UseGuards(JwtPassengerGuard)
  @Get('getMyPurchaseOrders') // get the purchaseOrder of the passenger
  async getMyPurchaseOrders(
    @Passenger() passenger: PassengerType,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.getPurchaseOrdersByCreatorId(passenger.id, +limit, +offset);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the purchase orders of the current passenger");
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

  // use this route to get detail of a puchase order by the given purchaseOrderId
  @UseGuards(JwtPassengerGuard)
  @Get('getPurchaseOrderById')
  async getPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.getPurchaseOrderById(id);

      if (!res || res.length === 0) {
        throw new NotFoundException(`Cannot find the purchase order with the given orderId: ${id}`);
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
  @Get('searchPurchaseOrdersByCreatorName')
  async searchPurchaseOrdersByCreatorName(
    @Query('userName') userName: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.searchPurchaseOrderByCreatorName(userName, +limit, +offset);

      if (!res || res.length === 0) {
        throw new NotFoundException(`Cannot find the passenger with the given userName: ${userName}`);
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

  @Get('searchPaginationPurchaseOrders')
  async searchPaginationPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.searchPaginationPurchaseOrders(+limit, +offset);

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

  @Get('searchCurAdjacentPurchaseOrders')
  async searchCurAdjacentPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.searchCurAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);

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

  @Get('searchDestAdjacentPurchaseOrders')
  async searchDestAdjacentPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.searchDestAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);

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

  @Get('searchSimilarRoutePurchaseOrders')
  async searchSimilarRoutePurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.searchSimilarRoutePurchaseOrders(+limit, +offset, getSimilarRoutePurchaseOrdersDto);

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
      const res = await this.purchaseOrderService.updatePurchaseOrderById(id, passenger.id, updatePurchaseOrderDto);

      if (!res || res.length === 0) {
        throw new NotFoundException(`
          Cannot find any purchase orders with the given orderId: ${id}, 
          or the current passenger cannot update the order which is not created by himself/herself
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
  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMyPurchaseOrderById')
  async deleteMyPurchaseOrderById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.purchaseOrderService.deletePurchaseOrderById(id, passenger.id);

      if (!res || res.length === 0) {
        throw new NotFoundException(`
          Cannot find any purchase orders with the given orderId: ${id}, 
          or the current passenger cannot delete the order which is not created by himself/herself
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


  /* ================================= Test operations ================================= */
  @Get('getAllPurchaseOrders')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }
  /* ================================= Test operations ================================= */
}
