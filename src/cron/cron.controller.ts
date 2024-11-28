import { Controller, Get, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { response, Response } from 'express';
import { HttpStatusCode } from '../enums';
import { CronAuth } from '../decorators/cronAuth.decorator';

@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  // note that all the Cron Jobs are using GET Method
  // make sure the init route in vercel.json is like: "path": "/api/cron", (with "/" in the head)
  // and also make sure that all the subroute should have "/" at their head as well
  /* ================================= Automated Update operations ================================= */
  private async updateToExpiredPurchaseOrders(@Res() response: Response) {
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

  private async updateToExpiredSupplyOrders(@Res() response: Response) {
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

  private async updateToExpiredPassengerInvites(@Res() response: Response) {
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

  private async updateToExpiredRidderInvites(@Res() response: Response) {
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

  private async updateToStartedOrders(@Res() response: Response) {
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

  /* ================================= Automated Update Cron Job Workflow ================================= */
  // since we are using free plan on vercel server, we can only use up to two Cron Jobs...
  // hence we collect all the operations to two main parts corresponding to two api routes, 
  // one for automated update operations, another for automated delete operations
  @Get('/updateCronJobsWorkflow')
  @CronAuth()
  async updateCronJobsWorkflow(@Res() response: Response) {
    try {

      const responseOfUpdatingToExpiredPurchaseOrders = await this.cronService.updateToExpiredPurchaseOrders();
      const responseOfUpdatingToExpiredSupplyOrders = await this.cronService.updateToExpiredSupplyOrders();
      const responseOfUpdatingToExpiredPassengerInvites = await this.cronService.updateToExpiredPassengerInvites();
      const responseOfUpdatingToExpiredRidderInvites = await this.cronService.updateToExpiredRidderInvites();
      const responseOfUpdatingToStatedOrders = await this.cronService.updateToStartedOrders();
      
      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        message: "All the specified Cron Jobs are done", 
        jobs: {
          updateToExpiredPurchaseOrders: Boolean(responseOfUpdatingToExpiredPurchaseOrders), 
          updateToExpiredSupplyOrders: Boolean(responseOfUpdatingToExpiredSupplyOrders), 
          updateToExpiredPassengerInvites: Boolean(responseOfUpdatingToExpiredPassengerInvites), 
          updateToExpiredRidderInvites: Boolean(responseOfUpdatingToExpiredRidderInvites), 
          updateToStartedOrders: Boolean(responseOfUpdatingToStatedOrders), 
        }, 
        dataCounts: {
          numberOfExpiredPurchaseOrders: responseOfUpdatingToExpiredPurchaseOrders.length, 
          numberOfExpiredSupplyOrders: responseOfUpdatingToExpiredSupplyOrders.length, 
          numberOfExpiredPassengerInvites: responseOfUpdatingToExpiredPassengerInvites.length, 
          numberOfExpiredRidderInvites: responseOfUpdatingToExpiredRidderInvites.length, 
          numberOfStartedOrders: responseOfUpdatingToStatedOrders.length, 
        }, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Update Cron Job Workflow ================================= */

  /* ================================= Automated Update operations ================================= */

  
  /* ================================= Automated Delete operations ================================= */
  private async deleteExpiredPurchaseOrders(@Res() response: Response) {
     try {
      const res = await this.cronService.deleteExpiredPurchaseOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfDeletedPurchaseOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  private async deleteExpiredSupplyOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.deleteExpiredSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        numberOfDeletedSupplyOrders: res.length, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  private async deleteExpiredPassengerInvites(@Res() response: Response) {
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

  private async deleteExpiredRidderInvites(@Res() response: Response) {
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

  private async deleteExpiredOrders(@Res() response: Response) {
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

  /* ================================= Automated Delete Cron Job Workflow ================================= */
  @Get('/deleteCronJobsWorkflow')
  @CronAuth()
  async deleteCronJobsWorkflow(@Res() response: Response) {
    try {

      const responseOfDeleteExpiredPurchaseOrders = await this.cronService.deleteExpiredPurchaseOrders();
      const responseOfDeleteExpiredSupplyOrders = await this.cronService.deleteExpiredSupplyOrders();
      const responseOfDeleteExpiredPassengerInvites = await this.cronService.deleteExpiredPassengerInvites();
      const responseOfDeleteExpiredRidderInvites = await this.cronService.deleteExpiredRidderInvites();
      const responseOfDeleteExpiredOrders = await this.cronService.deleteExpiredOrders();
      
      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(), 
        message: "All the specified Cron Jobs are done", 
        jobs: {
          deleteExpiredPurchaseOrders: Boolean(responseOfDeleteExpiredPurchaseOrders), 
          deleteExpiredSupplyOrders: Boolean(responseOfDeleteExpiredSupplyOrders), 
          deleteExpiredPassengerInvites: Boolean(responseOfDeleteExpiredPassengerInvites), 
          deleteExpiredRidderInvites: Boolean(responseOfDeleteExpiredRidderInvites), 
          deleteExpiredOrders: Boolean(responseOfDeleteExpiredOrders), 
        }, 
        dataCount: {
          numberOfExpiredPurchaseOrders: responseOfDeleteExpiredPurchaseOrders.length, 
          numberOfExpiredSupplyOrders: responseOfDeleteExpiredSupplyOrders.length, 
          numberOfExpiredPassengerInvites: responseOfDeleteExpiredPassengerInvites.length, 
          numberOfExpiredRidderInvites: responseOfDeleteExpiredRidderInvites.length, 
          numberOfStartedOrders: responseOfDeleteExpiredOrders.length, 
        }, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Delete Cron Job Workflow ================================= */

  /* ================================= Automated Delete operations ================================= */


  /* ================================= Test operations ================================= */
  @Get()
  test(@Res() response: Response) {
    response.status(200).send({context: "Hello Vercel Cron"})
  }
  /* ================================= Test operations ================================= */
}
