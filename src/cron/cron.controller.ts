import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Delete('deleteExpiredPurchaseOrdersOrSupplyOrders')
  async deleteExpiredPurchaseOrdersOrSupplyOrders(@Res() response: Response) {
    try {
      const responseOfDeletingExpiredPurchaseOrders = await this.cronService.deleteExpiredPurchaseOrders();
      const responseOfDeletingExpiredSupplyOrders = await this.cronService.deleteExpiredSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        countOfExpiredPurchaseOrders: responseOfDeletingExpiredPurchaseOrders.length, 
        countOfExpiredSupplyORders: responseOfDeletingExpiredSupplyOrders.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
}
