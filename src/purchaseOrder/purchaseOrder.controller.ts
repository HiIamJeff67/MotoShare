import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';

@Controller('purchaseOrder')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  /* ================================= Create operations ================================= */
  @Post('createPurchaseOrderByCreatorId')
  createPurchaseOrderByCreatorId(
    @Query('id') id: string,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) { 
    return this.purchaseOrderService.createPurchaseOrderByCreatorId(id, createPurchaseOrderDto);
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  @Get('getPurchaseOrderById')
  getPurchaseOrderById(@Query('id') id: string) {
    return this.purchaseOrderService.getPurchaseOrderById(id);
  }
  
  @Get('getPurchaseOrdersByCreatorId')
  getPurchaseOrdersByCreatorId(
    @Query('id') id: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
  ) {
    return this.purchaseOrderService.getPurchaseOrdersByCreatorId(id, +limit, +offset);
  }

  @Get('getPurchaseOrders')
  getPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
  ) {
    return this.purchaseOrderService.getPurchaseOrders(+limit, +offset);
  }

  @Get('getCurAdjacentPurchaseOrders')
  getCurAdjacentPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto,
  ) {
    return this.purchaseOrderService.getCurAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);
  }

  @Get('getDestAdjacentPurchaseOrders')
  getDestAdjacentPurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto
  ) {
    return this.purchaseOrderService.getDestAdjacentPurchaseOrders(+limit, +offset, getAdjacentPurchaseOrdersDto);
  }

  @Get('getSimilarRoutePurchaseOrders')
  getSimilarRoutePurchaseOrders(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Body() getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto,
  ) {
    return this.purchaseOrderService.getSimilarRoutePurchaseOrders(+limit, +offset, getSimilarRoutePurchaseOrdersDto);
  }
  /* ================================= Get operations ================================= */
  

  /* ================================= Update operations ================================= */
  @Patch('updatePurchaseOrderById')
  updatePurchaseOrderById(
    @Query('id') id: string, 
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.updatePurchaseOrderById(id, updatePurchaseOrderDto);
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @Delete('deletePurchaseOrderById')
  deletePurchaseOrderById(@Query('id') id: string) {
    return this.purchaseOrderService.deletePurchaseOrderById(id);
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Test operations ================================= */
  @Get('getAllPurchaseOrders')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }
  /* ================================= Test operations ================================= */
}
