import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { ApiWrongWebhookSignatureException } from '../exceptions';
import { HttpStatusCode } from '../enums';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripePaymentIntent')
  async handleStripeWebhook(
    @Req() request: Request,  // we don't setup a dto, since stripe request maybe different for tons of types
    @Res() response: Response, 
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) throw ApiWrongWebhookSignatureException;

    try {
      const res = await this.webhookService.handleStripeWebhook(
        request, 
        signature, 
      );

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error.status ?? HttpStatusCode.InternalServerError).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }
}
