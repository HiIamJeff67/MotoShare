import { Controller, Post, Req, Res, Headers, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { ApiWrongWebhookSignatureException } from '../exceptions';
import { HttpStatusCode } from '../enums';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripePaymentIntent')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() body: Buffer,
    @Res() res: Response,
  ) {
    if (!signature) throw ApiWrongWebhookSignatureException;

    try {
      const response = await this.webhookService.handleStripeWebhook(
        body,
        signature,
      );
      res.status(HttpStatusCode.Ok).send(response);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
