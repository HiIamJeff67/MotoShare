import { Module } from '@nestjs/common';
import { RidderBankService } from './ridderBank.service';
import { RidderBankController } from './ridderBank.controller';
import { StripeModule } from '../stripe/stripe.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [RidderBankController],
  providers: [RidderBankService],
  imports: [DrizzleModule, StripeModule, NotificationModule], 
})
export class RidderBankModule {}
