import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';

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
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.purchaseOrderService.getPurchaseOrdersByCreatorId(id, +limit, +offset);
  }

  @Get('getPurchaseOrders')
  getPurchaseOrders(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(+limit, +offset);
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


  /* ================================= Other operations ================================= */
  @Get('getAllPurchaseOrders')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }
  /* ================================= Other operations ================================= */
}
