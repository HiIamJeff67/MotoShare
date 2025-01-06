import { Controller, Post, Req, Res, Headers, Body, Patch } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { ApiWrongWebhookSignatureException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import * as rawbody from "raw-body";

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripePaymentIntent')
  async handleStripeWebhook(
    @Req() req: Request, 
    @Res() response: Response, 
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) throw ApiWrongWebhookSignatureException;

    if (!req.readable) throw new Error("Not readable!");

    try {
      const raw = await rawbody(req);
      const text = raw.toString().trim();

      const res = await this.webhookService.handleStripeWebhook(
        text, 
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
