import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { CreateSupplyOrderDto } from './dto/create-supplyOrder.dto';
import { UpdateSupplyOrderDto } from './dto/update-supplyOrder.dto';
import { GetAdjacentSupplyOrdersDto, GetSimilarRouteSupplyOrdersDto } from './dto/get-supplyOrder.dto';

@Controller('supplyOrder')
export class SupplyOrderController {
  constructor(private readonly supplyOrderService: SupplyOrderService) {}

  /* ================================= Create operations ================================= */
  @Post('createSupplyOrderByCreatorId')
  create(
    @Query('id') id: string,
    @Body() createSupplyOrderDto: CreateSupplyOrderDto,
  ) {
    return this.supplyOrderService.createSupplyOrderByCreatorId(id, createSupplyOrderDto);
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  @Get('getSupplyOrderById')
  getSupplyOrderById(@Query('id') id: string) {
    return this.supplyOrderService.getSupplyOrderById(id);
  }

  @Get('getSupplyOrdersByCreatorId')
  getSupplyOrdersByCreatorId(
    @Query('id') id: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
  ) {
    return this.supplyOrderService.getSupplyOrdersByCreatorId(id, +limit, +offset);
  }

  @Get('getSupplyOrders')
  getSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
  ) {
    return this.supplyOrderService.getSupplyOrders(+limit, +offset);
  }

  @Get('getCurAdjacentSupplyOrders')
  getCurAdjacentSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto,
  ) {
    return this.supplyOrderService.getCurAdjacentSupplyOrders(+limit, +offset, getAdjacentSupplyOrdersDto);
  }

  @Get('getDestAdjacentSupplyOrders')
  getDestAdjacentSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentSupplyOrdersDto: GetAdjacentSupplyOrdersDto
  ) {
    return this.supplyOrderService.getDestAdjacentSupplyOrders(+limit, +offset, getAdjacentSupplyOrdersDto);
  }

  @Get('getSimilarRouteSupplyOrders')
  getSimilarRouteSupplyOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getSimilarRouteSupplyOrdersDto: GetSimilarRouteSupplyOrdersDto,
  ) {
    return this.supplyOrderService.getSimilarRouteSupplyOrders(+limit, +offset, getSimilarRouteSupplyOrdersDto);
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @Patch('updateSupplyOrderById')
  updateSupplyOrderById(
    @Query('id') id: string,
    @Body() updateSupplyOrderDto: UpdateSupplyOrderDto,
  ) {
    return this.supplyOrderService.updateSupplyOrderById(id, updateSupplyOrderDto);
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @Delete('deleteSupplyOrderById')
  deleteSupplyOrderById(@Query('id') id: string) {
    return this.supplyOrderService.deleteSupplyOrderById(id);
  }
  /* ================================= Delete operations ================================= */
}
