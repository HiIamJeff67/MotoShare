import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';

@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  // note that all the Cron Jobs are using GET Method
  /* ================================= Automated Delete operations ================================= */
  @Get('deleteExpiredPurchaseOrders')
  async deleteExpiredPurchaseOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredPurchaseOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfExpiredPurchaseOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('deleteExpiredSupplyOrders')
  async deleteExpiredSupplyOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfExpiredSupplyOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Delete operations ================================= */


  /* ================================= Test operations ================================= */
  @Get()
  test(@Res() response: Response) {
    response.status(200).send({context: "Hello Vercel Cron"})
  }
  /* ================================= Test operations ================================= */
}
