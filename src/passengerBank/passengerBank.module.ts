import { Module } from '@nestjs/common';
import { PassengerBankService } from './passengerBank.service';
import { PassengerBankController } from './passengerBank.controller';
import { StripeModule } from '../stripe/stripe.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [PassengerBankController],
  providers: [PassengerBankService],
  imports: [DrizzleModule, StripeModule, NotificationModule]
})
export class PassengerBankModule {}
