import { Controller, Get, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';

@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  // note that all the Cron Jobs are using GET Method
  // make sure the init route in vercel.json is like: "path": "/api/cron", (with "/" in the head)
  // and also make sure that all the subroute should have "/" at their head as well
  /* ================================= Automated Create operations ================================= */
  private async createPurchaseOrdersByPeriodicPurchaseOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.createPurchaseOrdersByPeriodicPurchaseOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfPeriodicPurchaseOrders: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  private async createSupplyOrdersByPeriodicSupplyOrders(@Res() response: Response) {
    try {
      const res = await this.cronService.createSupplyOrdersByPeriodicSupplyOrders();

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        numberOfPeriodicSupplyOrders: res.length, 
      });
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  /* ================================= Automated Create Cron Job Workflow ================================= */
  // @Get('createPeriodicCronJobsWorkflow')
  private async createPeriodicCronJobsWorkflow(@Res() response: Response) {
    try {

      const responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders = await this.cronService.createPurchaseOrdersByPeriodicPurchaseOrders();
      const responseOfCreatingSupplyOrdersByPeriodicSupplyOrders = await this.cronService.createSupplyOrdersByPeriodicSupplyOrders();
      
      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(), 
        message: "All the specified Cron Jobs are done", 
        jobs: {
          createPurchaseOrdersByPeriodicPurchaseOrders: Boolean(responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders), 
          createSupplyOrdersByPeriodicSupplyOrders: Boolean(responseOfCreatingSupplyOrdersByPeriodicSupplyOrders), 
        }, 
        dataCounts: {
          numberOfPeriodicPurchaseOrders: responseOfCreatingPurchaseOrdersByPeriodicPurchaseOrders.length, 
          numberOfPeriodicSupplyOrders: responseOfCreatingSupplyOrdersByPeriodicSupplyOrders.length, 
        }, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Create Cron Job Workflow ================================= */

  /* ================================= Automated Create operations ================================= */


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
  // @Get('/updateCronJobsWorkflow')
  // @CronAuth()
  private async updateCronJobsWorkflow(@Res() response: Response) {
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
  // @Get('/deleteCronJobsWorkflow')
  // @CronAuth()
  private async deleteCronJobsWorkflow(@Res() response: Response) {
    try {

      const responseOfDeletingExpiredPurchaseOrders = await this.cronService.deleteExpiredPurchaseOrders();
      const responseOfDeletingExpiredSupplyOrders = await this.cronService.deleteExpiredSupplyOrders();
      const responseOfDeletingExpiredPassengerInvites = await this.cronService.deleteExpiredPassengerInvites();
      const responseOfDeletingExpiredRidderInvites = await this.cronService.deleteExpiredRidderInvites();
      const responseOfDeletingExpiredOrders = await this.cronService.deleteExpiredOrders();
      const responseOfDeletingExpiredPassengerNotifications = await this.cronService.deleteExpiredPassengerNotifications();
      const responseOfDeletingExpiredRidderNotifications = await this.cronService.deleteExpiredRidderNotifications();
      
      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(), 
        message: "All the specified Cron Jobs are done", 
        jobs: {
          deleteExpiredPurchaseOrders: Boolean(responseOfDeletingExpiredPurchaseOrders), 
          deleteExpiredSupplyOrders: Boolean(responseOfDeletingExpiredSupplyOrders), 
          deleteExpiredPassengerInvites: Boolean(responseOfDeletingExpiredPassengerInvites), 
          deleteExpiredRidderInvites: Boolean(responseOfDeletingExpiredRidderInvites), 
          deleteExpiredOrders: Boolean(responseOfDeletingExpiredOrders), 
          deleteExpiredPassengerNotifications: Boolean(responseOfDeletingExpiredPassengerNotifications), 
          deleteExpiredRidderNotifications: Boolean(responseOfDeletingExpiredRidderNotifications), 
        }, 
        dataCount: {
          numberOfExpiredPurchaseOrders: responseOfDeletingExpiredPurchaseOrders.length, 
          numberOfExpiredSupplyOrders: responseOfDeletingExpiredSupplyOrders.length, 
          numberOfExpiredPassengerInvites: responseOfDeletingExpiredPassengerInvites.length, 
          numberOfExpiredRidderInvites: responseOfDeletingExpiredRidderInvites.length, 
          numberOfStartedOrders: responseOfDeletingExpiredOrders.length, 
          numberOfExpiredPassengerNotifications: responseOfDeletingExpiredPassengerNotifications.length, 
          numberOfExpiredRidderNotifications: responseOfDeletingExpiredRidderNotifications.length, 
        }, 
      })
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Delete Cron Job Workflow ================================= */

  /* ================================= Automated Delete operations ================================= */


  /* ================================= Automated Cron Job Main Workflow operations ================================= */
  @Get('mainCronJobWorkflowDaily')
  async mainCronJobWorkflowDaily(@Res() response: Response) {
    try {
      await this.updateCronJobsWorkflow(response);
      await this.deleteCronJobsWorkflow(response);
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }

  @Get('mainCronJobWorkflowWeekly')
  async mainCronJobWorkflowWeekly(@Res() response: Response) {
    try {
      await this.createPeriodicCronJobsWorkflow(response);
    } catch (error) {
      response.status(error.status).send(error.response);
    }
  }
  /* ================================= Automated Cron Job Main Workflow operations ================================= */


  /* ================================= Test operations ================================= */
  @Get()
  test(@Res() response: Response) {
    response.status(200).send({context: "Hello Vercel Cron"})
  }
  /* ================================= Test operations ================================= */
}
