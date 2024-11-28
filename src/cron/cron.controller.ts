import { Controller, Get, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';
import { CronAuth } from '../decorators/cronAuth.decorator';

@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  // note that all the Cron Jobs are using GET Method
  // make sure the init route in vercel.json is like: "path": "/api/cron", (with "/" in the head)
  // and also make sure that all the subroute should have "/" at their head as well
  /* ================================= Automated Update operations ================================= */
  @Get('/updateToExpiredPurchaseOrders')
  @CronAuth()
  async updateToExpiredPurchaseOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.updateToExpiredPurchaseOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfExpiredPurchaseOrders: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/updateToExpiredSupplyOrders')
  @CronAuth()
  async updateToExpiredSupplyOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.updateToExpiredSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfExpiredSupplyOrders: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/updateToExpiredPassengerInvites')
  @CronAuth()
  async updateToExpiredPassengerInvites(@Res() response: Response) {
    try {
      const res = await this.cronService.updateToExpiredPassengerInvites();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfExpiredPassengerInvites: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/updateToExpiredRidderInvites')
  @CronAuth()
  async updateToExpiredRidderInvites(@Res() response: Response) {
    try {
      const res = await this.cronService.updateToExpiredRidderInvites();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfExpiredRidderInvites: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/updateToStartedOrders')
  @CronAuth()
  async updateToStartedOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.updateToStartedOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfStartedOrders: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Update operations ================================= */

  
  /* ================================= Automated Delete operations ================================= */
  @Get('/deleteExpiredPurchaseOrders')
  @CronAuth()
  async deleteExpiredPurchaseOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredPurchaseOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfDeletedPurchaseOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/deleteExpiredSupplyOrders')
  @CronAuth()
  async deleteExpiredSupplyOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfDeletedSupplyOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/deleteExpiredPassengerInvites')
  @CronAuth()
  async deleteExpiredPassengerInvites(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredPassengerInvites();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfDeletedPassengerInvites: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/deleteExpiredRidderInvites')
  @CronAuth()
  async deleteExpiredRidderInvites(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredRidderInvites();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfDeletedRidderInvites: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('/deleteExpiredOrders')
  @CronAuth()
  async deleteExpiredOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfDeletedOrders: res.length, 
      });
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
