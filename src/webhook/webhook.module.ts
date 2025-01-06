import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  controllers: [WebhookController], 
  providers: [WebhookService], 
  imports: [DrizzleModule, StripeModule], 
})
export class WebhookModule {}
