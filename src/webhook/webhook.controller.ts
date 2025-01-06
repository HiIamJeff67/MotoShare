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
    @Body() buffer: Buffer, // 使用 Buffer 來接收原始請求主體
    @Res() response: Response, 
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) throw ApiWrongWebhookSignatureException;

    try {
      const res = await this.webhookService.handleStripeWebhook(
        buffer, 
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
