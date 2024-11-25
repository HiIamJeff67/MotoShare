import { Module } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { PassengerAuthController } from './passengerAuth.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [PassengerAuthController], 
  providers: [PassengerAuthService], 
  imports: [DrizzleModule, EmailModule], 
})
export class PassengerAuthModule {}
