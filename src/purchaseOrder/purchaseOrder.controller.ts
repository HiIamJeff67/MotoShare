import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';

@Controller('purchaseOrder')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post('createPurchaseOrder')
  createPurchaseOrder(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.createPurchaseOrder(createPurchaseOrderDto);
  }

  @Get('getPurchaseOrderById/:id')
  getPurchaseOrderById(@Param('id') id: string) {
    return this.purchaseOrderService.getPurchaseOrderById(id);
  }
  
  @Get('getPurchaseOrderByCreatorId/:creatorId')
  getPurchaseOrderByCreatorId(@Param('creatorId') creatorId: string) {
    return this.purchaseOrderService.getPurchaseOrderByCreatorId(creatorId);
  }

  @Get('getAllPurchaseOrders')
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(+id);
  }
}
