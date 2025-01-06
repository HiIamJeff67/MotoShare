import { Module } from '@nestjs/common';
import { RidderBankService } from './ridderBank.service';
import { RidderBankController } from './ridderBank.controller';
import { StripeModule } from '../stripe/stripe.module';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [RidderBankController],
  providers: [RidderBankService],
  imports: [DrizzleModule, StripeModule]
})
export class RidderBankModule {}
